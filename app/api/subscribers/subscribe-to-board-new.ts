import type {DbConnection} from "@spacetime";
import type {Identity} from "@clockworklabs/spacetimedb-sdk";
import {BoardDatabaseModel} from "@spacetime";

export const SubscribeToBoardNew = (conn: DbConnection, id: Identity) => {
    console.log("board status", conn.isActive)
    // conn.subscriptionBuilder()
    //     .onApplied(ctx => {
    //         console.log("user boards", ctx.db.board.count())
    //     })
    //     .subscribe(`SELECT * FROM board WHERE createdBy = '${id}'`)

    // conn.db.board.onInsert((ctx, row) => {
    //     console.log("Event tag", ctx.event.tag)
    //     console.log("New created row", row)
    // })
    // conn.db.board.onUpdate((ctx, row) => {
    //     console.log("Event tag", ctx.event.tag)
    //     console.log("New updated row", row)
    // })
    }