import {ReducerBuilderImpl, ReducerImpl} from "~/api/reducers/reducer";

interface IFinishGame {
    execute: (boardId: string) => void
    stop: () => void
}

class FinishGame extends ReducerImpl implements IFinishGame {
    static builder = (): ReducerBuilderImpl<FinishGame> => {
        return new ReducerBuilderImpl<FinishGame>((reducer: ReducerImpl) => {
            return new FinishGame(reducer.conn, reducer.onSuccessListener, reducer.onErrorListener)
        });
    }

    public execute = (boardId: string) => {
        this.conn.reducers.onFinishGame(this.defaultReducerCallback)

        this.conn.reducers.finishGame(boardId)
    }

    public stop = () => {
        this.conn.reducers.removeOnFinishGame(this.defaultReducerCallback)
    }
}

export default FinishGame;