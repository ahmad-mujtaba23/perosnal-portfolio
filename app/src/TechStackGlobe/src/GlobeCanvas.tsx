import { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import type { TechItem } from './types';
import { getLogoSrc, getMonogram } from './skill-logo';

// ---------------------------------------------------------------------------
// Fibonacci sphere — exactly N uniformly distributed vertices + K-NN edges
// ---------------------------------------------------------------------------

type Vec3 = [number, number, number];

function dist2(a: Vec3, b: Vec3): number {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
}

function buildFibonacciSphere(n: number): { verts: Vec3[]; edges: [number, number][] } {
  const golden = (1 + Math.sqrt(5)) / 2;
  const verts: Vec3[] = [];
  for (let i = 0; i < n; i++) {
    const theta = Math.acos(1 - 2 * (i + 0.5) / n);
    const phi   = 2 * Math.PI * i / golden;
    verts.push([
      Math.sin(theta) * Math.cos(phi),
      Math.cos(theta),
      Math.sin(theta) * Math.sin(phi),
    ]);
  }

  // Connect each vertex to its 5 nearest neighbours
  const K = 5;
  const edgeSet = new Set<string>();
  const edges: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const sorted = verts
      .map((_, j) => ({ j, d: dist2(verts[i], verts[j]) }))
      .filter(x => x.j !== i)
      .sort((a, b) => a.d - b.d);
    for (let k = 0; k < Math.min(K, sorted.length); k++) {
      const j   = sorted[k].j;
      const key = i < j ? `${i}_${j}` : `${j}_${i}`;
      if (!edgeSet.has(key)) { edgeSet.add(key); edges.push([i, j]); }
    }
  }
  return { verts, edges };
}

// ---------------------------------------------------------------------------
// Vertex-to-item mapping — spatial scan so nearby verts differ visually
// ---------------------------------------------------------------------------

function buildVertexItemMap(verts: Vec3[], itemCount: number): number[] {
  const order = verts
    .map((v, i) => ({ i, sort: -v[1] * 100 + Math.atan2(v[2], v[0]) }))
    .sort((a, b) => a.sort - b.sort)
    .map(x => x.i);

  const map = new Array<number>(verts.length);
  order.forEach((vi, pos) => { map[vi] = pos % itemCount; });
  return map;
}

// ---------------------------------------------------------------------------
// 3-D helpers
// ---------------------------------------------------------------------------

function rotateY(v: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle), s = Math.sin(angle);
  return [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c];
}

function rotateX(v: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle), s = Math.sin(angle);
  return [v[0], v[1] * c - v[2] * s, v[1] * s + v[2] * c];
}

function project(v: Vec3, fov: number, cx: number, cy: number, radius: number) {
  const fovScale = fov / (fov + v[2] * radius);
  return { x: cx + v[0] * radius * fovScale, y: cy + v[1] * radius * fovScale, z: v[2] };
}

// Clamp delta to [-π, π] for shortest-arc lerp
function shortestDelta(from: number, to: number): number {
  let d = (to - from) % (2 * Math.PI);
  if (d > Math.PI)  d -= 2 * Math.PI;
  if (d < -Math.PI) d += 2 * Math.PI;
  return d;
}

function iconShadow(selected: boolean, hovered: boolean): string {
  if (selected) return '0 4px 16px rgba(0,0,0,0.4),0 0 0 2px rgba(45,212,191,0.9)';
  if (hovered)  return '0 8px 24px rgba(0,0,0,0.5),0 0 0 1.5px rgba(45,212,191,0.7)';
  return '0 2px 8px rgba(0,0,0,0.3)';
}

// ---------------------------------------------------------------------------
// Props & component
// ---------------------------------------------------------------------------

export interface GlobeCanvasProps {
  items: TechItem[];
  onSelect: (item: TechItem, targetAngleY: number, targetAngleX: number) => void;
  frozen: boolean;
  noSpin: boolean;
  overrideAngle?: number | null;
  overrideAngleX?: number | null;
  onAnimationDone?: () => void;
  selectedSlug?: string | null;
  logoOverrides?: Record<string, string>;
}

