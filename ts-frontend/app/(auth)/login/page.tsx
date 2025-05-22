'use client';

import Input from "@/app/components/form/Input";
import { useState } from "react";

export default function LoginPage() {

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);


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
          },
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
            }
          },
        },
      ]
    }
  }

  return (
    <div className="grid grid-cols-2 items-center justify-center w-full h-full gap-x-8 px-24">
      <div className={`flex flex-col items-center gap-y-4`}>
        <h1 className={`text-7xl text-white font-medium`}>Tickame</h1>
        <p className={`text-2xl text-white font-medium font-cabin`}>
          Content de vous revoir parmis nous !
        </p>
      </div>
      <form className={` bg-light/20 rounded-xl shadow-lg ring-1 ring-black/5 backdrop-blur-3xl flex flex-col items-center text-light gap-y-12 p-8 font-cabin`}>
        <h2 className={`text-4xl  font-medium`}>Connexion</h2>
        <div className={`w-full flex flex-col gap-y-6`}>
          {
            pageContent.form.inputs.map((input, index) => (
              <Input item={input} key={index} />
            ))
          }
          <div className={`flex items-center justify-between`}>
            <div className={`flex items-center gap-x-2`}>
              <input type="checkbox" id="remember" className={`w-4 h-4 text-light/50 border border-light/50 rounded focus:outline-none focus:ring-2 focus:ring-light/50`} />
              <label htmlFor="remember" className={` font-medium`}>Se souvenir de moi</label>
            </div>
            <a href="#" className={` font-medium text-light/50 hover:text-light`}>Mot de passe oublié ?</a>
          </div>
          <button type="submit" className={`mt-2 w-full h-12 bg-accent-dark text-white rounded-lg font-medium hover:bg-accent-dark/80 transition duration-200 cursor-pointer`}>Se connecter</button>
        </div>
      </form>
    </div>
  );
}