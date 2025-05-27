import { useStore } from "@livestore/react";
import { type ChangeEvent, type KeyboardEvent } from "react";

import { uiState$ } from "../livestore/queries";
import { events, tables } from "../livestore/schema";
import { queryDb } from "@livestore/livestore";

const visibleTodos$ = queryDb(
  (get) => {
    // const { filter } = get(uiState$);
    return tables.tips.where({
      deletedAt: null,
    });
  },
  { label: "visibleTodos" },
);

const Tips = () => {
  const { store } = useStore();
  const { newTip } = store.useQuery(uiState$);

  const updatedNewTipText = (text: string) =>
    store.commit(events.uiStateSet({ newTip: text }));

  const todoCreated = () =>
    store.commit(
      events.tipCreated({ id: crypto.randomUUID(), text: newTip }),
      events.uiStateSet({ newTip: "" }),
    );

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    updatedNewTipText(e.target.value);

  const visibleTodos = store.useQuery(visibleTodos$);

  const onDelete = (todo: typeof tables.tips.Type) => () => {
    store.commit(
      events.tipDeleted({
        id: todo.id,
        deletedAt: new Date(),
      }),
    );
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      todoCreated();
    }
  };

  return (
    <div>
      <input
        placeholder="What's your tip?"
        autoFocus={true}
        value={newTip}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      <section className="main">
        <ul className="todo-list">
          {visibleTodos.map((todo) => (
            <li key={todo.id}>
              <div className="state">
                <label>{todo.text}</label>
                <button className="destroy" onClick={onDelete(todo)}>
                  X
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Tips;
