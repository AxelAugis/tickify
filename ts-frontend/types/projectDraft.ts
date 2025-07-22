import { TeamProps } from "./team";

export interface ProjectDraftProps {
    title: string;
    description: string;
    teams?: TeamProps[];
    branchName?: string;
    branchDescription?: string;
    firstColor?: string;
    secondColor?: string;
}