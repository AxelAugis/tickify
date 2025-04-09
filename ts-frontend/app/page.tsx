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
  const howSectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const heroBoxes = gsap.utils.toArray('.hero-box');
    const heroCards = gsap.utils.toArray('.heroCard');
    const ctaHeros = gsap.utils.toArray('.ctaHero');

    gsap.to('.main-title', { y: 0, duration: 0.5, opacity: 1, ease: "power2.out" });
    gsap.to('.intro-text ', { y: 0, duration: 0.5, opacity: 1, ease: "power2.out" });
    gsap.to(ctaHeros, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    });

    gsap.fromTo(heroBoxes, {
      y: 20,
      opacity: 0,
    }, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out",
    });

    
    const heroTl = gsap.timeline({
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
    
    heroTl.to(heroScrollRef.current, { 
      width: '80%', 
      height: '80vh', 
      duration: 1, 
      ease: "power2.out" 
    });

    heroTl.fromTo(heroRef.current, 
      { y: -20, opacity: 1 }, 
      { opacity: 0, y: -300, duration: 0.5, ease: "power2.out" }, 
      0
    );
    
    heroTl.to('.hero-h2', { 
      opacity: 1, 
      y: 0,
      fontSize: "2rem",
      duration: 0.5, 
      ease: "power2.out" 
    }, 0.2);

    heroTl.to(navbarRef.current, {
      opacity: 0,
      y: -300,
      duration: 0.5,
      ease: "power2.out",
    }, 0);

    heroTl.to(heroParagraphRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    }, "-=0.7");

    heroTl.to(heroCards, {
      y: 0,
      opacity: 1,
      duration: 0.1,
      stagger: 0.03,
      ease: "power2.out",
    }, "-=0.5");

    const howTl = gsap.timeline({
      scrollTrigger: {
        trigger: howSectionRef.current,
        start: "top 90%",
        end: "bottom bottom",
        scrub: 0.5,
        immediateRender: false,
      }
    });

    howTl.to(howSectionRef.current, {
      width: '80%',
      height: '60vh',
      borderRadius: "16px",
      ease: "power2.out",
    });

    const marqueeContainers = gsap.utils.toArray('.marquee-container');
    
    marqueeContainers.forEach((container, index) => {
      const direction = index === 0 ? -1 : 1;
      
      howTl.to((container as HTMLElement).querySelectorAll('.marquee'), {
        x: direction * 500,
        ease: "power2.out",
      }, 0);
    });

    const barItems = gsap.utils.toArray('.bar-item');
    
    barItems.forEach((item) => {
      gsap.set((item as HTMLElement), {
        height: (item as HTMLElement).clientHeight, 
      });
    });
    
    gsap.delayedCall(0.1, () => {
      barItems.forEach((item, index) => {
        const randomHeight = gsap.utils.random(40, 90); 
        
        gsap.to((item as HTMLElement), {
          height: `${randomHeight}%`,
          duration: gsap.utils.random(1.2, 2),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.2,
        });
      });
    });

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
              <h1 className="text-9xl font-bold  text-accent-dark main-title translate-y-5 opacity-0 font-ubuntu  flex flex-col ">
                  Tickame
                </h1>
                <p className="text-2xl font-medium  text-accent-dark opacity-0 translate-y-5 font-cabin flex flex-col intro-text ">
                  La solution de gestion de projet pour tous. 
                  <span> Une nouvelle façon de gérer vos projets en équipe.</span>
                </p>

             </div>
              <div className={`flex items-center gap-x-8 font-cabin`}>
                <button className={`ctaHero opacity-0 translate-y-5 bg-accent-green/50 text-accent-dark font-bold py-3 px-8 rounded-lg  hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer`}>
                  Commencer
                </button>
                <Link
                  href="/"
                  className={`ctaHero opacity-0 translate-y-5 bg-accent-dark text-light font-bold py-3 px-7 rounded-lg  hover:-translate-y-1 hover:shadow-2xl transition duration-300 ease-in-out cursor-pointer`}
                >
                  S&apos;inscrire
                </Link>
              </div>
            </div>
            <div className={`w-full grid grid-cols-6 gap-2 text-2xl font-medium `}>
              <div className={`col-span-2 py-10 rounded-xl bg-accent-dark text-accent-green  flex items-center justify-center hero-box`}>
                Créer
              </div>
              <div className={`col-span-2 py-10 rounded-xl bg-accent-green/50 text-accent-dark flex items-center justify-center hero-box`}>
                Gérer
              </div>
              <div className={`col-span-2 py-10 rounded-xl bg-dark text-light flex items-center justify-center hero-box`}>
                Innover
              </div>
              <div className={`col-span-4 py-10 rounded-xl bg-accent-blue text-light flex items-center justify-center hero-box`}>
                Collaborer
              </div>
              <div className={`col-span-2 py-10 rounded-xl bg-accent-dark/50 text-light flex items-center justify-center hero-box`}>
                Partager
              </div>
            </div>
          </div>
          <div ref={heroScrollRef} className={` origin-center bg-accent-dark h-0 w-0   fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-xl overflow-hidden`}>
            <div className="w-full h-full  flex flex-col gap-y-12  p-24">
              <div className={`w-full flex flex-col gap-y-6`}>
                <h2 className="text-xl font-bold text-center text-accent-green opacity-0 hero-h2 translate-y-44 font-ubuntu">Gérer vos projets n&apos;a jamais été aussi simple</h2>
                <p ref={heroParagraphRef} className="text-2xl  text-center text-light  font-cabin  flex flex-col opacity-0 translate-y-44">Chez Tickame, nous croyons que la gestion de projet devrait être accessible à tous. 
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
      <div className={`relative w-screen min-h-[80vh] flex justify-center items-center bg-light font-cabin`}>
        <div className={`w-screen absolute top-1/3 -translate-y-1/3 py-12 bg-accent-dark-green font-cabin italic text-accent-green text-8xl overflow-hidden whitespace-nowrap`}>
          <div className={`min-w-full h-full flex justify-center items-center gap-x-8 px-8 marquee-container`}>
            {
              Array.from({ length: 10 }, (_, index) => (
                <div key={index} className={` marquee`}>
                  <p>Tickame</p>
                </div>
              ))
            }
          </div>
        </div>
        <div className={`w-screen absolute top-2/3 -translate-y-2/3 py-12 bg-accent-dark-green font-cabin italic text-accent-green text-8xl  overflow-hidden whitespace-nowrap`}>
          <div className={`w-full h-full flex justify-center items-center gap-x-8 px-8 marquee-container`}>
            {
              Array.from({ length: 10 }, (_, index) => (
                <div key={index} className={`marquee`}>
                  <p>Tickame</p>
                </div>
              ))
            }
          </div>
        </div>
        <div ref={howSectionRef} className={` w-full z-10 bg-accent-green h-screen mx-auto py-20 px-24 flex  gap-y-24`}>
          <div className={`w-4/5 flex flex-col gap-y-24`}>
            <div className={`w-full flex flex-col gap-y-8 text-accent-dark-green `}>
              <h2 className={`text-5xl font-bold   w-fit font-ubuntu`}>Comment ça fonctionne ?</h2>
              <p className={`text-2xl `}>Démarrer un projet rapidement et facilement avec Tickame. </p>
            </div>
            <div className={`w-4/5 grid grid-cols-2 text-accent-dark-green font-cabin`}>
              <div className={`w-full flex items-end gap-x-6`}>
                <p className={`font-bold text-2xl`}>1.</p>
                <p className={`text-xl`}>Commencez par créer un projet sur Tickame.</p>
              </div>
              <div className="w-full flex items-end gap-x-6">
                <p className={`font-bold text-2xl`}>2.</p>
                <p className={`text-xl`}>Créer des epics et ajouter des tickets.</p>
              </div>
            </div>
            <div className={`w-4/5 grid grid-cols-2 text-accent-dark-green font-cabin`}>
              <div className={`w-full flex items-end gap-x-6`}>
                <p className={`font-bold text-2xl`}>3.</p>
                <p className={`text-xl`}>Inviter vos collaborateurs à rejoindre le projet.</p>
              </div>
              <div className="w-full flex items-end gap-x-6">
                <p className={`font-bold text-2xl`}>4.</p>
                <p className={`text-xl`}>Partager, collaborer et innover ensemble.</p>
              </div>
            </div>
          </div>
          <div className={`w-1/5 mx-auto h-full flex justify-center gap-x-1`}>
            <div className={`w-1/6 flex flex-col  gap-y-0.5`}>
              <div className={`w-full h-2/6 bg-accent-dark-green rounded-full bar-item`}></div>
              <div className={`w-full h-4/6 bg-accent-blue rounded-full bar-item`}></div>
            </div>
            <div className={`w-1/6 flex flex-col  gap-y-0.5`}>
              <div className={`w-full h-1/6 bg-accent-dark-green rounded-full bar-item`}></div>
              <div className={`w-full h-3/6 bg-light rounded-full bar-item`}></div>
              <div className={`w-full h-1/6 bg-accent-dark-green rounded-full bar-item`}></div>
            </div>
          </div>
        </div>
        {/* Contenu qui apparaît après l'animation */}
      </div>
    </div>
  );
}
