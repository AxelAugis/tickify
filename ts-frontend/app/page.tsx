'use client';

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroScrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to('.main-title', { y: -20, duration: 0.5, opacity: 1, ease: "power2.out" });
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        immediateRender: false,
      }
    });
    
    gsap.set(heroScrollRef.current, { 
      width: 0, 
      height: 0,
      borderRadius: "16px"
    });
    
    gsap.set('.hero-h2', { opacity: 0 });
    
    tl.to(heroScrollRef.current, { 
      width: '100%', 
      height: '100vh', 
      borderRadius: "0px",
      duration: 1, 
      ease: "power2.out" 
    });

    tl.fromTo('.main-title', 
      { y: -20, opacity: 1 }, 
      { opacity: 0, y: -100, duration: 0.5, ease: "power2.out" }, 
      0
    );
    
    tl.to('.hero-h2', { 
      opacity: 1, 
      y: -50,
      fontSize: "2.5rem",
      duration: 0.5, 
      ease: "power2.out" 
    }, 0.2);
    
  }, [heroRef, containerRef]);

  return (
    <div className={`min-h-screen bg-accent-full flex flex-col`}>
      <div ref={containerRef} className="h-screen w-full relative">
        <main className="flex flex-col items-center w-full h-full">
          <div ref={heroRef} className={`w-full flex flex-col items-center h-screen pt-72`}>
            <h1 className="text-6xl font-bold text-center text-accent-light main-title opacity-0">
              Repensez la gestion de projet
            </h1>
          </div>
          <div ref={heroScrollRef} className={`bg-white origin-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-xl overflow-hidden`}>
            <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
              <h2 className="text-xl font-bold text-center text-black opacity-0 hero-h2">Gérer vos projets n&apos;a jamais été aussi simple</h2>
            </div>
          </div>
        </main>
      </div>
      <div className={`w-full min-h-screen bg-black`}>
        {/* Contenu qui apparaît après l'animation */}
      </div>
    </div>
  );
}
