export interface IStorageProvider {
    get(key: string): any;
    set(key: string, model: any): void;
    delete(key: string): void;
    clearAll(): void;
}
