import { User } from "./user.type.js";

export type Comment = {
    content: string;
    raiting: number;
    postDate: string;
    user: User;
}