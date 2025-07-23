import { TeamProps } from "./team";

export interface ProjectDraftProps {
    projectName: string;
    projectDescription: string;
    teams?: TeamProps[];
    branchName?: string;
    branchDescription?: string;
    firstColor?: string;
    secondColor?: string;
}