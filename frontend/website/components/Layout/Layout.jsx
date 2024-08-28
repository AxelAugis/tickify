'use client';
import Navbar from "../Navbar/Navbar"
import { useEffect, useState } from 'react';
import { apiUrl } from '@/app/api';
import { usePathname } from "next/navigation";
import Sidebar from "../Sidebar/Sidebar";

async function getData() {
  try {
    const res = await fetch(`${apiUrl}/api/project/all`);
    if(!res.ok) {
      throw new Error("An error occurred while fetching the data");
    }
    const projects = await res.json();

    return projects;
  } catch (error) {
    console.error('Erreur:', error);
  }
}

const Layout = ({ children }) => {
    const pathname = usePathname();

    const [projects, setProjects] = useState([]);
    const [navItems, setNavItems] = useState(null);
    const [isHome, setIsHome] = useState(false);

    useEffect(() => {
        getData().then(data => setProjects(data));
    }, []);

    useEffect(() => {
        const newNavItems = {
            leftItems: [
                {
                    type: 'logo',
                    label: 'Tickify',
                    url: '/'
                },
                {
                    type: 'dropdown',
                    label: 'Projets',
                    dropdownItems: projects.map(project => ({
                        label: project.name,
                        url: `/project/${project.id}`
                    }))
                },
                {
                    label: 'Créer'
                }
            ],
            rightItems : [
                {
                    type: 'search',
                    placeholder: 'Rechercher',
                    icon: {
                        src: '/images/navbar/search.svg',
                        alt: 'search',
                        width: 26,
                        height: 26
                    }
                },
                {
                    type: 'avatar',
                    dropdownItems: [
                        {
                            label: 'Mon profil',
                            url: '/profile'
                        },
                        {
                            label: 'Paramètres',
                            url: '/settings'
                        },
                        {
                            label: 'Déconnexion',
                            url: '/logout'
                        }
                    ],
                    icon: {
                        src: '/images/navbar/avatar.svg',
                        alt: 'avatar',
                        width: 40,
                        height: 40
                    }
                }
            ]
        }
        setNavItems(newNavItems);
    }, [projects]);

    useEffect(() => {
        setIsHome(pathname === '/');
    }
    , [pathname]);

    return (
      <>
        <div className={`w-screen h-screen fixed top-0 left-0 bg-linear-gradient `}></div>
        <section className="w-screen h-screen backdrop-blur-lg ">
            <div className="flex flex-col h-full w-full">
                {navItems && 
                        <Navbar items={navItems} />
                } 
                <main className={`h-full w-full`}>
                    {children}
                </main>
            </div>
        </section>
      </>
    )
}

export default Layout;