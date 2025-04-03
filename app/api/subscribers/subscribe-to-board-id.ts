import type {BoardDatabaseModel, DbConnection} from "@spacetime";

type Subscription = {
    // getData: () => Subscription
    unsubscribe: () => void
}

const SQL= (boardId: string) => `SELECT * FROM board WHERE id = '${boardId}'`
export const SubscribeToBoardId = (conn: DbConnection, boardId: string, callback: (board: BoardDatabaseModel) => void, errorCallback?: (error: Error) => void): Subscription  => {
    if (!conn.isActive) throw new Error("The connection is not active and subscription was stopped")

    const subscription = conn.subscriptionBuilder()
        .onApplied(ctx => {
            if (ctx.db.board.count() === 0 && errorCallback) errorCallback(new Error(`Could not find any board with id ${boardId}`))

            if (ctx.db.board.count() > 0) callback(Array.from(ctx.db.board.iter()).at(0))
        })
        .subscribe(SQL(boardId))

    return {
        unsubscribe: () => {
            subscription.unsubscribe()
        }
    }
}
