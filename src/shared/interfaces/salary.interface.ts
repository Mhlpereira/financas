export interface ISalary {
    id: string;
    amount: number;
    createdAt: string;
    updatedAt: string;
}

export interface ISalaryState {
    salary: ISalary | null;
    setSalary: (salary: ISalary) => void;
    updateSalary: (amount: number) => void;
    deleteSalary: () => void;
    getSalary: () => Promise<ISalary | null>;
}
