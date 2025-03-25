import type {Identity} from "@clockworklabs/spacetimedb-sdk";
import type {BoardDatabaseModel, DbConnection, EventContext} from "@spacetime";

type Subscription = {
    // getData: () => Subscription
    unsubscribe: () => void
}

const SQL= (identity: Identity) => `SELECT * FROM board WHERE created_by = 0x${identity.data.toString(16)}`
export const SubscribeToBoardNew = (conn: DbConnection, identity: Identity, callback: (board: BoardDatabaseModel) => void): Subscription => {
    if (!conn.isActive) throw Error("The connection is not active and subscription was stopped")

    const sqlQuery = `SELECT * FROM board WHERE created_by = 0x${identity.data.toString(16)}`
    const onInsertNewBoard = (context: EventContext, row: BoardDatabaseModel) => {
        if (context.event.tag === "Reducer") {
            callback(row)
        }
    }

    const subscription = conn.subscriptionBuilder()
        .onApplied(ctx => {
            console.log("Successfully synced")

            ctx.db.board.onInsert(onInsertNewBoard)
        })
        .subscribe(sqlQuery)

    return {
        unsubscribe: () => {
            console.log('unsub')
            subscription.unsubscribeThen(ctx => {
                ctx.db.board.removeOnInsert(onInsertNewBoard)
            })
        }
    }
}
