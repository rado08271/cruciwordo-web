import type {GameSessionDatabaseModel, DbConnection} from "@spacetime";
import type {Identity} from "@clockworklabs/spacetimedb-sdk";

type Subscription = {
    unsubscribe: () => void
}

const SQL= (identity: Identity) => `SELECT * FROM game_session WHERE played_by = 0x${identity.data.toString(16)} AND finished = true`
export const SubscribeToStatsGamesFinished = (conn: DbConnection, identity: Identity, callback: (finishedSessionsCount: number) => void, errorCallback?: (error: Error) => void): Subscription  => {
    if (!conn.isActive) throw new Error("The connection is not active and subscription was stopped")

    console.log("Called subtsgf")
    const subscription = conn.subscriptionBuilder()
        .onApplied((ctx) => {
            callback(ctx.db.gameSession.count())
        })
        .subscribe(SQL(identity))

    return {
        unsubscribe: () => {
            subscription.unsubscribe()
        }
    }
}
