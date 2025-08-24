import { create } from "zustand";
import { NavigationPage, INavigationState } from "../shared/interfaces/navigation.interface";

export const useNavigationStore = create<INavigationState>((set) => ({
    currentPage: 'home',
    setCurrentPage: (page: NavigationPage) => set({ currentPage: page }),
}));
