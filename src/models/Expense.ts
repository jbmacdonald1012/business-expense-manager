import {ObjectId} from "mongodb";

export interface IExpense {
    _id?: ObjectId | null;
    employeeName: string;
    vendor: string;
    description: string;
    amount: number;
    dateOfExpense: Date;
    submissionDate: Date;
    status: string;
    notes: string;
    createdAt?: Date;
}