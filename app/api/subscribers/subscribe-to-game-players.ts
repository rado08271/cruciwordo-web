import type {GameSessionDatabaseModel, DbConnection, EventContext} from "@spacetime";

type Subscription = {
    // getData: () => Subscription
    unsubscribe: () => void
}

const SQL= (boardId: string) => `SELECT * FROM game_session WHERE board_id = '${boardId}'`
export const SubscribeToGamePlayers = (conn: DbConnection, boardId: string, callback: (games: GameSessionDatabaseModel[]) => void): Subscription  => {
    if (!conn.isActive) throw new Error("The connection is not active and subscription was stopped")

    const onInsert = (ctx: EventContext, row: GameSessionDatabaseModel) => {
        if (ctx.event.tag === "Reducer") {
            callback(
                Array
                    .from(ctx.db.gameSession.iter())
                    .filter(session => session.isOnline)
            )

        }
    }

    const onUpdate = (ctx: EventContext, row: GameSessionDatabaseModel, newRow: GameSessionDatabaseModel) => {
        callback(
            Array
                .from(ctx.db.gameSession.iter())
                .filter(session => session.isOnline)
        )

    }

    const subscription = conn.subscriptionBuilder()
        .onApplied(ctx => {
            ctx.db.gameSession.onInsert(onInsert)
            ctx.db.gameSession.onUpdate(onUpdate)

            callback (
                Array
                    .from(ctx.db.gameSession.iter())
                    .filter(session => session.isOnline)
            )
        })
        .subscribe(SQL(boardId))

    return {
        unsubscribe: () => {
            subscription.unsubscribeThen(ctx => {
                ctx.db.gameSession.removeOnInsert(onInsert)
                ctx.db.gameSession.removeOnUpdate(onUpdate)
            })
        }
    }
}
