import { create } from 'zustand';
import { User } from '../types/user';
import axios from '../utils/axios';

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchCurrentUser: () => Promise<void>;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,
  error: null,
  
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  fetchCurrentUser: async () => {
    try {
      set({ loading: true, error: null });
      
      // Récupérer les informations de l'utilisateur depuis l'API
      const response = await axios.get('/api/user/me');
      
      if (response.data && response.data.user) {
        set({ user: response.data.user, loading: false });
      } else {
        set({ user: null, loading: false, error: 'Utilisateur non trouvé' });
      }
    } catch (error) {
      set({ 
        user: null, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Une erreur est survenue' 
      });
    }
  },
}));

export default useUserStore;