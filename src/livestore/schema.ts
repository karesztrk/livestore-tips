import {
  Events,
  makeSchema,
  Schema,
  SessionIdSymbol,
  State,
} from "@livestore/livestore";

// You can model your state as SQLite tables (https://docs.livestore.dev/reference/state/sqlite-schema)
export const tables = {
  tips: State.SQLite.table({
    name: "tips",
    columns: {
      id: State.SQLite.text({ primaryKey: true }),
      text: State.SQLite.text({ default: "" }),
      deletedAt: State.SQLite.integer({
        nullable: true,
        schema: Schema.DateFromNumber,
      }),
    },
  }),
  // Client documents can be used for local-only state (e.g. form inputs)
  uiState: State.SQLite.clientDocument({
    name: "uiState",
    schema: Schema.Struct({
      newTip: Schema.String,
      filter: Schema.Literal("all", "active"),
    }),
    default: { id: SessionIdSymbol, value: { newTip: "", filter: "all" } },
  }),
};

// Events describe data changes (https://docs.livestore.dev/reference/events)
export const events = {
  tipCreated: Events.synced({
    name: "v1.TipCreated",
    schema: Schema.Struct({ id: Schema.String, text: Schema.String }),
  }),
  tipDeleted: Events.synced({
    name: "v1.TipDeleted",
    schema: Schema.Struct({ id: Schema.String, deletedAt: Schema.Date }),
  }),
  uiStateSet: tables.uiState.set,
};

// Materializers are used to map events to state (https://docs.livestore.dev/reference/state/materializers)
const materializers = State.SQLite.materializers(events, {
  "v1.TipCreated": ({ id, text }) => tables.tips.insert({ id, text }),
  "v1.TipDeleted": ({ id, deletedAt }) =>
    tables.tips.update({ deletedAt }).where({ id }),
});

const state = State.SQLite.makeState({ tables, materializers });

export const schema = makeSchema({ events, state });
