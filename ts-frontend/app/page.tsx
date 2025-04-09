'use client';

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";
import Card from "./components/homepage/card/Card";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroScrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const heroParagraphRef = useRef<HTMLParagraphElement>(null);
  const heroCardsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to('.main-title', { y: -20, duration: 0.5, opacity: 1, ease: "power2.out" });
    const heroCards = gsap.utils.toArray('.heroCard');
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top+=100",
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
    
    gsap.set(heroCardsRef.current, { 
      y: 20 
    });
    
    gsap.set(heroCards, { 
      y: 20 
    });
    
    tl.to(heroScrollRef.current, { 
      width: '80%', 
      height: '80vh', 
      duration: 1, 
      ease: "power2.out" 
    });

    tl.fromTo(heroRef.current, 
      { y: -20, opacity: 1 }, 
      { opacity: 0, y: -300, duration: 0.5, ease: "power2.out" }, 
      0
    );
    
    tl.to('.hero-h2', { 
      opacity: 1, 
      y: 0,
      fontSize: "2rem",
      duration: 0.5, 
      ease: "power2.out" 
    }, 0.2);

    tl.to(navbarRef.current, {
      opacity: 0,
      y: -300,
      duration: 0.5,
      ease: "power2.out",
    }, 0);

    tl.to(heroParagraphRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    }, 0.7);

    tl.to(heroCards, {
      y: 0,
      opacity: 1,
      duration: 0.2,
      stagger: 0.1,
      ease: "power2.out",
    }, "-=0.7");
  }, [heroRef, containerRef]);

  return (
    <div className={`min-h-screen bg-light flex flex-col`}>
      <nav ref={navbarRef} className="w-full max-w-screen-2xl flex items-center justify-between py-5 left-1/2 -translate-x-1/2 fixed top-0 z-20">
          <Link
            href="/"
            className="text-2xl font-bold text-accent-dark font-ubuntu"
          >
            <Image
              src={"/images/logo.svg"}
              alt="Logo"
              width={100}
              height={50}
              className="cursor-pointer w-16 h-auto"
            />
          </Link>
          <div className={`flex items-center gap-x-8`}>
            <Link 
              href="/"
              className="text-xl font-bold text-accent-dark font-cabin py-2 px-4 hover:bg-accent-dark hover:text-accent-green rounded-lg transition duration-300 ease-in-out"
            >
              Se connecter
            </Link>
            <Link 
              href="/"
              className="text-xl font-bold text-accent-dark font-cabin py-2 px-4 hover:bg-accent-dark hover:text-accent-green rounded-lg transition duration-300 ease-in-out"
            >
              Inscription
            </Link>
          </div>
      </nav>
      <div ref={containerRef} className="h-screen w-full relative">
        <main className="flex flex-col  w-full h-full">
          <div ref={heroRef} className={`w-full grid grid-cols-2 h-4/5 items-center max-w-screen-2xl mx-auto`}>
            <div className={`w-full flex flex-col gap-y-6`}>
             <div className={`w-full`}>
              <h1 className="text-9xl font-bold  text-accent-dark main-title opacity-0 font-ubuntu  flex flex-col ">
                  Tickame
                </h1>
                <p className="text-2xl font-medium  text-accent-dark  font-cabin  ">
                  La solution de gestion de projet pour tous. 
                </p>
                <p className="text-2xl font-medium  text-accent-dark  font-cabin  ">
                  Une nouvelle façon de gérer vos projets en équipe.
                </p>
             </div>
              <div className={`flex items-center gap-x-8 font-cabin`}>
                <button className={`bg-accent-green/50 text-accent-dark font-bold py-3 px-8 rounded-lg  hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer`}>
                  Commencer
                </button>
                <Link
                  href="/"
                  className={`bg-accent-dark text-light font-bold py-3 px-7 rounded-lg  hover:-translate-y-1 hover:shadow-2xl transition duration-300 ease-in-out cursor-pointer`}
                >
                  S&apos;inscrire
                </Link>
              </div>
            </div>
            <div className={`w-full grid grid-cols-6 gap-2 text-2xl font-medium `}>
              <div className={`col-span-2 py-10 rounded-xl bg-accent-dark text-accent-green  flex items-center justify-center`}>
                Créer
              </div>
              <div className={`col-span-2 py-10 rounded-xl bg-accent-green/50 text-accent-dark flex items-center justify-center`}>
                Gérer
              </div>
              <div className={`col-span-2 py-10 rounded-xl bg-dark text-light flex items-center justify-center`}>
                Innover
              </div>
              <div className={`col-span-4 py-10 rounded-xl bg-accent-full text-light flex items-center justify-center`}>
                Collaborer
              </div>
              <div className={`col-span-2 py-10 rounded-xl bg-accent-dark/50 text-light flex items-center justify-center`}>
                Partager
              </div>
            </div>
          </div>
          <div ref={heroScrollRef} className={` origin-center bg-accent-dark h-0 w-0   fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-xl overflow-hidden`}>
            <div className="w-full h-full  flex flex-col gap-y-12  p-24">
              <div className={`w-full flex flex-col gap-y-6`}>
                <h2 className="text-xl font-bold text-center text-accent-green opacity-0 hero-h2 translate-y-44 font-ubuntu">Gérer vos projets n&apos;a jamais été aussi simple</h2>
                <p ref={heroParagraphRef} className="text-2xl  text-center text-light  font-cabin  flex flex-col opacity-0 translate-y-4">Chez Tickame, nous croyons que la gestion de projet devrait être accessible à tous. 
                  <span>C&apos;est pourquoi nous avons créé une plateforme intuitive qui vous permet de gérer vos projets tranquillement.</span>
                </p>
              </div>
              <div ref={heroCardsRef} className={`w-full flex-1 flex items-center justify-center gap-x-8 font-cabin px-24 translate-y-20`}>
                <Card title="Simple" />
                <Card title="Rapide" height="h-4/5" />
                <Card title="Gratuit" />
              </div>
            </div>
          </div>
        </main>
      </div>
      <div className={`w-full min-h-screen bg-accent-full`}>
        {/* Contenu qui apparaît après l'animation */}
      </div>
    </div>
  );
}
