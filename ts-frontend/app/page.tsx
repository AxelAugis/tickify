'use client';

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Enregistrer le plugin ScrollTrigger avec GSAP
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroScrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to('.main-title', { y: -20, duration: 0.5, opacity: 1, ease: "power2.out" });
    
    // Animation du déploiement avec ScrollTrigger et pin
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        immediateRender: false, // Empêche le rendu immédiat de l'animation
      }
    });
    
    // S'assurer que la div commence avec une taille de 0 et des bords arrondis
    gsap.set(heroScrollRef.current, { 
      width: 0, 
      height: 0,
      borderRadius: "16px"
    });
    
    // Animer la taille et le border-radius en même temps
    tl.to(heroScrollRef.current, { 
      width: '100%', 
      height: '100vh', 
      borderRadius: "0px",
      duration: 1, 
      ease: "power2.out" 
    });
    
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
          <div ref={heroScrollRef} className={`bg-white origin-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-xl`}></div>
        </main>
      </div>
      <div className={`w-full min-h-screen bg-black`}>
        {/* Contenu qui apparaît après l'animation */}
      </div>
    </div>
  );
}
