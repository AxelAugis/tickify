const ProjectLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className={`w-screen text-dark lg:w-full flex flex-col justify-center gap-y-4 bg-light  border-t border-accent-dark-green/20 mx-auto`}>
            {children}
        </div>
    )
}

export default ProjectLayout;