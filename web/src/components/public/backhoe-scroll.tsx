"use client";

import { useEffect, useRef } from "react";

type PartMotion = {
  part: string;
  translateX: number;
  translateY: number;
  rotate: number;
  opacity: number;
};

/** Piezas se separan al hacer scroll (~80vh). */
const DISASSEMBLY: PartMotion[] = [
  { part: "loader-bucket", translateX: -36, translateY: 14, rotate: -36, opacity: 0.15 },
  { part: "loader-arms", translateX: -24, translateY: -22, rotate: -24, opacity: 0.2 },
  { part: "hood", translateX: -12, translateY: -28, rotate: -10, opacity: 0.25 },
  { part: "cabin", translateX: 10, translateY: -32, rotate: 12, opacity: 0.2 },
  { part: "exhaust", translateX: 8, translateY: -40, rotate: 18, opacity: 0.15 },
  { part: "chassis", translateX: 0, translateY: 18, rotate: 6, opacity: 0.3 },
  { part: "wheel-front", translateX: -20, translateY: 24, rotate: -120, opacity: 0.2 },
  { part: "wheel-rear", translateX: 18, translateY: 24, rotate: 120, opacity: 0.2 },
  { part: "stabilizer", translateX: 22, translateY: 26, rotate: 32, opacity: 0.15 },
  { part: "boom", translateX: 28, translateY: -26, rotate: 34, opacity: 0.2 },
  { part: "stick", translateX: 38, translateY: 10, rotate: 44, opacity: 0.18 },
  { part: "bucket", translateX: 42, translateY: 22, rotate: 56, opacity: 0.12 },
];

const GOLD = "#C9A227";
const GOLD_DIM = "#A88820";
const BLACK = "#0a0a0a";
const METAL = "#9a9a92";

type PartState = {
  x: number;
  y: number;
  r: number;
  o: number;
  el: SVGElement;
  cx: number;
  cy: number;
};

type BackhoeScrollProps = {
  className?: string;
};

function partCenter(el: SVGElement) {
  try {
    const box = (el as SVGGraphicsElement).getBBox();
    return { cx: box.x + box.width / 2, cy: box.y + box.height / 2 };
  } catch {
    return { cx: 100, cy: 48 };
  }
}

function applyPart(state: PartState) {
  const { el, x, y, r, o, cx, cy } = state;
  el.setAttribute(
    "transform",
    `translate(${cx + x} ${cy + y}) rotate(${r}) translate(${-cx} ${-cy})`,
  );
  el.style.opacity = String(o);
}

