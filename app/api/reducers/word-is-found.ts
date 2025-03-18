import {ReducerBuilderImpl, ReducerImpl} from "~/api/reducers/reducer";

interface IWordIsFound {
    execute: (boardId: string, word: string) => void
    stop: () => void
}

class WordIsFound extends ReducerImpl implements IWordIsFound {
    static builder = (): ReducerBuilderImpl<WordIsFound> => {
        return new ReducerBuilderImpl<WordIsFound>((reducer: ReducerImpl) => {
            return new WordIsFound(reducer.conn, reducer.onSuccessListener, reducer.onErrorListener)
        });
    }

    public execute = (boardId: string, word: string) => {
        this.conn.reducers.onWordIsFound(this.defaultReducerCallback)

        this.conn.reducers.wordIsFound(boardId, word)
    }

    public stop = () => {
        this.conn.reducers.removeOnWordIsFound(this.defaultReducerCallback)
    }
}

export default WordIsFound;