"use client";

import { useCallback, useEffect, useState } from "react";

import { useBroadcastEvent, useEventListener, useMyPresence, useOthers } from "@/liveblocks.config";
import useInterval from "@/hooks/useInterval";
import { CursorMode, CursorState, Reaction, ReactionEvent } from "@/types/type";
import { shortcuts } from "@/constants";

import { Comments } from "./comments/Comments";
import { CursorChat, FlyingReaction, LiveCursors, ReactionSelector } from "./index";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu";
import CircularButton from "./CircularButton";

type Props = {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  undo: () => void;
  redo: () => void;
};

const Live = ({ canvasRef, undo, redo }: Props) => {
  /**
   * useOthers retorna a lista de outros usuários na sala.
   *
   * useOthers: https://liveblocks.io/docs/api-reference/liveblocks-react#useOthers
   */
  const others = useOthers();

  /**
   * useMyPresence retorna a presença do usuário atual na sala.
   * Também retorna uma função para atualizar a presença do usuário atual.
   *
   * useMyPresence: https://liveblocks.io/docs/api-reference/liveblocks-react#useMyPresence
   */
  const [{ cursor }, updateMyPresence] = useMyPresence() as any;

  /**
   * useBroadcastEvent é usado para transmitir um evento para todos os outros usuários na sala.
   *
   * useBroadcastEvent: https://liveblocks.io/docs/api-reference/liveblocks-react#useBroadcastEvent
   */
  const broadcast = useBroadcastEvent();

  // armazena as reações criadas ao clicar com o mouse
  const [reactions, setReactions] = useState<Reaction[]>([]);

  // rastreia o estado do cursor (oculto, bate-papo, reação, seletor de reação)
  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  });

  // define a reação do cursor
  const setReaction = useCallback((reaction: string) => {
    setCursorState({ mode: CursorMode.Reaction, reaction, isPressed: false });
  }, []);

  // Remove reações que não estão mais visíveis (a cada 1 segundo)
  useInterval(() => {
    setReactions((reactions) => reactions.filter((reaction) => reaction.timestamp > Date.now() - 4000));
  }, 1000);

  // Transmite a reação para outros usuários (a cada 100ms)
  useInterval(() => {
    if (cursorState.mode === CursorMode.Reaction && cursorState.isPressed && cursor) {
      // concatena todas as reações criadas ao clicar com o mouse
      setReactions((reactions) =>
        reactions.concat([
          {
            point: { x: cursor.x, y: cursor.y },
            value: cursorState.reaction,
            timestamp: Date.now(),
          },
        ])
      );

      // Transmite a reação para outros usuários
      broadcast({
        x: cursor.x,
        y: cursor.y,
        value: cursorState.reaction,
      });
    }
  }, 100);

  /**
   * useEventListener é usado para ouvir eventos transmitidos por outros
   * usuários.
   *
   * useEventListener: https://liveblocks.io/docs/api-reference/liveblocks-react#useEventListener
   */
  useEventListener((eventData) => {
    const event = eventData.event as ReactionEvent;
    setReactions((reactions) =>
      reactions.concat([
        {
          point: { x: event.x, y: event.y },
          value: event.value,
          timestamp: Date.now(),
        },
      ])
    );
  });

  // Ouve eventos de teclado para alterar o estado do cursor
  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "/") {
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: "",
        });
      } else if (e.key === "Escape") {
        updateMyPresence({ message: "" });
        setCursorState({ mode: CursorMode.Hidden });
      } else if (e.key === ".") {
        setCursorState({ mode: CursorMode.ReactionSelector });
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
      }
    };

    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [updateMyPresence]);

  // Ouve eventos de mouse para alterar o estado do cursor
  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    event.preventDefault();

    // se o cursor não estiver no modo seletor de reação, atualize a posição do cursor
    if (cursor == null || cursorState.mode !== CursorMode.ReactionSelector) {
      // obtenha a posição do cursor no canvas
      const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
      const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

      // transmita a posição do cursor para outros usuários
      updateMyPresence({
        cursor: {
          x,
          y,
        },
      });
    }
  }, []);

  // Oculta o cursor quando o mouse sai do canvas
  const handlePointerLeave = useCallback(() => {
    setCursorState({
      mode: CursorMode.Hidden,
    });
    updateMyPresence({
      cursor: null,
      message: null,
    });
  }, []);

  // Mostra o cursor quando o mouse entra no canvas
  const handlePointerDown = useCallback(
    (event: React.PointerEvent) => {
      // obtenha a posição do cursor no canvas
      const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
      const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

      updateMyPresence({
        cursor: {
          x,
          y,
        },
      });

      // se o cursor estiver no modo de reação, defina isPressed como true
      setCursorState((state: CursorState) =>
        cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: true } : state
      );
    },
    [cursorState.mode, setCursorState]
  );

  // oculta o cursor quando o mouse é liberado
  const handlePointerUp = useCallback(() => {
    setCursorState((state: CursorState) =>
      cursorState.mode === CursorMode.Reaction ? { ...state, isPressed: false } : state
    );
  }, [cursorState.mode, setCursorState]);

  // aciona ações respectivas quando o usuário clica no menu certo
  const handleContextMenuClick = useCallback((key: string) => {
    switch (key) {
      case "Chat":
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: "",
        });
        break;

      case "Reactions":
        setCursorState({ mode: CursorMode.ReactionSelector });
        break;

      case "Undo":
        undo();
        break;

      case "Redo":
        redo();
        break;

      default:
        break;
    }
  }, []);

  const handleCircularButtonClick = (buttonKey: any) => {
    // Chame a função handleContextMenuClick com a chave específica do botão
    handleContextMenuClick(buttonKey);
  };

  return (
    <>
      <div
        className="relative flex h-full w-full flex-1 items-center justify-center"
        id="canvas"
        style={{
          cursor: cursorState.mode === CursorMode.Chat ? "none" : "auto",
        }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <CircularButton onButtonClick={handleCircularButtonClick}/>
        <canvas ref={canvasRef} />

        {/* Renderizar as reações */}
        {reactions.map((reaction) => (
          <FlyingReaction
            key={reaction.timestamp.toString()}
            x={reaction.point.x}
            y={reaction.point.y}
            timestamp={reaction.timestamp}
            value={reaction.value}
          />
        ))}

        {/* Se o cursor estiver no modo de bate-papo, mostrar o cursor de bate-papo */}
        {cursor && (
          <CursorChat
            cursor={cursor}
            cursorState={cursorState}
            setCursorState={setCursorState}
            updateMyPresence={updateMyPresence}
          />
        )}

        {/* Se o cursor estiver no modo de seletor de reação, mostrar o seletor de reação */}
        {cursorState.mode === CursorMode.ReactionSelector && (
          <ReactionSelector
            setReaction={(reaction) => {
              setReaction(reaction);
            }}
          />
        )}

        {/* Mostrar os cursores ao vivo de outros usuários */}
        <LiveCursors others={others} />

        {/* Mostrar os comentários */}
        <Comments />
      </div>

      {/* <ContextMenuContent className="right-menu-content">
        {shortcuts.map((item) => (
          <ContextMenuItem
            key={item.key}
            className="right-menu-item"
            onClick={() => handleContextMenuClick(item.name)}
          >
            <p>{item.name}</p>
            <p className="text-xs text-primary-grey-300">{item.shortcut}</p>
          </ContextMenuItem>
        ))}
      </ContextMenuContent> */}

    </>
  );
};

export default Live;
