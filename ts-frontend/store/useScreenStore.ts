import { create } from 'zustand';

interface ScreenState {
  isLargeScreen: boolean;
  setIsLargeScreen: (isLarge: boolean) => void;
  initializeScreenListener: () => void;
}

const useScreenStore = create<ScreenState>((set) => ({
  isLargeScreen: false,
  
  setIsLargeScreen: (isLarge) => set({ isLargeScreen: isLarge }),
  
  initializeScreenListener: () => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        set({ isLargeScreen: window.innerWidth >= 1024 });
      };
      
      // Set initial value
      handleResize();
      
      // Add event listener
      window.addEventListener("resize", handleResize);
      
      // Return cleanup function
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  },
}));

export default useScreenStore;