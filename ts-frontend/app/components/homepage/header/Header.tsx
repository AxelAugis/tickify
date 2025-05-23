interface HeaderProps {
    item: {
        ref: React.RefObject<HTMLDivElement | null>;
    };
}

const Header: React.FC<HeaderProps> = ({ item }) => {
    return (
         <div ref={item.ref} className={`w-full lg:grid lg:grid-cols-2 h-screen lg:h-4/5 lg:items-center max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-4 lg:px-0`}>
            <div className={`w-full h-full lg:h-fit flex flex-col gap-y-6`}>
            <div className={`w-full`}>
                <h1 className="text-9xl font-bold  text-accent-dark main-title translate-y-5 opacity-0 font-ubuntu  flex flex-col ">
                    Tickame
                </h1>
                <p className="text-2xl font-medium  text-accent-dark opacity-0 translate-y-5 font-cabin flex flex-col intro-text ">
                La solution de gestion de projet pour tous. 
                <span> Une nouvelle façon de gérer vos projets en équipe.</span>
                </p>

            </div>
            </div>
            <div className={`hidden w-full lg:grid grid-cols-6 gap-2 text-2xl font-medium `}>
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
    )
}

export default Header;