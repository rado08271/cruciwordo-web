import {create} from "zustand";
import getBoardById from "~/api/get-board-by-id";
import type {BoardModel} from "~/types/board";

type GetBoardState = {
    board: BoardModel
    boardId?: string
    initBoard: (board: BoardModel) => void
    fetchBoardById: (boardId: string) => string
}

const useGetBoardById = create<GetBoardState>((set) => ({
    board: {} as BoardModel,
    initBoard: (board: BoardModel) => {
        set((state)=>{
            state.board = board
            console.log(state.board)
        })
    },
    fetchBoardById: async (boardId: string) => {
        const response = await getBoardById(boardId)

        console.log(response)
        set((state)=>{
            console.log(state.board)
        })
    },
}))

export default useGetBoardById