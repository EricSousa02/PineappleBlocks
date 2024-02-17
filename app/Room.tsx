"use client";

import { LiveMap } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";

import Loader from "@/components/Loader";
import { RoomProvider } from "@/liveblocks.config";

const Room = ({ children }: { children: React.ReactNode }) => {
  return (
    <RoomProvider
      id="fig-room"
      /**
       * initialPresence é usado para inicializar a presença do usuário atual
       * na sala.
       *
       * initialPresence: https://liveblocks.io/docs/api-reference/liveblocks-react#RoomProvider
       */
      initialPresence={{ cursor: null, cursorColor: null, editingText: null }}
      /**
       * initialStorage é usado para inicializar o armazenamento da sala.
       *
       * initialStorage: https://liveblocks.io/docs/api-reference/liveblocks-react#RoomProvider
       */
      initialStorage={{
        /**
         * Estamos usando um LiveMap para armazenar os objetos do canvas
         *
         * LiveMap: https://liveblocks.io/docs/api-reference/liveblocks-client#LiveMap
         */
        canvasObjects: new LiveMap(),
      }}
    >
      <ClientSideSuspense fallback={<Loader />}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}

export default Room;
