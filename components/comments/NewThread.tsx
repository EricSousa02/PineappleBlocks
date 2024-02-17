"use client";

import {
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Slot } from "@radix-ui/react-slot";
import * as Portal from "@radix-ui/react-portal";
import { ComposerSubmitComment } from "@liveblocks/react-comments/primitives";

import { useCreateThread } from "@/liveblocks.config";
import { useMaxZIndex } from "@/lib/useMaxZIndex";

import PinnedComposer from "./PinnedComposer";
import NewThreadCursor from "./NewThreadCursor";

type ComposerCoords = null | { x: number; y: number };

type Props = {
  children: ReactNode;
};

export const NewThread = ({ children }: Props) => {
  // define o estado para rastrear se estamos colocando um novo comentário ou não
  const [creatingCommentState, setCreatingCommentState] = useState<
    "placing" | "placed" | "complete"
  >("complete");

  /**
   * Estamos usando o hook useCreateThread para criar um novo tópico.
   *
   * useCreateThread: https://liveblocks.io/docs/api-reference/liveblocks-react#useCreateThread
   */
  const createThread = useCreateThread();

  // obtenha o z-index máximo de um tópico
  const maxZIndex = useMaxZIndex();

  // define o estado para rastrear as coordenadas do compositor (editor de comentários do liveblocks)
  const [composerCoords, setComposerCoords] = useState<ComposerCoords>(null);

  // define o estado para rastrear o último evento de ponteiro
  const lastPointerEvent = useRef<PointerEvent>();

  // define o estado para rastrear se o usuário pode usar o compositor
  const [allowUseComposer, setAllowUseComposer] = useState(false);
  const allowComposerRef = useRef(allowUseComposer);
  allowComposerRef.current = allowUseComposer;

  useEffect(() => {
    // Se o compositor já estiver colocado, não faça nada
    if (creatingCommentState === "complete") {
      return;
    }

    // Coloque um compositor na tela
    const newComment = (e: MouseEvent) => {
      e.preventDefault();

      // Se já estiver colocado, clique fora para fechar o compositor
      if (creatingCommentState === "placed") {
        // verifique se o evento de clique está no/dentro do compositor
        const isClickOnComposer = ((e as any)._savedComposedPath = e
          .composedPath()
          .some((el: any) => {
            return el.classList?.contains("lb-composer-editor-actions");
          }));

        // se o clique estiver dentro/no compositor, não faça nada
        if (isClickOnComposer) {
          return;
        }

        // se o clique estiver fora do compositor, feche o compositor
        if (!isClickOnComposer) {
          setCreatingCommentState("complete");
          return;
        }
      }

      // O primeiro clique define o compositor
      setCreatingCommentState("placed");
      setComposerCoords({
        x: e.clientX,
        y: e.clientY,
      });
    };

    document.documentElement.addEventListener("click", newComment);

    return () => {
      document.documentElement.removeEventListener("click", newComment);
    };
  }, [creatingCommentState]);

  useEffect(() => {
    // Se estiver arrastando o compositor, atualize a posição
    const handlePointerMove = (e: PointerEvent) => {
      // Evita problema com composedPath sendo removido
      (e as any)._savedComposedPath = e.composedPath();
      lastPointerEvent.current = e;
    };

    document.documentElement.addEventListener("pointermove", handlePointerMove);

    return () => {
      document.documentElement.removeEventListener(
        "pointermove",
        handlePointerMove
      );
    };
  }, []);

  // Define o evento de ponteiro do último clique no corpo para uso posterior
  useEffect(() => {
    if (creatingCommentState !== "placing") {
      return;
    }

    const handlePointerDown = (e: PointerEvent) => {
      // se o compositor já estiver colocado, não faça nada
      if (allowComposerRef.current) {
        return;
      }

      // Evita problema com composedPath sendo removido
      (e as any)._savedComposedPath = e.composedPath();
      lastPointerEvent.current = e;
      setAllowUseComposer(true);
    };

    // Clique direito para cancelar a colocação
    const handleContextMenu = (e: Event) => {
      if (creatingCommentState === "placing") {
        e.preventDefault();
        setCreatingCommentState("complete");
      }
    };

    document.documentElement.addEventListener("pointerdown", handlePointerDown);
    document.documentElement.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.documentElement.removeEventListener(
        "pointerdown",
        handlePointerDown
      );
      document.documentElement.removeEventListener(
        "contextmenu",
        handleContextMenu
      );
    };
  }, [creatingCommentState]);

  // Ao enviar o compositor, crie um tópico e redefina o estado
  const handleComposerSubmit = useCallback(
    ({ body }: ComposerSubmitComment, event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();

      // Obtenha seu elemento de canvas
      const overlayPanel = document.querySelector("#canvas");

      // se não houver coordenadas do compositor ou último evento de ponteiro, significando que o usuário ainda não clicou, não faça nada
      if (!composerCoords || !lastPointerEvent.current || !overlayPanel) {
        return;
      }

      // Defina as coordenadas relativas ao canto superior esquerdo do seu canvas
      const { top, left } = overlayPanel.getBoundingClientRect();
      const x = composerCoords.x - left;
      const y = composerCoords.y - top;

      // crie um novo tópico com as coordenadas do compositor e os seletores do cursor
      createThread({
        body,
        metadata: {
          x,
          y,
          resolved: false,
          zIndex: maxZIndex + 1,
        },
      });

      setComposerCoords(null);
      setCreatingCommentState("complete");
      setAllowUseComposer(false);
    },
    [createThread, composerCoords, maxZIndex]
  );

  return (
    <>
      {/**
       * Slot é usado para envolver os filhos do componente NewThread
       * para nos permitir adicionar um ouvinte de eventos de clique aos filhos
       *
       * Slot: https://www.radix-ui.com/primitives/docs/utilities/slot
       *
       * Aviso: Não precisamos baixar este pacote especificamente,
       * já está incluído quando instalamos o Shadcn
       */}
      <Slot
        onClick={() =>
          setCreatingCommentState(
            creatingCommentState !== "complete" ? "complete" : "placing"
          )
        }
        style={{ opacity: creatingCommentState !== "complete" ? 0.7 : 1 }}
      >
        {children}
      </Slot>

      {/* se as coordenadas do compositor existirem e estivermos colocando um comentário, renderize o compositor */}
      {composerCoords && creatingCommentState === "placed" ? (
        /**
         * Portal.Root é usado para renderizar o compositor fora do componente NewThread para evitar problemas de z-index
         *
         * Portal.Root: https://www.radix-ui.com/primitives/docs/utilities/portal
         */
        <Portal.Root
          className='absolute left-0 top-0'
          style={{
            pointerEvents: allowUseComposer ? "initial" : "none",
            transform: `translate(${composerCoords.x}px, ${composerCoords.y}px)`,
          }}
          data-hide-cursors
        >
          <PinnedComposer onComposerSubmit={handleComposerSubmit} />
        </Portal.Root>
      ) : null}

      {/* Mostrar o cursor personalizado ao colocar um comentário. Aquele com a forma de comentário */}
      <NewThreadCursor display={creatingCommentState === "placing"} />
    </>
  );
};
