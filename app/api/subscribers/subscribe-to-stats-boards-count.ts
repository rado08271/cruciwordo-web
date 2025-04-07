import type {GameSessionDatabaseModel, DbConnection} from "@spacetime";
import type {Identity} from "@clockworklabs/spacetimedb-sdk";

type Subscription = {
    unsubscribe: () => void
}

const SQL= (identity: Identity) => `SELECT * FROM board WHERE created_by = 0x${identity.data.toString(16)}`
export const SubscribeToStatsBoardsCount = (conn: DbConnection, identity: Identity, callback: (boardsCount: number) => void, errorCallback?: (error: Error) => void): Subscription  => {
    if (!conn.isActive) throw new Error("The connection is not active and subscription was stopped")

    const subscription = conn.subscriptionBuilder()
        .onApplied(ctx => {
            callback(ctx.db.board.count())
        })
        .subscribe(SQL(identity))

    return {
        unsubscribe: () => {
            subscription.unsubscribe()
        }
    }
}
