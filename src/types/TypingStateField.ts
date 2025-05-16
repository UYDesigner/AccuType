export interface TypingStateItem {
    id : string ,
    time : string | null,
    wpm : number,
    accuracy : number,
    

}

export interface TypingStateField{
    typying : TypingStateItem[]
}