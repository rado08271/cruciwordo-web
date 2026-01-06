import type { Infer } from "spacetimedb";
import type { WordPlacementsDatabaseModel } from "@spacetime";
import type {Direction} from "~/types/direction";
import {getDirectionFromString} from "~/types/direction";
import type Player from "~/types/player";

type IWord = {
    id: string,
    boardId: string,
    direction: Direction,
    startRow: number,
    startCol: number,
    word: string,
    depth: number
    foundBy: Player[]
}

class Word implements IWord {
    public boardId: string;
    public depth: number;
    public direction: Direction;
    public foundBy: Player[];
    public id: string;
    public startCol: number;
    public startRow: number;
    public word: string;

    constructor(wordPlacementDatabaseModel: Infer<typeof WordPlacementsDatabaseModel>) {

        this.id = wordPlacementDatabaseModel.id
        this.boardId = wordPlacementDatabaseModel.boardId
        this.startCol = wordPlacementDatabaseModel.startCol
        this.startRow = wordPlacementDatabaseModel.startRow
        this.word = wordPlacementDatabaseModel.word
        this.depth = wordPlacementDatabaseModel.word.length
        this.direction = getDirectionFromString(wordPlacementDatabaseModel.direction)

        this.foundBy = []
    }

    public assignPlayerToWord = (player: Player) => {
        if (!this.foundBy.includes(player)) {
            this.foundBy.push(player)
        }
    }

    public playerFoundWord = (player: Player): boolean => {
        return this.foundBy.includes(player)
    }
}


export default Word
