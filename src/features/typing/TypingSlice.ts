import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { TypingStateField, TypingStateItem } from "../../types/TypingStateField";


const initialState: TypingStateField = {
    typying: []
}

export const typingSlice = createSlice({
    name: 'type',
    initialState,
    reducers: {
        addUserInfo(state, action) {
            const newType: TypingStateItem = {
                id: nanoid(),
                time: action.payload.time,
                wpm: action.payload.wpm,
                accuracy: action.payload.accuracy,
                
            }
            state.typying.push(newType)
        },
        reset(state, action) {
            state.typying = state.typying.filter((type) =>
                type.id !== action.payload)
        }
    }
})

export const {addUserInfo, reset } = typingSlice.actions
export default typingSlice.reducer