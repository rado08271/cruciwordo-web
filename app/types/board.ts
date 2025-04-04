import type {BoardDatabaseModel} from "@spacetime";
import {Identity, Timestamp} from "@clockworklabs/spacetimedb-sdk";
import {getDirectionVector} from "~/types/direction";
import type Player from "~/types/player";
import type Word from "~/types/word";
import type Cell from "~/types/cell";

type IBoard = {
    id: string,
    createdDate: Timestamp,
    createdBy: Player,
    rows: number,
    cols: number,
    message: string,
    solution: string,
    grid: Cell[][],
};

class Board implements IBoard {
    private boardDatabaseModel: BoardDatabaseModel
    public cols: number;
    public rows: number;
    public createdBy: Player;
    public createdDate: Timestamp;
    public grid: Cell[][];
    public id: string;
    public message: string;
    public solution: string;

    public constructor(boardDatabaseModel: BoardDatabaseModel) {
        this.boardDatabaseModel = boardDatabaseModel

        this.cols = boardDatabaseModel.cols
        this.rows = boardDatabaseModel.rows
        this.id = boardDatabaseModel.id
        this.solution = boardDatabaseModel.solution
        this.createdDate = boardDatabaseModel.createdDate
        this.message = boardDatabaseModel.message

        // create grid
        this.grid = this.createEmptyGrid()

    }

    private createEmptyGrid = (): Cell[][] => {
        const tiles: Cell[][] = []
        // init the tiles first
        for (let ridx = 0; ridx < this.rows; ridx++) {
            const row: Cell[] = new Array(this.cols).fill(undefined).map((_, cidx) => ({
                row: ridx,
                col: cidx,
                value: "?",
                foundBy: [],
                word: []
            }))

            tiles.push(row)
        }

        return tiles
    }

    public propagateBoardWords = (words: Word[]) => {
        if (!words) return []

        // Propagate words
        for (const sequence of words) {
            const [dirCol, dirRow] = getDirectionVector(sequence.direction)
            let endRow = (sequence.startRow + (dirRow * (sequence.depth )))
            let endCol = (sequence.startCol + (dirCol * (sequence.depth )))

            let currentRow = sequence.startRow
            let currentCol = sequence.startCol
            let step = 0;

            while (currentRow !== endRow || currentCol !== endCol) {
                this.grid[currentRow][currentCol].value = sequence.word.at(step)
                this.grid[currentRow][currentCol].foundBy = sequence.foundBy

                if (!this.grid[currentRow][currentCol].word.find(word => word === sequence))
                    this.grid[currentRow][currentCol].word.push(sequence)

                currentRow += dirRow
                currentCol += dirCol
                step += 1;
            }
        }

        // Propagate solution
        let solutionIndex = 0
        for (const row of this.grid) {
            for (const cell of row) {
                if (cell.value === "?") {
                    cell.value = this.solution.at(solutionIndex)
                    solutionIndex += 1
                    if (solutionIndex === this.solution.length) break;
                }
            }
        }

    }

    public assignCreatorAccount = (creator: Player) => {
        this.createdBy = creator
    }
}

export default Board
