import { Message } from "./message";

export interface ApplicationUser{
    id:string,
    userName:string,
    fullName:string,
    email:string,
    phoneNumber:string,
    latestMessage?: Message
}