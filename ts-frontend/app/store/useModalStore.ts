import { create } from "zustand";

type ModalType = 'info' | 'warning';

export interface ModalButtonProps {
  type: ModalType;
  action: 'cancel' | 'confirm';
  label: string;
  onClick: () => void;
}

interface ModalState {
  isOpen: boolean;
  type: ModalType;
  title: string;
  content: string;
  buttons: ModalButtonProps[];
  openModal: (params: {
    type: ModalType;
    title: string;
    content: string;
    buttons: ModalButtonProps[];
  }) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  type: 'info',
  title: '',
  content: '',
  buttons: [],
  openModal: ({ type, title, content, buttons }) =>
    set({ isOpen: true, type, title, content, buttons }),
  closeModal: () => set({ isOpen: false }),
}));