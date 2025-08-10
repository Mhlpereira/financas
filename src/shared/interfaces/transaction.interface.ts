import { TransactionType } from "../enums/transaction.enum";
import { Installment } from "./installment.interface";


export interface Transaction {

    id: string;
    type: TransactionType;
    title: string;
    amount: number;
    date: Date;
    isInstalment?: boolean;
    installments?: Installment[];
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}