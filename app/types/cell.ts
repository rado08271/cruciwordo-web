import type Player from "~/types/player";
import type Word from "~/types/word";

type Cell = {
    row: number,
    col: number
    value: string
    word: Word[],
}

export default Cell