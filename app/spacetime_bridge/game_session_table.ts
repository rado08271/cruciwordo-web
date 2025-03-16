// THIS FILE IS AUTOMATICALLY GENERATED BY SPACETIMEDB. EDITS TO THIS FILE
// WILL NOT BE SAVED. MODIFY TABLES IN YOUR MODULE SOURCE CODE INSTEAD.

/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import {deepEqual, TableCache,} from "@clockworklabs/spacetimedb-sdk";
import {GameSessionDatabaseModel} from "./game_session_database_model_type";
 import type {EventContext} from ".";

/**
 * Table handle for the table `game_session`.
 *
 * Obtain a handle from the [`gameSession`] property on [`RemoteTables`],
 * like `ctx.db.gameSession`.
 *
 * Users are encouraged not to explicitly reference this type,
 * but to directly chain method calls,
 * like `ctx.db.gameSession.on_insert(...)`.
 */
export class GameSessionTableHandle {
  tableCache: TableCache<GameSessionDatabaseModel>;

  constructor(tableCache: TableCache<GameSessionDatabaseModel>) {
    this.tableCache = tableCache;
  }

  count(): number {
    return this.tableCache.count();
  }

  iter(): Iterable<GameSessionDatabaseModel> {
    return this.tableCache.iter();
  }
  /**
   * Access to the `id` unique index on the table `game_session`,
   * which allows point queries on the field of the same name
   * via the [`GameSessionIdUnique.find`] method.
   *
   * Users are encouraged not to explicitly reference this type,
   * but to directly chain method calls,
   * like `ctx.db.gameSession.id().find(...)`.
   *
   * Get a handle on the `id` unique index on the table `game_session`.
   */
  id = {
    // Find the subscribed row whose `id` column value is equal to `col_val`,
    // if such a row is present in the client cache.
    find: (col_val: string): GameSessionDatabaseModel | undefined => {
      for (let row of this.tableCache.iter()) {
        if (deepEqual(row.id, col_val)) {
          return row;
        }
      }
    },
  };

  onInsert = (cb: (ctx: EventContext, row: GameSessionDatabaseModel) => void) => {
    return this.tableCache.onInsert(cb);
  }

  removeOnInsert = (cb: (ctx: EventContext, row: GameSessionDatabaseModel) => void) => {
    return this.tableCache.removeOnInsert(cb);
  }

  onDelete = (cb: (ctx: EventContext, row: GameSessionDatabaseModel) => void) => {
    return this.tableCache.onDelete(cb);
  }

  removeOnDelete = (cb: (ctx: EventContext, row: GameSessionDatabaseModel) => void) => {
    return this.tableCache.removeOnDelete(cb);
  }

  // Updates are only defined for tables with primary keys.
  onUpdate = (cb: (ctx: EventContext, oldRow: GameSessionDatabaseModel, newRow: GameSessionDatabaseModel) => void) => {
    return this.tableCache.onUpdate(cb);
  }

  removeOnUpdate = (cb: (ctx: EventContext, onRow: GameSessionDatabaseModel, newRow: GameSessionDatabaseModel) => void) => {
    return this.tableCache.removeOnUpdate(cb);
  }}
