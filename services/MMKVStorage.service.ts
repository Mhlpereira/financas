import { Istorage } from "@/src/storage/interfaces/istorage";
import { MMKV } from "react-native-mmkv";


export class MMKVStorageService implements Istorage {
    
    private storage: MMKV;
    
    constructor() {
        this.storage = new MMKV({
            id: "finances_storage",
            encryptionKey: process.env.SECRET_KEY
        });
    }


    async getItem<T>(key: string): Promise<T | null> {
        const value = this.storage.getString(key);
        return value ? (JSON.parse(value) as T) : null;
    }

    async setItem<T>(key: string, value: T): Promise<void> {
        this.storage.set(key, JSON.stringify(value));
    }

    async removeItem(key: string): Promise<void> {
        this.storage.delete(key);
    }

    async clear(): Promise<void> {
        this.storage.clearAll();
    }

    async getMonthAllKeys(): Promise<string[]> {
        return this.storage.getAllKeys();
    }

} 