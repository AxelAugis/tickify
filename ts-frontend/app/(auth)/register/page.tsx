'use client';
import Button from "@/app/components/buttons/Button";
import Input from "@/app/components/form/Input";
import { useState } from "react";
import pwdStrengthStyle from "@/app/components/form/PwdStrengthChecker/PwdStengthChecker.module.css";
import { testStrength } from "@/utils/regex";
import PwdStrengthChecker from "@/app/components/form/PwdStrengthChecker/PwdStrengthChecker";

export default function RegisterPage() {
    const [visibility, setVisibility] = useState({
        password: false,
        confirmPassword: false,
    });
    const [strength, setStrength] = useState(0);

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [requestError, setRequestError] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
        ...prevState,
        [name]: value,
        }));
        if(name === "password") {
            const strength = testStrength(value);
            setStrength(strength);
            console.log(strength);
            
        }

        setError((prevState) => ({
        ...prevState,
        [name]: "",
        }));

        setRequestError("");
    }

    const pageContent = {
    form: {
        inputs: {
            name: [
                {
                    label: {
                        htmlFor: "firstname",
                        text: "Prénom",
                        name: "firstname",
                    },
                    input: {
                        id: "firstname",
                        name: "firstname",
                        type: "text",
                        placeholder: "Prénom",
                        value: formData.firstname,
                        onChange: handleInputChange,
                    },
                    error: error.firstname,
                },
                {
                    label: {
                        htmlFor: "lastname",
                        text: "Nom",
                        name: "lastname",
                    },
                    input: {
                        id: "lastname",
                        name: "lastname",
                        type: "text",
                        placeholder: "Nom",
                        value: formData.lastname,
                        onChange: handleInputChange,
                    },
                    error: error.lastname,
                }
            ],
            email: {
                label: {
                    htmlFor: "email",
                    text: "Email",
                    name: "email",
                },
                input: {
                    id: "email",
                    name: "email",
                    type: "email",
                    placeholder: "email@tickame.com",
                    value: formData.email,
                    onChange: handleInputChange,
                },
                error: error.email,
            },
            passwords: [
                {
                    label: {
                        htmlFor: "password",
                        text: "Mot de passe",
                        name: "password",
                    },
                    input: {
                        id: "password",
                        name: "password",
                        type: "password",
                        placeholder: "********",
                        isVisible: visibility.password,
                        button: {
                            onClick: () => {
                                setVisibility((prevState) => ({
                                    ...prevState,
                                    password: !prevState.password,
                                }));
                            }
                        },
                        value: formData.password,
                        onChange: handleInputChange,
                    },
                    error: error.password,
                },
                {
                    label: {
                        htmlFor: "confirmPassword",
                        text: "Confirmer le mot de passe",
                        name: "confirmPassword",
                    },
                    input: {
                        id: "confirmPassword",
                        name: "confirmPassword",
                        type: "password",
                        placeholder: "********",
                        isVisible: visibility.confirmPassword,
                        button: {
                            onClick: () => {
                                setVisibility((prevState) => ({
                                    ...prevState,
                                    confirmPassword: !prevState.confirmPassword,
                                }));
                            }
                        },
                        value: formData.confirmPassword,
                        onChange: handleInputChange,
                    },
                    error: error.confirmPassword,
                }
            ]
        },
        pwdStrenghtChecker: {
            value: strength,
            styles: pwdStrengthStyle
        },
        button: {
            type: "submit" as "submit" | "reset" | "button" | undefined,
            label: "Se connecter",
            width: "w-full",
            dots: {
              color: "bg-light",
              size: "h-2.5 w-2.5",
            }
        },
        error: requestError,
    }
    }

    return (
    <div className="flex flex-col gap-y-12 xl:grid xl:grid-cols-2 items-center justify-center w-full h-full 2xl:max-w-5/6   gap-x-8 lg:px-24">
        <div className={`flex flex-col items-center gap-y-4`}>
            <h1 className={`text-5xl sm:text-7xl  text-white font-medium`}>Tickame</h1>
            <p className={`text-xl sm:text-2xl 3xl:text-3xl text-white font-medium font-cabin`}>
            Réjoignez la communauté Tickame !
            </p>
        </div>
        <form 
            className={` bg-light/20 rounded-xl shadow-lg ring-1 ring-black/5 backdrop-blur-3xl flex flex-col items-center text-light gap-y-10 p-4 md:p-8 font-cabin w-11/12 sm:w-3/4 lg:max-w-xl`}
        >
            <h2 className={`text-3xl md:text-4xl  font-medium`}>Inscription</h2>
            <div className={`w-full flex flex-col gap-y-6`}>
                <div className={`w-full grid grid-cols-2 gap-x-4`}>
                    {
                        pageContent.form.inputs.name.map((input, index) => (
                            <Input key={index} item={input} />
                        ))
                    }   
                </div>
                <Input item={pageContent.form.inputs.email} />
               <div className={`w-full flex flex-col gap-y-4`}>
                    <Input item={pageContent.form.inputs.passwords[0]} />
                    <PwdStrengthChecker item={pageContent.form.pwdStrenghtChecker} />
               </div>
            </div>
            <Button item={pageContent.form.button} />
            {
                pageContent.form.error && (
                    <p className={`text-light font-medium`}>{pageContent.form.error}</p>
                )
            }
        </form>
    </div>
    )
}


