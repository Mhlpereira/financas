import { MMKVStorageService } from "./MMKVStorage.service";



export class FinancialServices {

    private storageService: MMKVStorageService;

    constructor() {
        this.storageService = new MMKVStorageService();
    }


    async addTransaction<T extends { id: string }>(key: string, transaction: T): Promise<void> {
        const existingTransactions = await this.storageService.getItem<T[]>(key) || [];
        existingTransactions.push(transaction);
        await this.storageService.setItem(key, existingTransactions);
    }


    async getAllTransactions<T extends { id: string }>(key: string): Promise<T[]> {
        return await this.storageService.getItem<T[]>(key) || [];
    }

    async deleteTransaction<T extends { id: string }>(key: string, transactionId: string): Promise<void> {
        const existingTransactions = await this.storageService.getItem<T[]>(key) || [];
        const updatedTransactions = existingTransactions.filter((transaction) => transaction.id !== transactionId);
        await this.storageService.setItem(key, updatedTransactions);
    }

    async updateTransaction<T extends { id: string }>(key: string, updatedTransaction: T): Promise<void> {
        const existingTransactions = await this.storageService.getItem<T[]>(key) || [];
        const index = existingTransactions.findIndex((transaction) => transaction.id === updatedTransaction.id);
        if (index !== -1) {
            existingTransactions[index] = updatedTransaction;
            await this.storageService.setItem(key, existingTransactions);
        }
    }

    async getMonthlyTransactions<T extends { date: Date }>(key: string, month: number, year: number): Promise<T[]> {
        const transactions = await this.storageService.getItem<T[]>(key) || [];
        return transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate.getMonth() === month && transactionDate.getFullYear() === year;
        });
    }
}