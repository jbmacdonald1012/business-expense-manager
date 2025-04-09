import {ObjectId} from "mongodb";

export interface IInventory {
    _id?: ObjectId | null;
    product: string;
    description: string;
    pricePerUnit: number;
    quantity: number;
}