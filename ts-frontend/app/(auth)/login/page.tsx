'use client';

import React from "react";
import Input from "@/app/components/form/Input";
import { useState } from "react";
import Checkbox from "@/app/components/checkbox/Checkbox";
import Button from "@/app/components/buttons/Button";
import axios from "@/utils/axios";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setError((prevState) => ({
      ...prevState,
      [name]: "",
    }));
    setRequestError("");
  }

  const checkInputsValidity = () => {
    let hasError = false;
    
    if(formData.email.trim() === "") {
      setError((prevState) => ({
        ...prevState,
        email: "Veuillez entrer votre adresse e-mail",
      }));
      hasError = true;
    }

    if(formData.password.trim() === "") {
      setError((prevState) => ({
        ...prevState,
        password: "Veuillez entrer votre mot de passe",
      }));
      hasError = true;
    }

    return hasError;
  }

  const handleRememberMe = () => {
    setIsChecked(!isChecked);
  }
  


  const onSubmit = async () => {
    setError({
      email: "",
      password: "",
    });
    setRequestError("");

    const hasError = checkInputsValidity();
    if(hasError) {
      return;
    }
    
    try {
      const datas = {
        email: formData.email,
        password: formData.password,
      }

      const response = await axios.post("/login_check", datas);
      
      // Avec la configuration split_cookie, les cookies jwt_hp et jwt_s sont automatiquement créés
      // par Symfony/Lexik JWT - pas besoin de gérer manuellement les cookies
      if(response.status === 204) {
        router.push("/dashboard");
      }
    } catch (error: object | unknown) {
      if (isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          setError((prevState) => ({
            ...prevState,
            email: "Adresse e-mail ou mot de passe incorrect",
            password: "Adresse e-mail ou mot de passe incorrect",
          }));
        } else {
          setRequestError("Une erreur est survenue.");
        }
      } else {
        setRequestError("Une erreur est survenue.");
      }
    }
  }



  const pageContent = {
    form: {
      inputs: [
        {
          label: {
            htmlFor: "email",
            text: "Email",
          },
          input: {
            type: "email",
            id: "email",
            name: "email",
            placeholder: "projet@tickame.com",
            value: formData.email,
            onChange: handleInputChange,
          },
          error: error.email,
        },
        {
          label: {
            htmlFor: "password",
            text: "Mot de passe",
          },
          input: {
            type: "password",
            id: "password",
            name: "password",
            placeholder: "********",
            isVisible: isPasswordVisible,
            button: {
              onClick: () => {
                setIsPasswordVisible(!isPasswordVisible);
              },
            },
            value: formData.password,
            onChange: handleInputChange,
          },
          error: error.password,
        },
      ],
      remember: {
        label: {
          htmlFor: "remember",
          text: "Se souvenir de moi",
          name: "remember",
        },
        input: {
          id: "remember",
          name: "remember",
          checked: false,
        },
        isChecked: isChecked,
        onChange: handleRememberMe,
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
    <div className="flex flex-col gap-y-12 xl:grid xl:grid-cols-2 items-center justify-center w-full h-full 2xl:max-w-4/5 3xl:max-w-3/4  gap-x-8 lg:px-24">
      <div className={`flex flex-col items-center gap-y-4`}>
        <h1 className={`text-5xl sm:text-7xl  text-white font-medium`}>Tickame</h1>
        <p className={`text-xl sm:text-2xl 3xl:text-3xl text-white font-medium font-cabin`}>
          Content de vous revoir parmis nous !
        </p>
      </div>
      <form 
        action={onSubmit}
        className={` bg-light/20 rounded-xl shadow-lg ring-1 ring-black/5 backdrop-blur-3xl flex flex-col items-center text-light gap-y-12 p-4 md:p-8 font-cabin w-11/12 sm:w-3/4 lg:max-w-xl`}
      >
        <h2 className={`text-3xl md:text-4xl  font-medium`}>Connexion</h2>
        <div className={`w-full flex flex-col gap-y-6`}>
          <div className={`w-full flex flex-col gap-y-4`}>
            {
              pageContent.form.inputs.map((input, index) => (
                <Input item={input} key={index} />
              ))
            }
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-y-2`}>
              <Checkbox item={pageContent.form.remember} />
              <a href="#" className={` font-medium text-light/50 hover:text-light`}>Mot de passe oublié ?</a>
            </div>
            {
              pageContent.form.error && (
                <p className={`text-light text-lg text-center font-medium`}>
                  {pageContent.form.error}
                </p>
              )
            }
          </div>
        </div>
        <Button item={pageContent.form.button} />
      </form>
    </div>
  );
}