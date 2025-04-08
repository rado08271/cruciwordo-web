import type {GameSessionDatabaseModel, DbConnection, EventContext} from "@spacetime";
import {SubscribeToGameSession} from "~/api/subscribers/subscribe-to-game-session";
import {SubscribeToGamePlayers} from "~/api/subscribers/subscribe-to-game-players";

type Subscription = {
    // getData: () => Subscription
    unsubscribe: () => void
}

const SQL= (boardId: string) => `SELECT * FROM game_session WHERE board_id = '${boardId}'`
export const SubscribeToGameJoins = (conn: DbConnection, boardId: string, callback: (games: GameSessionDatabaseModel) => void): Subscription  => {
    if (!conn.isActive) throw new Error("The connection is not active and subscription was stopped")

    const time = new Date().getTime()
    const onInsert = (ctx: EventContext, row: GameSessionDatabaseModel) => {
        // if (ctx.event.tag === "Reducer" && ctx.event.value.reducer.name === "join_game") {
        if (ctx.event.tag === "Reducer" && (ctx.event.value.reducer.name === "join_game" || ctx.event.value.reducer.name === "close_session")) {
            callback(row)
        }
    }

    const onUpdate = (ctx: EventContext, row: GameSessionDatabaseModel, newRow: GameSessionDatabaseModel) => {
        // if (newRow.isOnline) {
            callback(newRow)
        // }

    }

    const subscription = conn.subscriptionBuilder()
        .onApplied(ctx => {
            ctx.db.gameSession.onUpdate(onUpdate)
            ctx.db.gameSession.onInsert(onInsert)
        })
        .subscribe(SQL(boardId))

    return {
        unsubscribe: () => {
            subscription.unsubscribeThen(ctx => {
                ctx.db.gameSession.removeOnUpdate(onUpdate)
                ctx.db.gameSession.removeOnInsert(onInsert)
            })
        }
    }
}
