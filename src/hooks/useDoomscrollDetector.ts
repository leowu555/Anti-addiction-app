/**
 * useDoomscrollDetector
 * Simulates doomscroll detection via scroll events.
 * Triggers when: continuous scroll >45s OR rapid scroll >2500px.
 */

import { useEffect, useRef, useCallback } from 'react';

interface DoomscrollThresholds {
  /** Seconds of continuous scrolling to trigger */
  timeSeconds?: number;
  /** Total px scrolled rapidly to trigger */
  scrollPx?: number;
}

const DEFAULT_THRESHOLDS = {
  timeSeconds: 45,
  scrollPx: 2500,
};

export function useDoomscrollDetector(
  onTrigger: () => void,
  options: DoomscrollThresholds = {}
) {
  const { timeSeconds, scrollPx } = { ...DEFAULT_THRESHOLDS, ...options };
  const scrollStartRef = useRef<number | null>(null);
  const totalScrollRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasTriggeredRef = useRef(false);

  const reset = useCallback(() => {
    scrollStartRef.current = null;
    totalScrollRef.current = 0;
    lastScrollYRef.current = window.scrollY;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const fire = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    onTrigger();
    reset();
  }, [onTrigger, reset]);

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const now = Date.now();
      const currentY = window.scrollY;
      const delta = Math.abs(currentY - lastY);
      lastY = currentY;

      if (scrollStartRef.current === null) {
        scrollStartRef.current = now;
        lastScrollYRef.current = currentY;
      }

      totalScrollRef.current += delta;
      const elapsed = (now - scrollStartRef.current) / 1000;

      if (elapsed >= timeSeconds || totalScrollRef.current >= scrollPx) {
        fire();
        return;
      }

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        scrollStartRef.current = null;
        totalScrollRef.current = 0;
        lastScrollYRef.current = currentY;
        timeoutRef.current = null;
      }, 2000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [timeSeconds, scrollPx, fire]);

  return { reset, resetTrigger: () => { hasTriggeredRef.current = false; } };
}
