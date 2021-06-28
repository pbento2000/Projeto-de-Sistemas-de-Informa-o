import { Photo } from "./photo";

export interface User {
    _id: number;
    username: string;
    password: string;
    token: string;
    favorite_pics: Photo[];
}