import type {GameSessionDatabaseModel, DbConnection} from "@spacetime";
import type {Identity} from "@clockworklabs/spacetimedb-sdk";

type Subscription = {
    unsubscribe: () => void
}

const SQL= (identity: Identity) => `SELECT * FROM game_session WHERE played_by = 0x${identity.data.toString(16)}`
export const SubscribeToStatsWordsFound = (conn: DbConnection, identity: Identity, callback: (userScore: number) => void, errorCallback?: (error: Error) => void): Subscription  => {
    if (!conn.isActive) throw new Error("The connection is not active and subscription was stopped")

    const subscription = conn.subscriptionBuilder()
        .onApplied(ctx => {
            let score = 0
            for (const game of ctx.db.gameSession.iter()) {
                score += game.foundWords.split("|").length
            }

            callback(score)
        })
        .subscribe(SQL(identity))

    return {
        unsubscribe: () => {
            subscription.unsubscribe()
        }
    }
}
