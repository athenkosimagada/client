export interface ApiResponse<T>{
    result: T,
    isSuccess:boolean,
    message:string
}