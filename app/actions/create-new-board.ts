import {create} from "zustand";
import type {BoardModel} from "~/types/board";

type GetBoardState = {
    board: BoardModel
    boardId?: string
    initBoard: (board: BoardModel) => void
    fetchBoardById: (boardId: string) => string
}


const useCreateNewBoard = create((set) => ({
    fishies: {},
    fetch: async (pond) => {
        const response = await fetch(pond)
        set((state)=>{
            console.log(state.fishies)
        })
    },
}))

