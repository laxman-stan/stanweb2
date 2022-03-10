import { useState, useEffect } from 'react';

export default function useOnScreen(ref, fun, threshold = .2, noObserver) {


  useEffect(() => {
    if(!noObserver){
    const observer = new IntersectionObserver(
      ([entry]) => {
        fun(entry.isIntersecting);
      },
      {
        threshold
      }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }

    return ()=> observer?.unobserve(ref.current);
  }

  }, []);

}
