export interface Message{
    messageId:string,
    fromUserId:string,
    toUserId:string,
    content:string,
    sentOn?:any
}