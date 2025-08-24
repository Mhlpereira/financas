import { create } from "zustand";
import { ISalary, ISalaryState } from "../shared/interfaces/salary.interface";
import { MMKVStorageService } from "../services/MMKVStorage.service";

const SALARY_KEY = "@finances:salary";
const storageService = new MMKVStorageService();

export const useSalaryStore = create<ISalaryState>((set, get) => ({
    salary: null,

    setSalary: (salary: ISalary) => {
        set({ salary });
        storageService.setItem(SALARY_KEY, salary);
    },

    updateSalary: (amount: number) => {
        const currentSalary = get().salary;
        const now = new Date().toISOString();
        
        const updatedSalary: ISalary = currentSalary 
            ? { ...currentSalary, amount, updatedAt: now }
            : {
                id: Date.now().toString(),
                amount,
                createdAt: now,
                updatedAt: now
            };

        set({ salary: updatedSalary });
        storageService.setItem(SALARY_KEY, updatedSalary);
    },

    deleteSalary: () => {
        set({ salary: null });
        storageService.removeItem(SALARY_KEY);
    },

    getSalary: async () => {
        const salary = await storageService.getItem<ISalary>(SALARY_KEY);
        if (salary) {
            set({ salary });
            return salary;
        }
        return null;
    }
}));
