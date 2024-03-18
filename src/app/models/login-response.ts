import { ApplicationUser } from "./user";

export interface LoginResponse {
    user: ApplicationUser,
    token:string
}