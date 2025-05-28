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

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        set({ user: null, loading: false, error: 'Aucun token trouvé' });
      } else { 
          const response = await axios.get('/auth/user');
          const data = response.data;
          if(data) {
            set({ user: data, loading: false });
          } else {
            set({ user: null, loading: false, error: 'Utilisateur non trouvé' });
          }
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