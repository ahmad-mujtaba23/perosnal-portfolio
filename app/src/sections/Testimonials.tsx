import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Stack } from "../components/ui/stack";

const testimonialsData = [
  {
    id: 1,
    name: "Usman Noor",
    rating: 5,
    content:
      "Working with Ahmad Mujtaba was a game changer. They took our legacy platform and rebuilt it into a modern, scalable system that our entire engineering team loves.",
    avatar: "UN",
     image: "/images/usman.png",
  },
  {
    id: 2,
    name: "Rabia Ahmed",
    rating: 4.5,
    content:
      "One of the most productive engineers I've ever managed. Ships high quality code at speed, communicates clearly, and genuinely cares about the product.",
    avatar: "RA",
    // image: "https://example.com/marcus.jpg",
  },
  {
    id: 3,
    name: "Subhan Noor",
    rating: 5,
    content:
      "Brought our MVP from concept to launch in record time. The AI powered features they built exceeded our expectations.",
    avatar: "SN",
    image: "/images/subhan.jpeg",
  },
  {
    id: 4,
    name: "Ahmed Mustafa",
    rating: 4,
    content:
      "Delivered critical features for Metiscore under tight deadlines. Autonomous, proactive, and never needed hand holding.",
    avatar: "AM",
    // image: "https://example.com/james.jpg",
  },
  {
    id: 5,
    name: "Muhammad Shaheer",
    rating: 4.5,
    content:
      "Pair programmed with them on a complex GraphQL migration. Their Go and TypeScript expertise is top tier.",
    avatar: "MS",
    // image: "https://example.com/elena.jpg",
  },
];

// ── Helper: rotate stack ──
const rotateStack = <T,>(arr: T[]): T[] => {
  if (arr.length <= 1) return arr;
  const last = arr[arr.length - 1];
  const rest = arr.slice(0, arr.length - 1);
  return [last, ...rest];
};

export function Testimonials() {
  const initialIds = testimonialsData.map((t) => t.id);

  const [stack1Ids, setStack1Ids] = useState(initialIds);
  const [stack2Ids, setStack2Ids] = useState(() => rotateStack(initialIds));

  const isFixingRef = useRef(false);

  // ── SAFETY NET: enforce unique tops ──
  useEffect(() => {
    if (isFixingRef.current) return;
    if (stack1Ids.length === 0 || stack2Ids.length === 0) return;

    const top1 = stack1Ids[stack1Ids.length - 1];
    const top2 = stack2Ids[stack2Ids.length - 1];

    if (top1 === top2) {
      isFixingRef.current = true;
      setStack2Ids((prev) => {
        let newIds = [...prev];
        let attempts = 0;
        while (newIds[newIds.length - 1] === top1 && attempts < prev.length) {
          newIds = rotateStack(newIds);
          attempts++;
        }
        return newIds;
      });
      setTimeout(() => {
        isFixingRef.current = false;
      }, 0);
    }
  }, [stack1Ids, stack2Ids]);

  const cardMap = useMemo(() => {
    const map = new Map();
    testimonialsData.forEach((t) => {
      map.set(t.id, <TestimonialCard key={t.id} {...t} />);
    });
    return map;
  }, []);

  const stack1Cards = useMemo(
    () => stack1Ids.map((id) => cardMap.get(id)!),
    [stack1Ids, cardMap]
  );
  const stack2Cards = useMemo(
    () => stack2Ids.map((id) => cardMap.get(id)!),
    [stack2Ids, cardMap]
  );

  const handleShift1 = useCallback(() => {
    setStack1Ids((prev) => rotateStack(prev));
  }, []);

  const handleShift2 = useCallback(() => {
    setStack2Ids((prev) => rotateStack(prev));
  }, []);

  return (
    <section id="testimonials" className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center">
        <h2
          className="text-3xl sm:text-4xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          What People Say
        </h2>
        <p
          className="mt-3 text-base max-w-2xl mx-auto"
          style={{ color: "var(--text-secondary)" }}
        >
          Kind words from people I've worked with
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-12 mt-12">
        <Stack
          cards={stack1Cards}
          randomRotation
          sendToBackOnClick
          autoplay
          autoplayDelay={4500}
          pauseOnHover
          sensitivity={100}
          onShift={handleShift1}
        />
        <Stack
          cards={stack2Cards}
          randomRotation
          sendToBackOnClick
          autoplay
          autoplayDelay={4500}
          pauseOnHover
          sensitivity={100}
          onShift={handleShift2}
        />
      </div>

      <div className="text-center mt-6">
        <p
          className="text-[11px] font-mono tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          drag to change cards
        </p>
      </div>
    </section>
  );
}

// ── Star Rating Component ──
function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => {
        const starValue = i + 1;
        let fill = 0;
        if (starValue <= fullStars) fill = 1;
        else if (hasHalf && starValue === fullStars + 1) fill = 0.5;

        return (
          <svg
            key={i}
            className="w-4 h-4"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background (empty star) */}
            <path
              d="M10 1L12.39 6.5L18 7.42L14 11.25L15.18 16.58L10 14.25L4.82 16.58L6 11.25L2 7.42L7.61 6.5L10 1Z"
              stroke="var(--border-color)"
              strokeWidth="1.5"
              fill={
                fill === 1
                  ? "var(--accent)"
                  : fill === 0.5
                  ? `url(#half-${i})`
                  : "transparent"
              }
            />
            {fill === 0.5 && (
              <defs>
                <linearGradient id={`half-${i}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="50%" stopColor="var(--accent)" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
            )}
          </svg>
        );
      })}
    </div>
  );
}

// ── Testimonial Card (with image fallback) ──
function TestimonialCard({
  name,
  rating,
  content,
  avatar,
  image,
}: {
  name: string;
  rating: number;
  content: string;
  avatar: string;
  image?: string; // optional image URL
}) {
  return (
    <div
      className="w-[320px] sm:w-[380px] min-h-[200px] rounded-2xl p-6 flex flex-col select-none"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div className="flex items-center gap-4 mb-3">
        {/* Avatar / Image */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg flex-shrink-0 overflow-hidden"
          style={{
            background: image ? "transparent" : "var(--accent)",
            color: image ? "transparent" : "var(--bg)",
          }}
        >
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            avatar
          )}
        </div>
        <div>
          <h4
            className="font-semibold text-sm"
            style={{ color: "var(--text-primary)" }}
          >
            {name}
          </h4>
          <StarRating rating={rating} />
        </div>
      </div>
      <p
        className="text-sm leading-relaxed flex-1"
        style={{ color: "var(--text-secondary)" }}
      >
        &ldquo;{content}&rdquo;
      </p>
    </div>
  );
}