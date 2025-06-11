'use client';

import Button from '@/app/components/buttons/Button';
import Input from '@/app/components/form/Input';
import ProgressBar from '@/app/components/progressBar/ProgressBar';
import useUserStore from '@/store/useUserStore';
import { checkProjectNameDuplicate } from '@/utils/database/checker';
import React, { useState } from 'react';

export default function CreateProjectPage() {

    const { user } = useUserStore();

    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        projectName: '',
        projectDescription: '',
        projectType: ''
    })

    const [formErrors, setFormErrors] = useState({
        projectName: '',
        projectDescription: '',
        projectType: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    const checkInputValidity = (inputName: string) => {
        const value = formData[inputName as keyof typeof formData];
        if (inputName === 'projectName' && value.trim() === '') {
            setFormErrors(prevErrors => ({
                ...prevErrors,
                projectName: 'Le nom du projet est requis.'
            }));
            return false;
        }
        if (inputName === 'projectDescription' && value.trim() === '') {
            setFormErrors(prevErrors => ({
                ...prevErrors,
                projectDescription: 'La description du projet est requise.'
            }));
            return false;
        }
        if (inputName === 'projectType' && value.trim() === '') {
            setFormErrors(prevErrors => ({
                ...prevErrors,
                projectType: 'Le type de projet est requis.'
            }));
            return false;
        }
        setFormErrors(prevErrors => ({
            ...prevErrors,
            [inputName]: ''
        }));
        return true;
    }

    const handleStep = async (direction: string) => {
        if(direction === 'next') {
            if(step == 1) {
                setFormErrors({
                    projectName: '',
                    projectDescription: '',
                    projectType: ''
                });
                if(!checkInputValidity('projectName')) return;
                if(!user) return;
                const response = await checkProjectNameDuplicate(formData.projectName, user.id, null );
                console.log(response);
                if(response.status != 200) {
                    if(response.status == 400) {
                        setFormErrors(prevErrors => ({
                            ...prevErrors,
                            projectName: 'Ce nom de projet est déjà utilisé.'
                        }));
                        return;
                    } else {
                        setFormErrors({
                            projectName: 'Une erreur s\'est produite lors de la vérification du nom du projet.',
                            projectDescription: '',
                            projectType: ''
                        });
                    }
                    return;
                }
                if(!checkInputValidity('projectDescription')) return;
            }       
            setStep(prevStep => prevStep + 1);
        } else {
            setStep(prevStep => prevStep - 1);
        }
    }

    const pageContent = {
        form: {
            steps: [
                {
                    title: "Informations du projet",
                    description: "Entrez les informations de base de votre projet.",
                    fields: [
                        {
                            label: {
                                text: "Nom du projet",
                                htmlFor: "projectName"
                            },
                            input: {
                                type: "text",
                                id: "projectName",
                                name: "projectName",
                                placeholder: "Entrez le nom de votre projet",
                                value: formData.projectName,
                                onChange: handleInputChange
                            },
                            error: formErrors.projectName,
                            textColor: "text-dark",
                            borderColor: "border-dark/20"
                        },
                        {
                            label: {
                                text: "Description du projet",
                                htmlFor: "projectDescription"
                            },
                            input: {
                                type: "textarea",
                                id: "projectDescription",
                                name: "projectDescription",
                                placeholder: "Entrez une description pour votre projet",
                                value: formData.projectDescription,
                                onChange: handleInputChange
                            },
                            error: formErrors.projectDescription,
                            textColor: "text-dark",
                            borderColor: "border-dark/20"
                        }
                    ]
                },
                {
                    title: "Configuration du projet",
                    description: "Configurez les paramètres de votre projet.",
                    fields: [
                        {
                            label: {
                                text: "Type de projet",
                                htmlFor: "projectType"
                            },
                            input: {
                                type: "text",
                                id: "projectType",
                                name: "projectType",
                                placeholder: "Entrez le type de votre projet",
                                value: "",
                                onChange: handleInputChange
                            },
                            error: formErrors.projectType,
                            textColor: "text-dark",
                            borderColor: "border-dark/20"
                        }
                    ]
                },
            ],
            navigation: [
                {
                    label: "Retour",
                    type: "button" as "button" | "submit",
                    onClick: () => handleStep('prev'),
                    width: "w-1/5"
                },
                {
                    label: step < 3 ? "Suivant" : "Terminer",
                    type: (step < 3 ? "button" : "submit") as "button" | "submit",
                    onClick: () => handleStep('next'),
                    width: "w-1/5"
                }
            ]
        },
        progressBar: {
            steps: 3,
            currentStep: step,
            color: "bg-accent-dark-green",
            width: "w-3/4"
        }
    }

    return (
        <div className={`w-screen text-dark bg-light flex flex-col gap-y-8 justify-between px-4 lg:px-24 py-5 fhwn maxhwn border-t border-accent-dark-green/20 mx-auto`}>
            <h1 className="text-4xl font-bold  ">Créer un projet</h1>
            <form className={`w-3/5 mx-auto flex flex-col flex-1 justify-between gap-y-4 shadow-default p-6  rounded-lg bg-light`}>
                <div className={`flex flex-col gap-y-4`}>
                    <div className={`w-full flex flex-col gap-y-2`}>
                        <h2 className="text-2xl font-semibold mb-4">{pageContent.form.steps[0].title}</h2>
                        <p className="text-gray-600 mb-6 text-center">{pageContent.form.steps[0].description}</p>
                    </div>
                    {
                        pageContent.form.steps[step -1].fields.map((field, index) => (
                            <Input key={index} item={field} />
                        ))
                    }
                </div>
                <div className="flex items-center justify-between">
                   {
                    step > 1 ? (
                        pageContent.form.navigation.map((navItem, index) => (
                            <Button
                                item={navItem}
                                key={index}
                            />
                        ))
                    ) : (
                        <>
                            <div></div>
                            <Button
                                item={pageContent.form.navigation[1]}
                            />
                        </>

                    )
                   }
                </div>
            </form>
            {
                <ProgressBar item={pageContent.progressBar} />
            }
        </div>
    );
}