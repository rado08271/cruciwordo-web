type Direction = "NW" | "N" | "NE" | "W" | "C" | "E" | "SW" | "S" | "SE"

export type HistoryModel = {
    step: number,
    word: string,
    row: number,
    col: number,
    direction: Direction
}

export const stringToHistoryModel = (history: string): HistoryModel => {
    if (!history.match(new RegExp('^(.*\\|){4}([NSWE][WE]?)$'))) {
        throw new Error("Cannot process history item")
    }

    const historyTokens: [string, string, string, string, string] = history.split("|")

    const [step, word, row, col, direction] = historyTokens

    return {
        step: Number(step), row: Number(row), col: Number(col), direction: direction as Direction, word
    }
}