export function BackhoeScroll({ className }: BackhoeScrollProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let revert: (() => void) | undefined;

    void (async () => {
      const { createTimeline, onScroll } = await import("animejs");
      if (cancelled) return;

      const states: PartState[] = [];
      for (const motion of DISASSEMBLY) {
        const el = root.querySelector<SVGElement>(`[data-part="${motion.part}"]`);
        if (!el) continue;
        const { cx, cy } = partCenter(el);
        const state: PartState = { x: 0, y: 0, r: 0, o: 1, el, cx, cy };
        applyPart(state);
        states.push(state);
      }

      const timeline = createTimeline({
        autoplay: false,
        defaults: { ease: "linear", duration: 1000 },
      });

      DISASSEMBLY.forEach((motion) => {
        const state = states.find((s) => s.el.getAttribute("data-part") === motion.part);
        if (!state) return;
        timeline.add(
          state,
          {
            x: motion.translateX,
            y: motion.translateY,
            r: motion.rotate,
            o: motion.opacity,
            onRender: () => applyPart(state),
          },
          0,
        );
      });

      const marker = document.createElement("div");
      marker.setAttribute("aria-hidden", "true");
      marker.style.cssText =
        "position:absolute;top:0;left:0;width:1px;height:80vh;pointer-events:none;opacity:0;";
      document.body.prepend(marker);

      // anime.js: string = "container target"
      const scrollObs = onScroll({
        target: marker,
        sync: true,
        enter: "top top",
        leave: "top bottom",
      }).link(timeline);

      const seekFromScroll = () => {
        const max = Math.max(1, window.innerHeight * 0.8);
        const p = Math.min(1, Math.max(0, window.scrollY / max));
        timeline.seek(timeline.duration * p);
      };
      window.addEventListener("scroll", seekFromScroll, { passive: true });
      seekFromScroll();

      revert = () => {
        window.removeEventListener("scroll", seekFromScroll);
        scrollObs.revert();
        timeline.revert();
        for (const state of states) {
          state.el.removeAttribute("transform");
          state.el.style.opacity = "";
        }
        marker.remove();
      };

      if (cancelled) revert();
    })();

    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={className ?? "pointer-events-none select-none"}
      aria-hidden
    >
      <svg
        viewBox="0 0 200 96"
        className="h-11 w-[5.75rem] sm:h-12 sm:w-[6.5rem]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="bh-part" data-part="wheel-front">
          <circle cx="62" cy="78" r="14" fill={BLACK} stroke={GOLD} strokeWidth="1.5" />
          <circle cx="62" cy="78" r="7" fill={GOLD_DIM} />
          <circle cx="62" cy="78" r="2.5" fill={BLACK} />
          <path
            d="M62 66v4M62 86v4M50 78h4M70 78h4"
            stroke={BLACK}
            strokeWidth="1.2"
            opacity="0.55"
          />
        </g>

        <g className="bh-part" data-part="wheel-rear">
          <circle cx="118" cy="76" r="16" fill={BLACK} stroke={GOLD} strokeWidth="1.5" />
          <circle cx="118" cy="76" r="8" fill={GOLD_DIM} />
          <circle cx="118" cy="76" r="3" fill={BLACK} />
          <path
            d="M118 62v4M118 86v4M104 76h4M128 76h4"
            stroke={BLACK}
            strokeWidth="1.2"
            opacity="0.55"
          />
        </g>

        <g className="bh-part" data-part="chassis">
          <path d="M48 68h78l4-10H52l-4 6z" fill={GOLD} />
          <path d="M54 62h66v6H54z" fill={BLACK} opacity="0.28" />
          <path d="M70 58h36v8H70z" fill={GOLD_DIM} />
        </g>

        <g className="bh-part" data-part="hood">
          <path d="M52 58h28l2-14H56l-4 8z" fill={GOLD} />
          <path d="M58 52h18l.8-6H60z" fill={BLACK} opacity="0.35" />
          <path d="M60 48h14" stroke={BLACK} strokeWidth="0.8" opacity="0.4" />
        </g>

        <g className="bh-part" data-part="cabin">
          <path d="M82 58h28l-2-22-24 3z" fill={GOLD} />
          <path d="M88 54h18l-1-14-16 2z" fill={BLACK} opacity="0.5" />
          <path d="M90 48h12M90 44h10" stroke={METAL} strokeWidth="0.7" opacity="0.7" />
          <rect x="84" y="56" width="24" height="3" fill={BLACK} opacity="0.25" />
        </g>

        <g className="bh-part" data-part="exhaust">
          <rect x="106" y="28" width="3.5" height="18" rx="1" fill={BLACK} />
          <rect x="105.5" y="26" width="4.5" height="4" rx="1" fill={METAL} />
        </g>

        <g className="bh-part" data-part="loader-arms">
          <path
            d="M54 56 28 48"
            stroke={GOLD}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M52 62 30 54"
            stroke={GOLD_DIM}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="54" cy="58" r="2.5" fill={BLACK} stroke={GOLD} strokeWidth="1" />
          <path d="M48 54 34 50" stroke={METAL} strokeWidth="1.6" strokeLinecap="round" />
        </g>

        <g className="bh-part" data-part="loader-bucket">
          <path
            d="M28 46 8 52l4 16 22-6z"
            fill={GOLD}
            stroke={BLACK}
            strokeWidth="1"
          />
          <path d="M12 60h14" stroke={BLACK} strokeWidth="1.2" opacity="0.45" />
          <path d="M10 54 26 48" stroke={BLACK} strokeWidth="0.8" opacity="0.35" />
        </g>

        <g className="bh-part" data-part="stabilizer">
          <path
            d="M126 70 138 88"
            stroke={GOLD}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path d="M134 86h10" stroke={BLACK} strokeWidth="2.5" strokeLinecap="round" />
        </g>

        <g className="bh-part" data-part="boom">
          <path
            d="M124 58c8-18 22-28 38-30"
            stroke={GOLD}
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="124" cy="58" r="3.5" fill={BLACK} stroke={GOLD} strokeWidth="1.2" />
          <path
            d="M128 52 148 36"
            stroke={METAL}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>

        <g className="bh-part" data-part="stick">
          <path
            d="M162 28 178 52"
            stroke={GOLD}
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          <circle cx="162" cy="28" r="3" fill={BLACK} stroke={GOLD} strokeWidth="1" />
          <path
            d="M164 34 174 48"
            stroke={METAL}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>

        <g className="bh-part" data-part="bucket">
          <path
            d="M178 50 192 58l-4 14-16-6z"
            fill={GOLD}
            stroke={BLACK}
            strokeWidth="1"
          />
          <path d="M182 64h10" stroke={BLACK} strokeWidth="1" opacity="0.45" />
          <circle cx="178" cy="52" r="2.2" fill={BLACK} stroke={GOLD} strokeWidth="0.9" />
        </g>
      </svg>
    </div>
  );
}
