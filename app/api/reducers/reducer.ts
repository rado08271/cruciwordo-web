import {DbConnection, type ReducerEventContext} from "@spacetime";


type ReducerSuccessListener = () => void
type ReducerErrorListener = (error: Error) => void
type ReducerConstructorCallback<T> = (reducer: ReducerImpl) => T
type ReducerBuilder<T> = {
    addOnSuccess: (callback: ReducerSuccessListener) => ReducerBuilder<T>
    addOnError: (callback: ReducerErrorListener) => ReducerBuilder<T>
    addConnection: (conn?: DbConnection) => ReducerBuilder<T>
    build: () => T
}

export class ReducerImpl {
    public onErrorListener?: ReducerErrorListener
    public onSuccessListener?: ReducerSuccessListener
    public conn: DbConnection

    public constructor(conn: DbConnection, onSuccessListener?: ReducerSuccessListener, onErrorListener?: ReducerErrorListener) {
        this.conn = conn

        this.onErrorListener = onErrorListener
        this.onSuccessListener = onSuccessListener
    }

    protected defaultReducerCallback = (ctx: ReducerEventContext) => {
        if (this.onSuccessListener && ctx.event.status.tag === 'Committed') {
            this.onSuccessListener()
        } else if (this.onErrorListener && ctx.event.status.tag === 'Failed') {
            this.onErrorListener(new Error(ctx.event.status.value))
        } else if (this.onErrorListener && ctx.event.status.tag === 'OutOfEnergy') {
            this.onErrorListener(new Error("Oh no! Please immediately contact our team and tell them to get some TEV"))
        }
    }

}

export class ReducerBuilderImpl<T extends ReducerImpl> implements ReducerBuilder<T> {
    private onErrorListener?: ReducerErrorListener
    private onSuccessListener?: ReducerSuccessListener
    private conn?: DbConnection

    private readonly reducerConstructorCallback: ReducerConstructorCallback<T>

    public constructor(reducerConstructorCallback: ReducerConstructorCallback<T>) {
        this.reducerConstructorCallback = reducerConstructorCallback
    }

    addConnection = (conn?: DbConnection): ReducerBuilder<T> => {
        this.conn = conn
        return this;
    }

    addOnError = (callback: ReducerErrorListener): ReducerBuilder<T> => {
        this.onErrorListener = callback;
        return this;
    }

    addOnSuccess = (callback: ReducerSuccessListener): ReducerBuilder<T> => {
        this.onSuccessListener = callback;
        return this;
    }

    build(): T {
        if (!this.conn) throw new Error(`Cannot construct this reducer because no connection is available!`)

        return this.reducerConstructorCallback(new ReducerImpl(
            this.conn, this.onSuccessListener, this.onErrorListener
        ));
    }
}
