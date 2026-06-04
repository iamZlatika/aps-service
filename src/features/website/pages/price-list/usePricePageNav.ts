import { useCallback, useEffect, useRef, useState } from "react";

type SectionRef = (el: HTMLElement | null) => void;

type UsePricePageNavResult = {
  activeKey: string;
  registerSection: (key: string) => SectionRef;
  scrollTo: (key: string) => void;
};

export const usePricePageNav = (initialKey: string): UsePricePageNavResult => {
  const [activeKey, setActiveKey] = useState(initialKey);
  const sectionsRef = useRef<Map<string, HTMLElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const callbacksRef = useRef<Map<string, SectionRef>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const id = visible[0].target.id;
          setActiveKey(id.replace("price-section-", ""));
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    observerRef.current = observer;
    sectionsRef.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const registerSection = useCallback((key: string): SectionRef => {
    const existing = callbacksRef.current.get(key);
    if (existing) return existing;

    const cb: SectionRef = (el) => {
      const observer = observerRef.current;
      const prev = sectionsRef.current.get(key);
      if (prev) {
        observer?.unobserve(prev);
        sectionsRef.current.delete(key);
      }
      if (el) {
        sectionsRef.current.set(key, el);
        observer?.observe(el);
      }
    };
    callbacksRef.current.set(key, cb);
    return cb;
  }, []);

  const scrollTo = useCallback((key: string) => {
    sectionsRef.current
      .get(key)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveKey(key);
  }, []);

  return { activeKey, registerSection, scrollTo };
};
