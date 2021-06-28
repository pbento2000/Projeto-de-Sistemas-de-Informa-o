import { User } from "./user";

export interface Photo {
    _id?: string;
    photo: string;
    name: string;
    description?: string;
    likes: number;
    owner: User;
}