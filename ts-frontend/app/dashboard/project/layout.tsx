const ProjectLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className={`w-screen text-dark lg:w-full h-fullwodbnav flex flex-col justify-center gap-y-4 mx-auto`}>
            {children}
        </div>
    )
}

export default ProjectLayout;