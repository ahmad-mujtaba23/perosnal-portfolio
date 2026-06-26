import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlobeCanvas from './GlobeCanvas';
import InfoPanel from './InfoPanel';
import type { TechItem } from './types';

export interface TechStackGlobeProps {
  items: TechItem[];
  height?: number;
  categoryColors?: Record<string, string>;
  logoOverrides?: Record<string, string>;
  hintText?: string;
}

export default function TechStackGlobe({
  items,
  height = 540,
  categoryColors,
  logoOverrides,
  hintText = 'hover to identify · click to explore',
}: TechStackGlobeProps) {
  const [selected, setSelected]         = useState<TechItem | null>(null);
  const [panelOpen, setPanelOpen]       = useState(false);
  const [spinning, setSpinning]         = useState(false);
  const [targetAngleY, setTargetAngleY] = useState<number | null>(null);
  const [targetAngleX, setTargetAngleX] = useState<number | null>(null);
  const [isMobile, setIsMobile]         = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    setIsCoarsePointer(window.matchMedia('(pointer: coarse)').matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleSelect = useCallback((item: TechItem, angleY: number, angleX: number) => {
    setSelected(item);
    setTargetAngleY(angleY);
    setTargetAngleX(angleX);
    setSpinning(true);
  }, []);

  const handleSpinDone = useCallback(() => {
    setTargetAngleY(null);
    setTargetAngleX(null);
    setSpinning(false);
    setPanelOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setPanelOpen(false);
    setSpinning(false);
  }, []);

  const globeShifted = !isMobile && (panelOpen || spinning);
  const frozen       = spinning;
  const noSpin       = panelOpen || spinning;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {isMobile ? (
        <div>
          <div style={{ position: 'relative', height: 320 }}>
            <GlobeCanvas
              items={items}
              onSelect={handleSelect}
              frozen={frozen}
              noSpin={noSpin}
              overrideAngle={targetAngleY}
              overrideAngleX={targetAngleX}
              onAnimationDone={handleSpinDone}
              selectedSlug={panelOpen ? selected?.slug : null}
              logoOverrides={logoOverrides}
            />
          </div>
          <AnimatePresence>
            {panelOpen && selected && (
              <motion.div
                key="panel-mobile"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 480, marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                <InfoPanel
                  item={selected}
                  onClose={handleClose}
                  categoryColors={categoryColors}
                  logoOverrides={logoOverrides}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div style={{ position: 'relative', height }}>

          {/* Globe — shifts left as soon as an item is clicked */}
          <motion.div
            animate={{ x: globeShifted ? '-26%' : '0%' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <GlobeCanvas
              items={items}
              onSelect={handleSelect}
              frozen={frozen}
              noSpin={noSpin}
              overrideAngle={targetAngleY}
              overrideAngleX={targetAngleX}
              onAnimationDone={handleSpinDone}
              selectedSlug={panelOpen ? selected?.slug : null}
              logoOverrides={logoOverrides}
            />
          </motion.div>

          {/* Info panel — stays mounted across re-selections for smooth transitions */}
          <AnimatePresence>
            {panelOpen && selected && (
              <motion.div
                key="panel-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  position: 'absolute',
                  top: 0, right: 0,
                  width: '42%',
                  height: '100%',
                  zIndex: 10,
                }}
              >
                <InfoPanel
                  item={selected}
                  onClose={handleClose}
                  categoryColors={categoryColors}
                  logoOverrides={logoOverrides}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Hint — shown only when nothing is selected */}
      <AnimatePresence>
        {!panelOpen && !spinning && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              textAlign: 'center',
              marginTop: '2.5rem',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.62rem',
              letterSpacing: '0.08em',
              color: 'var(--color-text-muted, #666)',
            }}
          >
            {isCoarsePointer ? 'tap to explore' : hintText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
