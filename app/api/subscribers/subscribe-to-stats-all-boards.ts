import type {GameSessionDatabaseModel, DbConnection} from "@spacetime";
import type {Identity} from "@clockworklabs/spacetimedb-sdk";
import {SetReducerFlags} from "@spacetime";

type Subscription = {
    unsubscribe: () => void
}

const SQL= () => 'SELECT * FROM board'
export const SubscribeToStatsAllBoardsCount = (conn: DbConnection, callback: (boardsCount: number) => void, errorCallback?: (error: Error) => void): Subscription  => {
    if (!conn.isActive) throw new Error("The connection is not active and subscription was stopped")

    const subscription = conn.subscriptionBuilder()
        .onApplied(ctx => {
            callback(ctx.db.board.count())

        })
        .subscribe(SQL())

    return {
        unsubscribe: () => {
            subscription.unsubscribe()
        }
    }
}
