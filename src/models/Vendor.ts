import {ObjectId} from "mongodb";

export interface IVendor {
    _id?: ObjectId | null;
    companyName: string;
    products: string[];
    email: string;
    phoneNumber: string;
    contactPerson: string;
}