import type {HistoryModel} from "~/types/history";
import {stringToHistoryModel} from "~/types/history";
import type {CellModel} from "~/types/cell";

export type BoardModel = {
    id: string
    createdDate: Date
    rows: number
    cols: number
    originalMessage: string
    solution: string
    grid: CellModel[][]
    history: HistoryModel[]
}

export type BoardDTO = {
    id: string
    created_date: string
    rows: number
    cols: number
    original_message: string
    solution: string
    grid: string
    history: string[]
}

export const boardDTOToModel = ( dto: BoardDTO) : BoardModel => {
    const arrayGrid: CellModel[][] = [];
    let arrayRow: CellModel[] = [];
    let cols = 0;
    let rows = 0;
    let solIdx = 0;

    for (let cell of dto.grid) {
        let value: string = cell
        if (cell === '?') {
            value = dto.solution.at(solIdx) ?? cell
            solIdx += 1
        }

        arrayRow.push({
            row: rows,
            col: cols,
            solution: cell === '?',
            value
        })
        cols += 1

        if (cols === dto.cols) {
            arrayGrid.push(arrayRow)
            arrayRow = []
            rows += 1
            cols = 0
        }
    }

    return {
        createdDate: new Date(Date.parse(dto.created_date)),
        originalMessage: dto.original_message,
        cols: dto.cols,
        rows: dto.rows,
        solution: dto.solution,
        id: dto.id,
        grid: arrayGrid,
        history: dto.history.map(value => stringToHistoryModel(value))
    }
}

export const boardModelToDTO  = ( model: BoardModel) : BoardDTO => {
    return {
        id: model.id,
        cols: model.cols,
        rows: model.rows,
        solution: model.solution,
        original_message: model.originalMessage,
        created_date: model.createdDate.toISOString(),
        grid: "",
        history: ["", "", ""]
    }
}

