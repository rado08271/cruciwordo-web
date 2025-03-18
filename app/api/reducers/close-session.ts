import {ReducerBuilderImpl, ReducerImpl} from "~/api/reducers/reducer";

interface ICloseSession {
    execute: (boardId: string) => void
    stop: () => void
}

class CloseSession extends ReducerImpl implements ICloseSession {
    static builder = (): ReducerBuilderImpl<CloseSession> => {
        return new ReducerBuilderImpl<CloseSession>((reducer: ReducerImpl) => {
            return new CloseSession(reducer.conn, reducer.onSuccessListener, reducer.onErrorListener)
        });
    }

    public execute = (boardId: string) => {
        this.conn.reducers.onCloseSession(this.defaultReducerCallback)

        this.conn.reducers.closeSession(boardId)
    }

    public stop = () => {
        this.conn.reducers.removeOnCloseSession(this.defaultReducerCallback)
    }
}

export default CloseSession;