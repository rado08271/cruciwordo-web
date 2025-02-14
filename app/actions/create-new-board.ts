import {create} from "zustand";

const useCreateNewBoard = create((set) => ({
    fishies: {},
    fetch: async (pond) => {
        const response = await fetch(pond)
        set((state)=>{
            console.log(state.fishies)
        })
    },
}))

