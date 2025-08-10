

export interface Installment {
    instalmentNumber: number;
    dueDate?: Date;
    amount: number;
    paid: boolean;
    paymentDate?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}