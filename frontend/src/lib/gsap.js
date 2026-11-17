import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const scrollDefaults = {
  start: "top 88%",
  toggleActions: "play none none none",
};

export function revealOnScroll(targets, vars = {}) {
  if (prefersReducedMotion()) {
    gsap.set(targets, { clearProps: "all", opacity: 1, y: 0, scale: 1 });
    return null;
  }

  const { scrollTrigger: scrollVars, ...rest } = vars;
  return gsap.from(targets, {
    opacity: 0,
    y: 48,
    duration: 1.15,
    stagger: 0.16,
    ease: "power3.out",
    ...rest,
    scrollTrigger: {
      ...scrollDefaults,
      ...(typeof scrollVars === "object" ? scrollVars : {}),
      trigger: scrollVars?.trigger || (typeof targets === "string" ? targets : undefined),
    },
  });
}

export function popOnScroll(targets, vars = {}) {
  if (prefersReducedMotion()) {
    gsap.set(targets, { clearProps: "all", opacity: 1, scale: 1 });
    return null;
  }

  const { scrollTrigger: scrollVars, ...rest } = vars;
  return gsap.from(targets, {
    opacity: 0,
    scale: 0.82,
    y: 24,
    duration: 1,
    stagger: 0.14,
    ease: "back.out(1.4)",
    ...rest,
    scrollTrigger: {
      ...scrollDefaults,
      ...(typeof scrollVars === "object" ? scrollVars : {}),
      trigger: scrollVars?.trigger || (typeof targets === "string" ? targets : undefined),
    },
  });
}

export function pulseBuy(button) {
  if (!button || prefersReducedMotion()) return;
  gsap.fromTo(
    button,
    { scale: 1 },
    {
      scale: 1.08,
      duration: 0.16,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    }
  );
}
