import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";

interface StackProps {
  cards: ReactNode[];
  randomRotation?: boolean;
  sensitivity?: number;
  sendToBackOnClick?: boolean;
  animationConfig?: { stiffness: number; damping: number };
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  onShift?: (newTopId: number) => void;
}

// ── Internal CardRotate (Tinder‑style drag) ──
function CardRotate({
  children,
  onSendToBack,
  sensitivity,
  isTop,
}: {
  children: ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
  isTop: boolean;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  function handleDragEnd(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    const distance = Math.sqrt(info.offset.x ** 2 + info.offset.y ** 2);
    if (distance > sensitivity) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  if (!isTop) {
    return <div className="absolute top-0 left-0 w-full h-full pointer-events-none">{children}</div>;
  }

  return (
    <motion.div
      className="absolute top-0 left-0 w-full h-full cursor-grab active:cursor-grabbing"
      style={{ x, y, rotateX, rotateY, originX: 0.5, originY: 0.5 }}
      drag
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      dragElastic={0.6}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
}

// ── Main Stack ──
export function Stack({
  cards,
  randomRotation = false,
  sensitivity = 100,
  sendToBackOnClick = false,
  animationConfig = { stiffness: 300, damping: 30 },
  autoplay = false,
  autoplayDelay = 4000,
  pauseOnHover = false,
  onShift,
}: StackProps) {
  const [stack, setStack] = useState<{ id: number; content: ReactNode }[]>(() =>
    cards.map((content, index) => ({ id: index + 1, content }))
  );

  const autoplayTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // ── Track previous top ID ──
  const initialTopId = stack.length > 0 ? stack[stack.length - 1].id : null;
  const prevTopIdRef = useRef<number | null>(initialTopId);

  // Sync when external `cards` prop changes
  useEffect(() => {
    setStack(cards.map((content, index) => ({ id: index + 1, content })));
  }, [cards]);

  // ── SINGLE update `sendToBack` (no race condition) ──
  const sendToBack = (id: number) => {
    setStack((prev) => {
      if (prev.length <= 1) return prev;
      const index = prev.findIndex((card) => card.id === id);
      if (index === -1) return prev;

      // Move the dragged card to the front (index 0)
      const card = prev[index];
      const newStack = [card, ...prev.slice(0, index), ...prev.slice(index + 1)];
      return newStack;
    });
  };

  // ── Notify parent ONLY when the top card actually changes ──
  useEffect(() => {
    if (stack.length === 0) return;
    const currentTopId = stack[stack.length - 1].id;

    if (prevTopIdRef.current !== null && currentTopId !== prevTopIdRef.current) {
      onShift?.(currentTopId);
    }
    prevTopIdRef.current = currentTopId;
  }, [stack, onShift]);

  // ── Autoplay ──
  useEffect(() => {
    if (!autoplay || stack.length <= 1 || isPaused) {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
      return;
    }
    autoplayTimer.current = setInterval(() => {
      const topCard = stack[stack.length - 1];
      if (topCard) sendToBack(topCard.id);
    }, autoplayDelay);

    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    };
  }, [autoplay, autoplayDelay, stack, isPaused]);

  // ── Pause on hover ──
  const handleMouseEnter = () => {
    if (pauseOnHover && autoplay) setIsPaused(true);
  };
  const handleMouseLeave = () => {
    if (pauseOnHover && autoplay) setIsPaused(false);
  };

  // ── Click to send to back ──
  const handleCardClick = (id: number) => {
    if (sendToBackOnClick) sendToBack(id);
  };

  // ── Render ──
  return (
    <div
      className="relative w-[340px] sm:w-[400px] h-[270px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {stack.map((card, index) => {
        const isTop = index === stack.length - 1;
        //const indexFromBottom = index;
        const randomRot = randomRotation ? (Math.random() * 10 - 5) : 0;
        const rotateZ = (stack.length - 1 - index) * 4 + randomRot;
        const scale = 1 - (stack.length - 1 - index) * 0.04;

        return (
          <motion.div
            key={card.id}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            animate={{
              rotateZ,
              scale,
            }}
            transition={{
              type: "spring",
              stiffness: animationConfig.stiffness,
              damping: animationConfig.damping,
            }}
            style={{ originX: 0.5, originY: 0.5 }}
            onClick={() => handleCardClick(card.id)}
          >
            <CardRotate
              isTop={isTop}
              onSendToBack={() => sendToBack(card.id)}
              sensitivity={sensitivity}
            >
              <div className="pointer-events-auto">{card.content}</div>
            </CardRotate>
          </motion.div>
        );
      })}
    </div>
  );
}