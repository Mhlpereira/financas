import { MMKVStorageService } from "./MMKVStorage.service";



export class FinancialServices {

    private storageService: MMKVStorageService;

    constructor() {
        this.storageService = new MMKVStorageService();
    }


    async addTransaction<T>(key: string, transaction: T): Promise<void> {
        const existingTransactions = await this.storageService.getItem<T[]>(key) || [];
        existingTransactions.push(transaction);
        await this.storageService.setItem(key, existingTransactions);
    }
}