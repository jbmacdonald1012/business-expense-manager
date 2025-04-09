import {ObjectId} from "mongodb";

export interface IEmployee {
    _id?: ObjectId | null;
    firstName: string;
    lastName: string;
    email: string;
    position: string;
    department: string;
    hireDate: Date;
    salary: number;
    isActive: boolean;
    createdAt?: Date;
}