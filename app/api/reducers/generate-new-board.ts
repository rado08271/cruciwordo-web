import {DbConnection, type ReducerEventContext} from "@spacetime";

type GenerateNewBoardParams = {
    rows: number,
    cols: number,
    message: string
}

class GenerateNewBoard {
    private onErrorListener?: (error: Error) => void
    private onSuccessListener?: () => void
    private conn?: DbConnection

    private constructor() {}

    public static builder = (): GenerateNewBoard =>  {
        return new GenerateNewBoard();
    }

    public addOnSuccess = (callback: () => void): GenerateNewBoard => {
        this.onSuccessListener = callback;
        return this
    }

    public addOnError = (callback: (error: Error) => void): GenerateNewBoard => {
        this.onErrorListener = callback;
        return this
    }

    public addConnection = (conn: DbConnection): GenerateNewBoard => {
        this.conn = conn;
        return this
    }

    public execute = (params: GenerateNewBoardParams) => (message: string) => {
        if (!this.conn) throw Error("Connection is not available")

        this.conn.reducers.onGenerateNewBoard(this.defaultReducerCallback)

        this.conn.reducers.generateNewBoard(params.rows, params.cols, params.message)

        return this.stop
    }

    private defaultReducerCallback = (ctx: ReducerEventContext) => {
        if (this.onSuccessListener && ctx.event.status.tag === "Committed") {
            this.onSuccessListener()
        } else if (this.onErrorListener && ctx.event.status.tag === "Failed"){
            this.onErrorListener(new Error(ctx.event.status.value))
        }
    }

    private stop = (message: string) => {
        if (!this.conn) throw Error("Connection is not available")
        this.conn.reducers.removeOnGenerateNewBoard(this.defaultReducerCallback)
    }
}

export default GenerateNewBoard