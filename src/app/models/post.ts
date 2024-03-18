import { ApplicationUser } from "./user";

export interface Post {
    postId:number,
    userId:string,
    applicationUser: ApplicationUser,
    likesCount:number,
    commentsCount:number,
    content:string,
}