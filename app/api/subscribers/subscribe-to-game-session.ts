import type {GameSessionDatabaseModel, DbConnection, EventContext} from "@spacetime";
import type {Identity} from "@clockworklabs/spacetimedb-sdk";

type Subscription = {
    // getData: () => Subscription
    unsubscribe: () => void
}

const SQL= (boardId: string, identity: Identity) => `SELECT * FROM game_session WHERE board_id = '${boardId}' AND played_by = 0x${identity.data.toString(16)}`
export const SubscribeToGameSession = (conn: DbConnection, boardId: string, identity: Identity, callback: (game: GameSessionDatabaseModel) => void, errorCallback?: (error: Error) => void): Subscription  => {
    if (!conn.isActive) throw new Error("The connection is not active and subscription was stopped")

    const onUpdate = (ctx: EventContext, row: GameSessionDatabaseModel, newRow: GameSessionDatabaseModel) => {
        callback(newRow)
    }

    const subscription = conn.subscriptionBuilder()
        .onApplied(ctx => {
            if (ctx.db.board.count() !== 1 && errorCallback) errorCallback(new Error(`There seems to be multiple sessions`))

            ctx.db.gameSession.onUpdate(onUpdate)
            callback(
                Array.from(ctx.db.gameSession.iter())[0]
            )
        })
        .subscribe(SQL(boardId, identity))

    return {
        unsubscribe: () => {
            subscription.unsubscribeThen( (ctx) =>
                ctx.db.gameSession.removeOnUpdate(onUpdate)
            )
        }
    }
}
