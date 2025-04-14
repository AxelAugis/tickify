'use client';

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Card from "./components/homepage/card/Card";
import Navbar from "./components/homepage/navbar/Navbar";
import Header from "./components/homepage/header/Header";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const headerRef = useRef<HTMLDivElement>(null);
  const heroScrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const heroParagraphRef = useRef<HTMLParagraphElement>(null);
  const heroCardsRef = useRef<HTMLDivElement>(null);
  const howSectionRef = useRef<HTMLDivElement>(null);

  const isLargeScreen = typeof window !== "undefined" && window.innerWidth > 1024;

  useGSAP(() => {
    if(isLargeScreen) {
      const heroBoxes = gsap.utils.toArray('.hero-box');
      const heroCards = gsap.utils.toArray('.heroCard');
      const ctaHeros = gsap.utils.toArray('.ctaHero');

      // gsap.fromTo(navbarRef.current, { 
      //   y: -100, 
      //   opacity: 1 
      // },  
      // {
      //   y: 0,
      //   opacity: 1,
      //   duration: 0.5,
      //   delay: 0.5,
      //   ease: "power2.out",
      // });

      gsap.to('.main-title', { y: 0, duration: 0.5, opacity: 1, ease: "power2.out" });
      gsap.to('.intro-text ', { y: 0, duration: 0.5, opacity: 1, ease: "power2.out" });
      gsap.to(ctaHeros, {
        y: 0,
        opacity: 1,
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
          end: "bottom top+=300",
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

      heroTl.fromTo(headerRef.current, 
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
      }, "-=0.5");

      heroTl.to(heroCards, {
        y: 0,
        opacity: 1,
        duration: 0.1,
        stagger: 0.03,
        ease: "power2.out",
      }, "-=0.3");

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
    }
  }, [headerRef, containerRef]);

  const pageContent = {
    navbar: {
      ref: navbarRef,
      authLinks: [
        {
          url: "/",
          label: "Se connecter",
        },
        {
          url: "/",
          label: "Inscription",
        },
      ],
    },
    header: {
      ref: headerRef,
    },
    whySection: {
      cards: [
        {
          title: "Simple",
          content: "Gérez vos projets facilement et rapidement. Pas de complications.",
        },
        {
          title: "Rapide",
          content: "Créez des tickets en quelques clics. Instantanément.",
          height: "h-11/12 2xl:h-4/5",
        },
        {
          title: "Gratuit",
          content: "Profitez de toutes les fonctionnalités sans frais.",
        },
      ]
    },
    howSection: {
      marquees: [
        {
          position: "top-1/3 -translate-y-1/3",
        },
        {
          position: "top-2/3 -translate-y-2/3",
        }
      ],
      explanations: {
        top: [
          {
            number: 1,
            content: "Commencez par créer un projet sur Tickame.",
          },
          {
            number: 2,
            content: "Créer des epics et ajouter des tickets.",
          },
        ],
        bottom: [
          {
            number: 3,
            content: "Inviter vos collaborateurs à rejoindre le projet.",
          },
          {
            number: 4,
            content: "Partager, collaborer et innover ensemble.",
          },
        ],
      },
      bars: {
        left: [
          {
            color: "bg-accent-dark-green",
            height: "h-2/6",
          },
          {
            color: "bg-accent-blue",
            height: "h-4/6",
          },
        ],
        right: [
          {
            color: "bg-accent-dark-green",
            height: "h-1/6",
          },
          {
            color: "bg-light",
            height: "h-3/6",
          },
          {
            color: "bg-accent-dark-green",
            height: "h-1/6",
          },
        ],
      }
    }
  }

  return (
    <div className={`min-h-screen bg-light flex flex-col`}>
      <Navbar item={pageContent.navbar} />
      <main className="flex flex-col  w-full h-full">
        <div ref={containerRef} className="h-screen w-full relative">
            <Header item={pageContent.header} />
            <div ref={heroScrollRef} className={` origin-center bg-accent-dark h-0 w-0   fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-xl overflow-hidden`}>
              <div className="w-full h-full  flex flex-col gap-y-12 lg:p-12  2xl:p-24">
                <div className={`w-full flex flex-col gap-y-6`}>
                  <h2 className="text-xl font-bold text-center text-accent-green opacity-0 hero-h2 translate-y-44 font-ubuntu">Gérer vos projets n&apos;a jamais été aussi simple</h2>
                  <p ref={heroParagraphRef} className="text-xl  text-center text-light  font-cabin  flex flex-col opacity-0 translate-y-44">Chez Tickame, nous croyons que la gestion de projet devrait être accessible à tous. 
                    <span>C&apos;est pourquoi nous avons créé une plateforme intuitive qui vous permet de gérer vos projets tranquillement.</span>
                  </p>
                </div>
                <div ref={heroCardsRef} className={`w-full flex-1 flex items-center justify-center gap-x-8 font-cabin px-24 translate-y-20 h-`}>
                  {
                    pageContent.whySection.cards.map((card, index) => (
                      <Card key={index} title={card.title} height={card.height ?? undefined} content={card.content} />
                    ))
                  }
                </div>
              </div>
            </div>
        </div>
        <div className={`relative w-screen min-h-[80vh] flex justify-center items-center bg-light font-cabin`}>
          {
            pageContent.howSection.marquees.map((marquee, index) => (
              <div key={index} className={`w-screen absolute ${marquee.position} py-8 2xl:py-12 bg-accent-dark-green font-cabin italic text-accent-green text-6xl 2xl:text-8xl overflow-hidden whitespace-nowrap`}>
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
            ))
          }
          <div ref={howSectionRef} className={` w-full z-10 bg-accent-green h-screen mx-auto py-12 2xl:py-20 px-16 2xl:px-24 flex  gap-y-24`}>
            <div className={`w-4/5 flex flex-col gap-y-24`}>
              <div className={`w-full flex flex-col gap-y-8 text-accent-dark-green `}>
                <h2 className={`text-3xl 2xl:text-5xl font-bold   w-fit font-ubuntu`}>Comment ça fonctionne ?</h2>
                <p className={`text-xl 2xl:text-2xl `}>Démarrer un projet rapidement et facilement avec Tickame. </p>
              </div>
              {
                Array.from({ length: 2 }, (_, index) => (
                  <div key={index} className={`w-5/6 2xl:w-4/5 grid grid-cols-2 gap-x-12 2xl:gap-x-0 text-accent-dark-green font-cabin`}>
                    {
                      pageContent.howSection.explanations[index === 0 ? "top" : "bottom"].map((explanation, index) => (
                        <div key={index} className={`w-full flex items-center 2xl:items-end gap-x-6`}>
                          <p className={`font-bold text-2xl`}>{explanation.number}.</p>
                          <p className={`text-xl`}>{explanation.content}</p>
                        </div>
                      ))
                    }
                  </div>
                ))
              }
            </div>
            <div className={`w-1/5 mx-auto h-full flex justify-end 2xl:justify-center gap-x-1`}>
              <div className={`w-1/6 flex flex-col  gap-y-0.5`}>
                {
                  pageContent.howSection.bars.left.map((bar, index) => (
                    <div key={index} className={`w-full ${bar.height} ${bar.color} rounded-full bar-item`}></div>
                  ))
                }
              </div>
              <div className={`w-1/6 flex flex-col  gap-y-0.5`}>
                {
                  pageContent.howSection.bars.right.map((bar, index) => (
                    <div key={index} className={`w-full ${bar.height} ${bar.color} rounded-full bar-item`}></div>
                  ))
                }
              </div>
            </div>
          </div> 
        </div>
      </main>
    </div>
  );
}
