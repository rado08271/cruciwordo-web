import type {Identity} from "@clockworklabs/spacetimedb-sdk";
import type {BoardDatabaseModel, DbConnection, EventContext, WordPlacementsDatabaseModel} from "@spacetime";

type Subscription = {
    // getData: () => Subscription
    unsubscribe: () => void
}

const SQL= (boardId: string) => `SELECT * FROM word WHERE board_id = '${boardId}'`
export const SubscribeToBoardWords = (conn: DbConnection, boardId: string, callback: (words: WordPlacementsDatabaseModel[]) => void): Subscription => {
    if (!conn.isActive) throw Error("The connection is not active and subscription was stopped")

    const subscription = conn.subscriptionBuilder()
        .onApplied(ctx => {
            callback(Array.from(ctx.db.word.iter()))
        })
        .subscribe(SQL(boardId))

    return {
        unsubscribe: () => {
            subscription.unsubscribe()
        }
    }
}
