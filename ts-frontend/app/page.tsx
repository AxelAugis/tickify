'use client';

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Card from "./components/homepage/card/Card";
import Navbar from "./components/navbar/Navbar";
import Header from "./components/homepage/header/Header";
import FAQBox from "./components/faq/FAQBox";
import FAQStyles from '@/app/components/faq/FAQ.module.css';
import BurgerStyles from '@/app/components/navbar/burger/Burger.module.css';
import DropdownStyles from '@/app/components/navbar/dropdown/Dropdown.module.css';
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const headerRef = useRef<HTMLDivElement>(null);
  const heroScrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const heroParagraphRef = useRef<HTMLParagraphElement>(null);
  const heroCardsRef = useRef<HTMLDivElement>(null);
  const howSectionRef = useRef<HTMLDivElement>(null);
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false);

  useEffect(() => {
    if(typeof window !== "undefined") {
      const handleResize = () => {
        setIsLargeScreen(window.innerWidth >= 1024);
      }
      handleResize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      }
    }
  }, []);

  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

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

      // const barItems = gsap.utils.toArray('.bar-item');
      
      // barItems.forEach((item) => {
      //   gsap.set((item as HTMLElement), {
      //     height: (item as HTMLElement).clientHeight, 
      //   });
      // });
      
      // gsap.delayedCall(0.1, () => {
      //   barItems.forEach((item, index) => {
      //     const randomHeight = gsap.utils.random(40, 90); 
          
      //     gsap.to((item as HTMLElement), {
      //       height: `${randomHeight}%`,
      //       duration: gsap.utils.random(1.2, 2),
      //       repeat: -1,
      //       yoyo: true,
      //       ease: "sine.inOut",
      //       delay: index * 0.2,
      //     });
      //   });
      // });
    }
  }, [headerRef, containerRef, isLargeScreen]);

  const handleBurgerClick = () => {
    // document.body.classList.toggle("max-h-screen");
    // document.body.classList.toggle("overflow-hidden");
    setIsBurgerOpen(!isBurgerOpen);
  }

  const handleFAQDisplay = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    const image: HTMLImageElement = target.querySelector('img') as HTMLImageElement;
    const content: HTMLDivElement = target.nextElementSibling as HTMLDivElement;
    if(image.classList.contains('rotate-45')) {
      content.classList.add(`${FAQStyles.open}`);
      image.classList.remove('rotate-45');
    } else {
      image.classList.add('rotate-45');
      content.classList.remove(`${FAQStyles.open}`);
    }
  }


  const pageContent = {
    navbar: {
      ref: navbarRef,
      isDropdownActive: isBurgerOpen,
      authLinks: [
        {
          url: "/login",
          label: "Se connecter",
        },
        {
          url: "/register",
          label: "Inscription",
        },
      ],
      isLgScreen: isLargeScreen,
      burger: {
        isOpen: isBurgerOpen,
        onclick: handleBurgerClick,
        styles: {
          burger: BurgerStyles.burger,
          active: BurgerStyles.active,
        },
      },
      dropdown: {
        isActive: isBurgerOpen,
        styles: {
          dropdown: DropdownStyles.dropdown,
          active: DropdownStyles.active,
        },
      }
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
          height: "h-fit lg:h-11/12 2xl:h-4/5",
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
    },
    faq: [
      {
        title: "Dois-je être inscrit pour utiliser Tickame ?",
        onClick: handleFAQDisplay,
        styles: FAQStyles,
        contents: [
          "Oui, il est nécessaire d'être inscrit chez Tickame pour pouvoir utiliser l'application.",
          "C'est essentiel pour que vous puissiez suivre vos projets et leur évolution."
        ]
      },
      {
        title: "Tickame est-il gratuit ?",
        onClick: handleFAQDisplay,
        styles: FAQStyles,
        contents: [
          "Oui, Tickame est entièrement gratuit. Vous pouvez l'utiliser sans aucune limitation.",
        ]
      },
      {
        title: "Je peux inviter autant de collaborateurs que je veux ?",
        onClick: handleFAQDisplay,
        styles: FAQStyles,
        contents: [
          "Oui, vous pouvez inviter autant de collaborateurs que vous le souhaitez.",
          "Attention tout de même à ce que ce ne soit pas le bazar..."
        ]
      },
      {
        title: "Comment gérer mes projets ?",
        onClick: handleFAQDisplay,
        styles: FAQStyles,
        contents: [
          "Vous pouvez gérer vos projets en créant des epics et des tickets.",
          "Vous avez la possibilité de découper vos projets en unité de travail pour mieux segmenter vôtre projet (design, développement, tests, etc.).",
        ]
      }
    ]
  }

  return (
    <div className={`min-h-screen bg-light flex flex-col`}>
      <Navbar item={pageContent.navbar} />
      <main className="flex flex-col w-full h-full gap-y-24 lg:gap-y-0">
        <div ref={containerRef} className="min-h-screen lg:h-screen w-full relative items-center xl:items-start ">
            <Header item={pageContent.header} />
            <div ref={heroScrollRef} className={`py-6 px-4 lg:p-0 origin-center bg-accent-dark w-11/12 mx-auto min-h-fit lg:min-h-0 lg:h-0 lg:w-0 lg:fixed lg:top-1/2 lg:left-1/2 transform lg:-translate-x-1/2 lg:-translate-y-1/2 z-10 rounded-xl overflow-hidden`}>
              <div className="w-full min-h-fit lg:min-h-full lg:h-full  flex flex-col gap-y-6 lg:gap-y-12 lg:p-12  2xl:p-24">
                <div className={`w-full flex flex-col gap-y-6`}>
                  <h2 className="text-3xl lg:text-xl font-bold text-center text-accent-green lg:opacity-0 hero-h2 lg:translate-y-44 font-ubuntu">Gérer vos projets n&apos;a jamais été aussi simple</h2>
                  <p ref={heroParagraphRef} className="text-xl  text-center text-light  font-cabin  flex flex-col lg:opacity-0 lg:translate-y-44">Chez Tickame, nous croyons que la gestion de projet devrait être accessible à tous. 
                    <span>C&apos;est pourquoi nous avons créé une plateforme intuitive qui vous permet de gérer vos projets tranquillement.</span>
                  </p>
                </div>
                <div ref={heroCardsRef} className={`w-full lg:flex-1 grid lg:flex lg:items-center lg:justify-center gap-x-8 gap-y-4 font-cabin  lg:px-24 lg:translate-y-20`}>
                  {
                    pageContent.whySection.cards.map((card, index) => (
                      <Card key={index} title={card.title} height={card.height ?? undefined} content={card.content} />
                    ))
                  }
                </div>
              </div>
            </div>
        </div>
        <div className={`relative w-screen lg:min-h-[80vh] flex justify-center items-center bg-light font-cabin`}>
          {
            isLargeScreen && (
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
            )
          }
          <div ref={howSectionRef} className={`w-11/12 rounded-lg lg:rounded-none lg:w-full z-10 bg-accent-green lg:h-screen mx-auto py-6 lg:py-12 2xl:py-20 px-4 lg:px-16 2xl:px-24 flex  gap-y-24`}>
            <div className={`w-full lg:w-4/5 flex flex-col gap-y-8 lg:gap-y-24`}>
              <div className={`w-full flex flex-col gap-y-4 lg:gap-y-8 text-accent-dark-green text-center lg:text-start `}>
                <h2 className={`text-2xl lg:text-3xl 2xl:text-5xl font-bold lg:w-fit font-ubuntu`}>Comment ça fonctionne ?</h2>
                <p className={`text-xl 2xl:text-2xl `}>Démarrer un projet rapidement et facilement avec Tickame. </p>
              </div>
              {
                Array.from({ length: 2 }, (_, index) => (
                  <div key={index} className={`w-full lg:w-5/6 2xl:w-4/5 flex flex-col lg:grid lg:grid-cols-2 gap-y-6 lg:gap-y-0 lg:gap-x-12 2xl:gap-x-0 text-accent-dark-green font-cabin`}>
                    {
                      pageContent.howSection.explanations[index === 0 ? "top" : "bottom"].map((explanation, index) => (
                        <div key={index} className={`w-full flex items-start lg:items-center 2xl:items-end gap-x-3 lg:gap-x-6`}>
                          <p className={`font-bold text-2xl`}>{explanation.number}.</p>
                          <p className={`text-xl`}>{explanation.content}</p>
                        </div>
                      ))
                    }
                  </div>
                ))
              }
            </div>
            <div className={`w-1/5 mx-auto h-full hidden lg:flex justify-end 2xl:justify-center gap-x-1`}>
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
        <div className={`w-11/12  lg:px-0 lg:w-4/5  justify-center mx-auto flex flex-col items-center lg:grid lg:grid-cols-3 gap-y-4 lg:py-60 font-cabin`}>
              <div className={`w-full lg:w-fit flex flex-col gap-y-4`}>
                  <h2 className={`text-3xl 2xl:text-5xl font-bold text-dark w-fit font-ubuntu`}>FAQ</h2>
                  <h5 className={`text-lg 2xl:text-2xl text-dark`}>Les réponses à vos questions (peut-être)</h5>
              </div>
              <div className={`col-span-2 flex flex-col gap-y-6`}>
                  {
                    pageContent.faq.map((item, index) => (
                      <FAQBox key={index} item={item} />
                    ))
                  }
              </div>
        </div>
      </main>
      <footer className={`lg:h-screen w-full px-4 lg:px-0 lg:w-4/5 pt-20 lg:pt-40 pb-10 flex flex-col justify-between items-center mx-auto gap-y-12 lg:gap-y-24 `}>
        <div className={`w-full flex flex-col items-center justify-center gap-y-6 lg:gap-y-8`}>
          <h2 className={`text-4xl lg:text-5xl 2xl:text-7xl font-bold text-dark w-fit font-ubuntu text-center lg:text-start`}>
                  Libérez tout votre {""}
                  <span className={` text-accent-green`}>
                     potentiel
                  </span>
          </h2>
          <p className={`text-2xl 2xl:text-3xl text-dark font-cabin`}>
            Gérez vos projets dès maintenant.
          </p>
          <Link
            href="/register"
            className={`text-xl font-bold text-accent-dark-green bg-accent-green font-cabin py-2 px-4 hover:bg-accent-dark hover:text-accent-green rounded-lg transition duration-300 ease-in-out`}
          >
            Inscription
          </Link>
        </div>
        <div className={`w-full flex flex-col gap-y-6 lg:gap-y-10 pt-6 lg:pt-10 px-4 lg:px-10 pb-4 rounded-xl bg-accent-dark-green text-accent-green font-cabin`}>
            <div className={`w-full flex items-center justify-between border-b border-accent-green/30 pb-2`}>
                <p className={`text-2xl font-medium  font-ubuntu`}>Tickame</p>
            </div>
            <div className={`w-full flex flex-col gap-y-4`}>
              <div className={``}>
                  <p className={`text-lg font-medium`}>Tickame est une application de gestion de projet gratuite et libre d&apos;accès. 
                    Elle vous permet de gérer vos projets facilement et rapidement tout en échangeant avec vos collaborateurs.</p>
              </div>
              <div className={`w-full flex flex-col lg:flex-row lg:items-center justify-between pt-6 lg:pt-2`}>
                  <p className={`hidden lg:block text-lg font-medium`}>© 2023 Tickame. Tous droits réservés.</p>
                  <div className={`flex flex-col lg:flex-row gap-x-4`}>
                      <Link href="/" className={`text-lg font-medium`}>Mentions légales</Link>
                      <Link href="/" className={`text-lg font-medium`}>Politique de confidentialité</Link>
                  </div>
                  <p className={`block lg:hidden text-center pt-6 text-lg font-medium`}>© 2023 Tickame. Tous droits réservés.</p>

              </div>
            </div>
        </div>
      </footer>
    </div>
  );
}
