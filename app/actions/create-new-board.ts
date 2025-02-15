import {create} from "zustand";
import createNewBoard from "~/api/create-new-board";

type GetBoardState = {
    boardId?: string
    boardInProgress: boolean
    createBoard: (solution: string, rows: number, cols: number) => void
}
// const useCreateNewBoardStore = create<GetBoardState>()(
//     (set) => ({
//         boardId: null,
//         boardInProgress: false,
//         createBoard: async (solution, rows, cols) => {
//             set((state) => {
//                 state.boardInProgress = true
//             })
//
//             try {
//                 const boardId = await createNewBoard(solution, rows, cols);
//
//                 set((state) => {
//                     state.boardInProgress = false
//                     state.boardId = boardId
//                 })
//
//             } catch (e) {
//                 set((state) => {
//                     state.boardInProgress = false
//                     state.boardId = undefined
//                 })
//             }
//
//         }
//     })
// )


const useCreateNewBoardStore = create<GetBoardState>()(
    (set) => ({
        boardId: null,
        boardInProgress: false,
        createBoard: async (solution, rows, cols) => {
            set({ boardInProgress: true })

            try {
                const boardId = await createNewBoard(solution, rows, cols);

                set({
                    boardInProgress: false,
                    boardId: boardId
                })

            } catch (e) {
                set({
                    boardInProgress: false
                })
            }

            set({ boardInProgress: false })
        }
    })
)

export default useCreateNewBoardStore