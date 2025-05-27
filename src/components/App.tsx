import type { FC } from "react";
import { nanoid } from "nanoid";
import { makePersistedAdapter } from "@livestore/adapter-web";
import LiveStoreSharedWorker from "@livestore/adapter-web/shared-worker?sharedworker";
import { LiveStoreProvider } from "@livestore/react";
import { unstable_batchedUpdates as batchUpdates } from "react-dom";
import LiveStoreWorker from "../livestore/livestore.worker?worker";
import { schema } from "../livestore/schema";
import Tips from "./Tips";

const storeId = nanoid();

const adapter = makePersistedAdapter({
  storage: { type: "opfs" },
  worker: LiveStoreWorker,
  sharedWorker: LiveStoreSharedWorker,
});

const App: FC = () => {
  return (
    <LiveStoreProvider
      schema={schema}
      adapter={adapter}
      renderLoading={(_) => <div>Loading LiveStore ({_.stage})...</div>}
      batchUpdates={batchUpdates}
      storeId={storeId}
      syncPayload={{ authToken: "insecure-token-change-me" }}
    >
      <Tips />
    </LiveStoreProvider>
  );
};

export default App;
