import {ReducerBuilderImpl, ReducerImpl} from "~/api/reducers/reducer";

interface IGenerateNewBoard {
    execute: (rows: number, cols: number, message: string) => void
    stop: () => void
}

class GenerateNewBoard extends ReducerImpl implements IGenerateNewBoard {
    static builder = (): ReducerBuilderImpl<GenerateNewBoard> => {
        return new ReducerBuilderImpl<GenerateNewBoard>((reducer: ReducerImpl) => {
            return new GenerateNewBoard(reducer.conn, reducer.onSuccessListener, reducer.onErrorListener)
        });
    }

    public execute = ( rows: number, cols: number, message: string) => {
        this.conn.reducers.onGenerateNewBoard(this.defaultReducerCallback)

        this.conn.reducers.generateNewBoard(rows, cols, message)
    }

    public stop = () => {
        this.conn.reducers.removeOnGenerateNewBoard(this.defaultReducerCallback)
    }
}

export default GenerateNewBoard;