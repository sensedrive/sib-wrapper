declare type ILists = Array<number>;
export declare class SibClass {
    email: string;
    apiKey: string;
    apiInstance: any;
    constructor(email: string, apiKey: string);
    delete(): Promise<void>;
    removeContactFromLists(listIds: ILists): Promise<void>;
    getContact(): Promise<any>;
    createContact(listId: number): Promise<any>;
    addContact(listId: number): Promise<void>;
}
export {};