export default function GlobeCanvas({
  items,
  onSelect,
  frozen,
  noSpin,
  overrideAngle,
  overrideAngleX,
  onAnimationDone,
  selectedSlug,
  logoOverrides,
}: GlobeCanvasProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const angleRef     = useRef(0);
  const angleXRef    = useRef(0);
  const rafRef       = useRef<number | null>(null);
  const frozenRef    = useRef(frozen);
  const noSpinRef    = useRef(noSpin);

  const [hoveredVertex, setHoveredVertex] = useState<number | null>(null);
  const [tooltip, setTooltip]             = useState<{ x: number; y: number; name: string } | null>(null);
  const [imgErrors, setImgErrors]         = useState<Set<string>>(new Set());
  const [iconPositions, setIconPositions] = useState<Array<{ vi: number; x: number; y: number; z: number }>>([]);

  const sizeRef = useRef({ w: 0, h: 0, radius: 0 });

  const sphere     = useMemo(() => buildFibonacciSphere(items.length), [items.length]);
  const vtxItemMap = useMemo(() => buildVertexItemMap(sphere.verts, items.length), [sphere, items.length]);

  const lerpRef  = useRef<{ from: number; to: number; start: number; duration: number } | null>(null);
  const lerpXRef = useRef<{ from: number; to: number; start: number; duration: number } | null>(null);

  useEffect(() => { frozenRef.current = frozen; }, [frozen]);

  useEffect(() => {
    const justClosed = !noSpin && noSpinRef.current;
    noSpinRef.current = noSpin;
    if (justClosed) {
      lerpXRef.current = { from: angleXRef.current, to: 0, start: performance.now(), duration: 500 };
    }
  }, [noSpin]);

  useEffect(() => {
    if (overrideAngle == null) return;
    const delta = shortestDelta(angleRef.current, overrideAngle);
    lerpRef.current = { from: angleRef.current, to: angleRef.current + delta, start: performance.now(), duration: 650 };
  }, [overrideAngle]);

  useEffect(() => {
    if (overrideAngleX == null) return;
    const delta = shortestDelta(angleXRef.current, overrideAngleX);
    lerpXRef.current = { from: angleXRef.current, to: angleXRef.current + delta, start: performance.now(), duration: 650 };
  }, [overrideAngleX]);

  const getSize = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { width: w, height: h } = el.getBoundingClientRect();
    const radius = Math.min(w, h) * 0.43;
    sizeRef.current = { w, h, radius };
    const canvas = canvasRef.current;
    if (canvas) { canvas.width = w; canvas.height = h; }
  }, []);

  const draw = useCallback((now: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { w, h, radius } = sizeRef.current;
    if (w === 0) { rafRef.current = requestAnimationFrame(draw); return; }
    const cx = w / 2, cy = h / 2;
    const FOV = radius * 3;

    if (lerpRef.current) {
      const { from, to, start, duration } = lerpRef.current;
      const t     = Math.min((now - start) / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      angleRef.current = from + (to - from) * eased;
      if (t >= 1) { lerpRef.current = null; onAnimationDone?.(); }
    } else if (!frozenRef.current && !noSpinRef.current) {
      angleRef.current += 0.004;
    }

    if (lerpXRef.current) {
      const { from, to, start, duration } = lerpXRef.current;
      const t     = Math.min((now - start) / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      angleXRef.current = from + (to - from) * eased;
      if (t >= 1) lerpXRef.current = null;
    }

    const angle  = angleRef.current;
    const angleX = angleXRef.current;

    const projected = sphere.verts.map(v =>
      project(rotateX(rotateY(v, angle), angleX), FOV, cx, cy, radius)
    );

    const lightMode = (document.documentElement.getAttribute('data-theme') ?? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')) === 'light';
    const edgeBase  = lightMode ? 0.14 : 0.04;
    const edgeRange = lightMode ? 0.36 : 0.16;

    ctx.clearRect(0, 0, w, h);
    for (const [a, b] of sphere.edges) {
      const pa = projected[a], pb = projected[b];
      const alpha = ((pa.z + pb.z) / 2 + 1) / 2;
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.strokeStyle = `rgba(45,212,191,${edgeBase + alpha * edgeRange})`;
      ctx.lineWidth   = 0.8;
      ctx.stroke();
    }

    setIconPositions(sphere.verts.map((_, vi) => ({
      vi, x: projected[vi].x, y: projected[vi].y, z: projected[vi].z,
    })));

    rafRef.current = requestAnimationFrame(draw);
  }, [onAnimationDone, sphere]);

  useEffect(() => {
    getSize();
    const ro = new ResizeObserver(getSize);
    if (containerRef.current) ro.observe(containerRef.current);
    rafRef.current = requestAnimationFrame(draw);
    return () => { ro.disconnect(); if (rafRef.current != null) cancelAnimationFrame(rafRef.current); };
  }, [draw, getSize]);

  const getHitPositions = useCallback(() => {
    const { w, h, radius } = sizeRef.current;
    const cx = w / 2, cy = h / 2;
    const FOV    = radius * 3;
    const angle  = angleRef.current;
    const angleX = angleXRef.current;
    return sphere.verts.map((_, vi) => ({
      vi,
      ...project(rotateX(rotateY(sphere.verts[vi], angle), angleX), FOV, cx, cy, radius),
    }));
  }, [sphere]);

  const findClosestFront = useCallback((mx: number, my: number, hitR = 30) => {
    let best: { vi: number; z: number } | null = null;
    for (const p of getHitPositions()) {
      const dx = mx - p.x, dy = my - p.y;
      if (dx * dx + dy * dy < hitR * hitR) {
        if (!best || p.z > best.z) best = { vi: p.vi, z: p.z };
      }
    }
    return best;
  }, [getHitPositions]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (frozenRef.current) return;
    const rect = containerRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const found = findClosestFront(mx, my);
    if (found) {
      const pos = getHitPositions().find(p => p.vi === found.vi)!;
      setHoveredVertex(found.vi);
      setTooltip({ x: pos.x, y: pos.y - 46, name: items[vtxItemMap[found.vi]].name });
    } else {
      setHoveredVertex(null);
      setTooltip(null);
    }
  }, [findClosestFront, getHitPositions, items, vtxItemMap]);

  const handleMouseLeave = useCallback(() => { setHoveredVertex(null); setTooltip(null); }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (frozenRef.current) return;
    const rect = containerRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const found = findClosestFront(mx, my);
    if (!found) return;

    const v = sphere.verts[found.vi];
    const targetAngleY  = Math.atan2(-v[0], v[2]);
    const r_xz          = Math.sqrt(v[0] ** 2 + v[2] ** 2);
    const targetAngleX  = Math.atan2(v[1], r_xz);

    onSelect(items[vtxItemMap[found.vi]], targetAngleY, targetAngleX);
    setHoveredVertex(null);
    setTooltip(null);
  }, [findClosestFront, items, onSelect, sphere, vtxItemMap]);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (frozenRef.current) return;
    const touch = e.changedTouches[0];
    const rect = containerRef.current!.getBoundingClientRect();
    const mx = touch.clientX - rect.left, my = touch.clientY - rect.top;
    const found = findClosestFront(mx, my, 44);
    if (!found) return;

    const v = sphere.verts[found.vi];
    const targetAngleY = Math.atan2(-v[0], v[2]);
    const r_xz         = Math.sqrt(v[0] ** 2 + v[2] ** 2);
    const targetAngleX = Math.atan2(v[1], r_xz);

    onSelect(items[vtxItemMap[found.vi]], targetAngleY, targetAngleX);
    setHoveredVertex(null);
    setTooltip(null);
  }, [findClosestFront, items, onSelect, sphere, vtxItemMap]);

  const sorted = [...iconPositions].sort((a, b) => a.z - b.z);

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: '100%', cursor: frozen ? 'default' : 'pointer' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onTouchEnd={handleTouchEnd}
    >
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      {sorted.map(({ vi, x, y, z }) => {
        const item    = items[vtxItemMap[vi]];
        const depth   = (z + 1) / 2;
        const scale   = 0.48 + depth * 0.52;
        const opacity = 0.18 + depth * 0.82;
        const isHov   = hoveredVertex === vi && !frozen;
        const isSel   = !!selectedSlug && item.slug === selectedSlug;
        const errKey  = `${vi}_${item.slug}`;

        return (
          <div
            key={vi}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: `translate(-50%,-50%) scale(${isHov ? scale * 1.15 : scale})`,
              opacity: isSel || isHov ? 1 : opacity,
              transition: 'transform 120ms ease, opacity 120ms ease',
              zIndex: isSel ? 150 : Math.round(depth * 100),
              pointerEvents: 'none',
            }}
          >
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: iconShadow(isSel, isHov),
              transition: 'box-shadow 120ms ease',
            }}>
              {!imgErrors.has(errKey) ? (
                <img
                  src={getLogoSrc(item.slug, logoOverrides)}
                  alt={item.name}
                  style={{ width: 26, height: 26, display: 'block' }}
                  onError={() => setImgErrors(prev => new Set(prev).add(errKey))}
                  draggable={false}
                />
              ) : (
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.5rem', fontWeight: 700, color: '#333', letterSpacing: '0.04em' }}>
                  {getMonogram(item.name)}
                </span>
              )}
            </div>
          </div>
        );
      })}

      {tooltip && !frozen && (
        <div style={{
          position: 'absolute', left: tooltip.x, top: tooltip.y,
          transform: 'translateX(-50%)',
          background: 'var(--color-surface-2, #1e1e1e)', border: '1px solid var(--color-border, #333)',
          borderRadius: 6, padding: '4px 10px', pointerEvents: 'none', zIndex: 200, whiteSpace: 'nowrap',
        }}>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.65rem', letterSpacing: '0.06em', color: 'var(--color-text, #fff)' }}>
            {tooltip.name}
          </span>
        </div>
      )}
    </div>
  );
}
