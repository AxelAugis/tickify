'use client';

import Button from '@/app/components/buttons/Button';
import Input from '@/app/components/form/Input';
import ProgressBar from '@/app/components/progressBar/ProgressBar';
import useUserStore from '@/store/useUserStore';
import { checkProjectNameDuplicate } from '@/utils/database/checker';
import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import { TeamProps } from '@/types/team';
import axios from '@/utils/axios';
import { useRouter } from 'next/navigation';


export default function CreateProjectPage() {
    const router = useRouter();

    const { user } = useUserStore();

    const [step, setStep] = useState(1);
    const [teams, setTeams] = useState<TeamProps[]>([]);
    const [currentTeam, setCurrentTeam] = useState({
        name: '',
        color: '#000000'
    });

    const [showColorPicker, setShowColorPicker] = useState(false);

    const [formData, setFormData] = useState({
        projectName: '',
        projectDescription: '',
        projectType: '',
        teams: [] as TeamProps[],
        branchName: '',
        branchDescription: ''
    })

    const [formErrors, setFormErrors] = useState({
        projectName: '',
        projectDescription: '',
        projectType: '',
        teamName: '',
        teamColor: '',
        branchName: '',
        branchDescription: ''
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
        if (inputName === 'projectName' && typeof value === 'string' && value.trim() === '') {
            setFormErrors(prevErrors => ({
                ...prevErrors,
                projectName: 'Le nom du projet est requis.'
            }));
            return false;
        }
        if (inputName === 'projectDescription' && typeof value === 'string' && value.trim() === '') {
            setFormErrors(prevErrors => ({
                ...prevErrors,
                projectDescription: 'La description du projet est requise.'
            }));
            return false;
        }
        if (inputName === 'projectType' && typeof value === 'string' && value.trim() === '') {
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
                    projectType: '',
                    teamName: '',
                    teamColor: '',
                    branchName: '',
                    branchDescription: ''
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
                            projectType: '',
                            teamName: '',
                            teamColor: '',
                            branchName: '',
                            branchDescription: ''
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

    const handleTeamChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrentTeam(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleColorChange = (color: { hex: string }) => {
        setCurrentTeam(prev => ({
            ...prev,
            color: color.hex
        }));
    };

    const addTeam = () => {
        if(currentTeam.name.trim() === '') return;
        setTeams(prevTeams => [
            ...prevTeams,
            {
                id: teams.length == 0 ? 1 : teams[teams.length - 1].id + 1,
                name: currentTeam.name,
                color: currentTeam.color
            }
        ]);
        setCurrentTeam({
            name: '',
            color: '#000000'
        });
    }

    const removeTeam = (teamId: number) => {
        setTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const body = {
            name: formData.projectName,
            description: formData.projectDescription,
            teams: teams,
            branch: {
                name: formData.branchName,
                description: formData.branchDescription
            }
        }
        console.log(body);
        try {
            const response = await axios.post("/project/create", body)
            if(response.status === 201) {
                const uuid = response.data.uuid;
                router.push(`/dashboard/project/${uuid}`);
            } else {
                console.error("Erreur lors de la création du projet :", response.data);
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la création du projet :", error);
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
                    title: "Ajoutez des équipes",
                    description: "Choisissez les équipes qui travailleront sur ce projet.",
                    fields: [
                        {
                            label: {
                                text: "Nom de l'équipe",
                                htmlFor: "name"
                            },
                            input: {
                                type: "text",
                                id: "name",
                                name: "name",
                                placeholder: "Entrez le nom de l'équipe",
                                value: currentTeam.name,
                                onChange: handleTeamChange
                            },
                            error: '',
                            textColor: "text-dark",
                            borderColor: "border-dark/20"
                        },
                        {
                            label: {
                                text: "Couleur de l'équipe",
                                htmlFor: "color"
                            },
                            input: {
                                type: "text",
                                id: "color",
                                name: "color",
                                placeholder: "Entrez la couleur de l'équipe",
                                value: currentTeam.color,
                                onChange: handleTeamChange
                            },
                            error: '',
                            textColor: "text-dark",
                            borderColor: "border-dark/20",
                            colorPicker: true
                        }
                    ],
                    addColorButton: {
                        type: "button" as "button" | "submit",
                        onClick: addTeam,
                        label: "Ajouter",
                        width: "w-full"
                    }
                },
                {
                    title: "Ajouter une branche principale",
                    description: "Initialisez votre projet avec votre première branche.",
                    fields: [
                        {
                            label: {
                                text: "Nom de la branche",
                                htmlFor: "branchName"
                            },
                            input: {
                                type: "text",
                                id: "branchName",
                                name: "branchName",
                                placeholder: "Ex: Inviter les membres..., Définir les rôles...",
                                value: formData.branchName,
                                onChange: handleInputChange
                            },
                            error: '',
                            textColor: "text-dark",
                            borderColor: "border-dark/20"
                        },
                        {
                            label: {
                                text: "Description de la branche",
                                htmlFor: "branchDescription"
                            },
                            input: {
                                type: "textarea",
                                id: "branchDescription",
                                name: "branchDescription",
                                placeholder: "Entrez une description pour votre branche",
                                value: formData.branchDescription,
                                onChange: handleInputChange
                            },
                            error: '',
                            textColor: "text-dark",
                            borderColor: "border-dark/20"
                        }
                    ]
                }
            ],
            navigation: [
                {
                    label: "Retour",
                    type: "button" as "button" | "submit",
                    onClick: () => handleStep('prev'),
                    width: "w-1/5"
                },
                {
                    label: step < 3 ? "Suivant" : "Valider",
                    type: step < 3 ? "button" : "submit" as "button" | "submit",
                    onClick: step < 3 ? () => handleStep('next') : undefined,
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
            <form
                onSubmit={handleSubmit} 
                className={`w-3/5 mx-auto flex flex-col flex-1 justify-between gap-y-4 shadow-default p-6  rounded-lg bg-light`}
            >
                <div className={`flex flex-col gap-y-4`}>
                    <div className={`w-full flex flex-col gap-y-2`}>
                        <h2 className="text-2xl font-semibold mb-4">{pageContent.form.steps[step -1].title}</h2>
                        <p className="text-gray-600 mb-6 text-center">{pageContent.form.steps[step -1].description}</p>
                    </div>
                    
                    {step === 1 && (
                        pageContent.form.steps[step -1].fields?.map((field, index) => (
                            <Input key={index} item={field} />
                        ))
                    )}
                    
                    {step === 2 && (
                        <div className="flex flex-col gap-y-6">
                            <div className="grid grid-cols-8 gap-4 items-end">
                                <div className={`grid grid-cols-5 items-end gap-x-3 col-span-4`}>
                                    <div className="flex flex-col gap-y-2 col-span-4">
                                       <Input item={pageContent.form.steps[step -1].fields[0]} />
                                    </div>
                                    <div className="flex flex-col gap-y-2 ">
                                        <div className="relative w-full">
                                            <button
                                                type="button"
                                                onClick={() => setShowColorPicker(!showColorPicker)}
                                                className="w-10 h-10 rounded-lg  focus:outline-none focus:ring-2 focus:ring-accent-dark-green"
                                                style={{ backgroundColor: currentTeam.color }}
                                            />
                                            {showColorPicker && (
                                                <div className="absolute top-12 left-0 z-10">
                                                    <div 
                                                        className="fixed inset-0" 
                                                        onClick={() => setShowColorPicker(false)}
                                                    />
                                                    <SketchPicker
                                                        color={currentTeam.color}
                                                        onChange={handleColorChange}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-between gap-y-2 col-span-2 h-full">
                                    <label className="text-sm font-medium text-dark">
                                        Aperçu
                                    </label>
                                    <div 
                                        className="flex items-center justify-center px-3 py-2 rounded-lg text-white text-sm font-medium w-full h-12"
                                        style={{ backgroundColor: currentTeam.color }}
                                    >
                                        {currentTeam.name}
                                    </div>
                                </div>
                                {/* Bouton d'ajout */}
                                <div className="flex items-end justify-end col-span-2">
                                    <Button item={pageContent.form.steps[step -1].addColorButton} />
                                </div>
                            </div>
                            
                            {teams.length > 0 && (
                                <div className="flex flex-col gap-y-4">
                                    <h3 className="text-lg font-semibold">Équipes ajoutées :</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {teams.map((team) => (
                                            <div
                                                key={team.id}
                                                className="flex items-center gap-2 pl-4 pr-2 py-2 rounded-full text-white"
                                                style={{ backgroundColor: team.color }}
                                            >
                                                <span className="font-medium">{team.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeTeam(team.id)}
                                                    className="text-white font-bold text-lg leading-none cursor-pointer bg-white/20 hover:bg-white/30 rounded-full w-6 h-6 flex items-center justify-center transition-colors duration-150"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        pageContent.form.steps[step -1].fields?.map((field, index) => (
                            <Input key={index} item={field} />
                        ))
                    )}
                </div>
                
                <div className={`flex items-center  ${step <= 1 ? 'justify-end' : 'justify-between'}`}>
                   {
                    step > 1 ? (
                        pageContent.form.navigation.map((navItem, index) => (
                            <Button
                                item={navItem}
                                key={index}
                            />
                        ))
                    ) : (
                        <Button
                            item={pageContent.form.navigation[1]}
                        />

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