import { create } from "zustand";

// Create a state to store the two background colors of the project
interface BackgroundProjectState {
    firstColor: string;
    secondColor: string;
    setFirstColor: (color: string) => void;
    setSecondColor: (color: string) => void;
    clearColors: () => void;
}

const useBackgroundProjectStore = create<BackgroundProjectState>((set) => ({
    firstColor: '#FAFAFA',
    secondColor: '#FAFAFA', 
    setFirstColor: (color) => set({ firstColor: color }),
    setSecondColor: (color) => set({ secondColor: color }),
    clearColors: () => set({ firstColor: '#FAFAFA', secondColor: '#FAFAFA' })
}));

export default useBackgroundProjectStore;