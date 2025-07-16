import { create } from "zustand";

interface NameState {
    userName: string;
}

export const useNameStore = create<NameState>()((set) => ({
    userName: "",
    setName: (name: string) => set({ userName: name}),
}));