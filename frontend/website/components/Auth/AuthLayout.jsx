import React from "react";

const AuthLayout = ({ children }) => {
    return (
        <div className="w-screen h-screen flex justify-center items-center relative z-100">
            {children}
        </div>
    )
}

export default AuthLayout;