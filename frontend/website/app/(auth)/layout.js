const AuthLayout = ({ children }) => {
    return (
        <>
            <div className={`w-screen h-screen fixed top-0 left-0 bg-linear-gradient `}></div>
            <div>
                {children}
            </div>
        </>
    )
}

export default AuthLayout;