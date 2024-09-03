'use client';
import Navbar from "@/components/Navbar/Navbar"
import { useEffect, useState } from 'react';
import { apiUrl } from '@/utils/api';
import { getUser } from "../../utils/auth/auth";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import AddModal from "@/components/Layout/AddModal/AddModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

async function getData(id) {
    const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${apiUrl}/api/project/user/${id}/all`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
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
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [projects, setProjects] = useState([]);
    const [navItems, setNavItems] = useState(null);
    const [isHome, setIsHome] = useState(false);
    const [context, setContext] = useState(null);
    const [isModalCalled, setIsModalCalled] = useState(false);
    const [modalStyle, setModalStyle] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            const fetchUser = async () => {
                try {
                    const user = await fetch (`${apiUrl}/api/user/me`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (!user.ok) {
                        throw new Error('An error occurred while fetching the data');
                    } else {
                        const userData = await user.json();
                        setUser(userData.user);
                    }
                } catch (error) {
                    console.error('Erreur:', error);
                }
            }
            fetchUser();
        }
    }, []);

    useEffect(() => {
        if(user) {
            getData(user.id).then(data => setProjects(data));
        }
    }, [user]);

    useEffect(() => {
        if(user) {
            const currentNavItems = {
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
                            url: `/dashboard/project/${project.id}`
                        }))
                    },
                    {
                        type: 'create',
                        label: 'Créer un projet',
                        onclick: () => handleModal('project')
                    },
                    {
                        type: 'create',
                        label: 'Créer un ticket',
                        onclick: () => handleModal('ticket')
                    },
                    {
                        type: 'create',
                        label: 'Créer un contexte',
                        onclick: () => handleModal('context')
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
            setNavItems(currentNavItems);
        }
    }, [projects]);

    useEffect(() => {
        setIsHome(pathname === '/');
    }
    , [pathname]);

    const handleModal = (context) => {
        setContext(context);
        if (!isModalCalled) {
            setIsModalCalled(true);
            setTimeout(() => {
                setModalStyle(true);
            }, 10);
        } else {
            setModalStyle(false);
            setTimeout(() => {
                setIsModalCalled(false);
            }, 500); 
        }        
    }

    const refreshProjects = async() => {
        const data = await getData(user.id);
        setProjects(data);
    }

    return (
      <>
        <div className={`w-screen h-screen fixed top-0 left-0 bg-linear-gradient `}></div>
        {
            <section className="w-screen h-screen backdrop-blur-lg relative ">
                <div className="flex flex-col h-full w-full">
                    {navItems && 
                            <Navbar items={navItems} context={context}/>
                    } 
                    <main className={`h-[92%] w-full`}>
                        <ToastContainer />
                        {children}
                    </main>
                </div>
                {
                    isModalCalled && (
                        <AddModal 
                            user={user}
                            modalStyle={modalStyle} 
                            handleModal={handleModal} 
                            context={context} 
                            refreshProjects={refreshProjects} 
                            projects={projects} 
                        />
                    )
                }
            </section>
        }
      </>
    )
}

export default Layout;