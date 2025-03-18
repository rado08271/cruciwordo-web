import {ReducerBuilderImpl, ReducerImpl} from "~/api/reducers/reducer";

interface IJoinGame {
    execute: (boardId: string) => void
    stop: () => void
}

class JoinGame extends ReducerImpl implements IJoinGame {
    static builder = (): ReducerBuilderImpl<JoinGame> => {
        return new ReducerBuilderImpl<JoinGame>((reducer: ReducerImpl) => {
            return new JoinGame(reducer.conn, reducer.onSuccessListener, reducer.onErrorListener)
        });
    }

    public execute = (boardId: string) => {
        this.conn.reducers.onJoinGame(this.defaultReducerCallback)

        this.conn.reducers.joinGame(boardId)
    }

    public stop = () => {
        this.conn.reducers.removeOnJoinGame(this.defaultReducerCallback)
    }
}

export default JoinGame;