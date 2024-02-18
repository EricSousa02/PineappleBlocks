"use client";

import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";

import { useMutation, useRedo, useStorage, useUndo } from "@/liveblocks.config";
import {
  handleCanvaseMouseMove,
  handleCanvasMouseDown,
  handleCanvasMouseUp,
  handleCanvasObjectModified,
  handleCanvasObjectMoving,
  handleCanvasObjectScaling,
  handleCanvasSelectionCreated,
  handleCanvasZoom,
  handlePathCreated,
  handleResize,
  initializeFabric,
  renderCanvas,
} from "@/lib/canvas";
import { handleDelete, handleKeyDown } from "@/lib/key-events";
import { LeftSidebar, Live, Navbar, RightSidebar } from "@/components/index";
import { handleImageUpload } from "@/lib/shapes";
import { defaultNavElement } from "@/constants";
import { ActiveElement, Attributes } from "@/types/type";

const Home = () => {
  /**
   * useUndo e useRedo são ganchos fornecidos pelo Liveblocks que permitem que você
   * desfazer e refazer mutações.
   *
   * useUndo: https://liveblocks.io/docs/api-reference/liveblocks-react#useUndo
   * useRedo: https://liveblocks.io/docs/api-reference/liveblocks-react#useRedo
   */
  const undo = useUndo();
  const redo = useRedo();

  /**
   * useStorage é um gancho fornecido pelo Liveblocks que permite armazenar
   * dados em um armazenamento de valores-chave e sincronizá-los automaticamente com outros usuários
   * ou seja, assina as atualizações dos dados selecionados
   *
   * useStorage: https://liveblocks.io/docs/api-reference/liveblocks-react#useStorage
   *
   * Aqui, estamos armazenando os objetos de tela no armazenamento de valores-chave.
   */
  const canvasObjects = useStorage((root) => root.canvasObjects);

  /**
   * canvasRef é uma referência ao elemento de tela que usaremos para inicializar
   * o fabric canvas.
   *
   * fabricRef é uma referência à tela de tecido que usamos para executar
   * na tela. É uma cópia da tela criada para que possamos usar
   * fora dos ouvintes de eventos da tela.
   */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  /**
   * isDrawing é um booleano que nos diz se o usuário está desenhando na tela.
   * Usamos isso para determinar se o usuário está desenhando ou não
   * ou seja, se o modo de desenho de forma livre está ativado ou não.
   */
  const isDrawing = useRef(false);

  /**
   * shapeRef é uma referência à forma que o usuário está desenhando no momento.
   * Usamos isso para atualizar as propriedades da forma quando o usuário esta no
   * desenho/criação de formas
   */
  const shapeRef = useRef<fabric.Object | null>(null);

  /**
   * selectedShapeRef é uma referência à forma que o usuário selecionou.
   * Por exemplo, se o usuário tiver selecionado a forma de retângulo
   * isso será definido como "rectangle".
   *
   * Estamos usando refs aqui porque queremos acessar essas variáveis dentro do
   * event listeners. Não queremos perder os valores dessas variáveis quando
   * o componente é renderizado novamente. As referências nos ajudam com isso.
   */
  const selectedShapeRef = useRef<string | null>(null);

  /**
   * activeObjectRef é uma referência ao objeto ativo/selecionado no canvas.
   *
   * Queremos acompanhar o objeto ativo para mantê-lo em forma selecionada quando o usuário estiver editando as propriedades/atributos do objeto, como largura, altura, cor, etc.
   *
   * Como estamos usando armazenamento em tempo real para sincronizar formas entre usuários em tempo real, precisamos re-renderizar o canvas quando as formas são atualizadas. Devido a essa re-renderização, a forma selecionada é perdida. Queremos acompanhar a forma selecionada para mantê-la selecionada quando o canvas for re-renderizado.
   */
  const activeObjectRef = useRef<fabric.Object | null>(null);
  const isEditingRef = useRef(false);

  /**
   * imageInputRef é uma referência ao elemento de entrada que usamos para carregar
   * uma imagem para o canvas.
   *
   * Queremos que o upload de imagem ocorra quando clicamos no item de imagem do
   * menu suspenso. Portanto, estamos usando esta ref para acionar o evento de clique no
   * elemento de entrada quando o usuário clica no item de imagem do menu suspenso.
   */
  const imageInputRef = useRef<HTMLInputElement>(null);

  /**
   * activeElement é um objeto que contém o nome, valor e ícone do
   * elemento ativo na barra de navegação.
   */
  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: "",
    value: "",
    icon: "",
  });

  /**
   * elementAttributes é um objeto que contém os atributos do elemento selecionado
   * no canvas.
   *
   * Usamos isso para atualizar os atributos do elemento selecionado quando o usuário
   * está editando as propriedades/atributos de largura, altura, cor, etc.
   * do objeto.
   */
  const [elementAttributes, setElementAttributes] = useState<Attributes>({
    width: "",
    height: "",
    fontSize: "",
    fontFamily: "",
    fontWeight: "",
    fill: "#aabbcc",
    stroke: "#aabbcc",
  });

  /**
   * deleteShapeFromStorage é uma mutação que exclui uma forma do
   * armazenamento de chave-valor do Liveblocks.
   * useMutation é um hook fornecido pelo Liveblocks que permite realizar
   * mutações em dados do Liveblocks.
   *
   * useMutation: https://liveblocks.io/docs/api-reference/liveblocks-react#useMutation
   * delete: https://liveblocks.io/docs/api-reference/liveblocks-client#LiveMap.delete
   * get: https://liveblocks.io/docs/api-reference/liveblocks-client#LiveMap.get
   *
   * Estamos usando essa mutação para excluir uma forma do armazenamento de chave-valor quando
   * o usuário exclui uma forma do canvas.
   */
  const deleteShapeFromStorage = useMutation(({ storage }, shapeId) => {
    /**
     * canvasObjects é um Map que contém todas as formas no chave-valor.
     * Como uma loja. Podemos criar várias lojas no Liveblocks.
     *
     * delete: https://liveblocks.io/docs/api-reference/liveblocks-client#LiveMap.delete
     */
    const canvasObjects = storage.get("canvasObjects");
    canvasObjects.delete(shapeId);
  }, []);

  /**
   * deleteAllShapes é uma mutação que exclui todas as formas do
   * armazenamento de chave-valor do Liveblocks.
   *
   * delete: https://liveblocks.io/docs/api-reference/liveblocks-client#LiveMap.delete
   * get: https://liveblocks.io/docs/api-reference/liveblocks-client#LiveMap.get
   *
   * Estamos usando essa mutação para excluir todas as formas do armazenamento de chave-valor quando o usuário clica no botão de redefinição.
   */
  const deleteAllShapes = useMutation(({ storage }) => {
    // obter a loja canvasObjects
    const canvasObjects = storage.get("canvasObjects");

    // se a loja não existir ou estiver vazia, retornar
    if (!canvasObjects || canvasObjects.size === 0) return true;

    // excluir todas as formas da loja
    for (const [key, value] of canvasObjects.entries()) {
      canvasObjects.delete(key);
    }

    // retornar verdadeiro se a loja estiver vazia
    return canvasObjects.size === 0;
  }, []);

  /**
   * syncShapeInStorage é uma mutação que sincroniza a forma no chave-valor
   * armazenamento do Liveblocks.
   *
   * Estamos usando essa mutação para sincronizar a forma no armazenamento de chave-valor
   * sempre que o usuário realiza qualquer ação no canvas, como desenhar, mover,
   * editar, excluir, etc.
   */
  const syncShapeInStorage = useMutation(({ storage }, object) => {
    // se o objeto passado for nulo, retornar
    if (!object) return;
    const { objectId } = object;

    /**
     * Converter objeto Fabric (kclass) em formato JSON para que possamos armazená-lo no
     * armazenamento de chave-valor.
     */
    const shapeData = object.toJSON();
    shapeData.objectId = objectId;

    const canvasObjects = storage.get("canvasObjects");
    /**
     * set é um método fornecido pelo Liveblocks que permite definir um valor
     *
     * set: https://liveblocks.io/docs/api-reference/liveblocks-client#LiveMap.set
     */
    canvasObjects.set(objectId, shapeData);
  }, []);

  /**
   * Defina o elemento ativo na barra de navegação e execute a ação com base
   * no elemento selecionado.
   *
   * @param elem
   */
  const handleActiveElement = (elem: ActiveElement) => {
    setActiveElement(elem);

    switch (elem?.value) {
      // excluir todas as formas do canvas
      case "reset":
        // limpar o armazenamento
        deleteAllShapes();
        // limpar o canvas
        fabricRef.current?.clear();
        // definir "select" como o elemento ativo
        setActiveElement(defaultNavElement);
        break;

      // excluir a forma selecionada do canvas
      case "delete":
        // excluí-lo do canvas
        handleDelete(fabricRef.current as any, deleteShapeFromStorage);
        // definir "select" como o elemento ativo
        setActiveElement(defaultNavElement);
        break;

      // carregar uma imagem para o canvas
      case "image":
        // acionar o evento de clique no elemento de entrada que abre o diálogo de arquivo
        imageInputRef.current?.click();
        /**
         * definir o modo de desenho como falso
         * Se o usuário estiver desenhando no canvas, queremos parar o
         * modo de desenho quando clicado no item de imagem do menu suspenso.
         */
        isDrawing.current = false;

        if (fabricRef.current) {
          // desativar o modo de desenho do canvas
          fabricRef.current.isDrawingMode = false;
        }
        break;

      // para comentários, não fazer nada
      case "comments":
        break;

      default:
        // definir a forma selecionada como o elemento selecionado
        selectedShapeRef.current = elem?.value as string;
        break;
    }
  };

  useEffect(() => {
    // inicializar o canvas do fabric
    const canvas = initializeFabric({
      canvasRef,
      fabricRef,
    });

    /**
     * ouvir o evento de clique do mouse no canvas que é disparado quando o
     * usuário clica no canvas
     *
     * Inspetor de eventos: http://fabricjs.com/events
     * Lista de eventos: http://fabricjs.com/docs/fabric.Canvas.html#fire
     */
    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        selectedShapeRef,
        isDrawing,
        shapeRef,
      });
    });

    /**
     * ouvir o evento de movimento do mouse no canvas que é disparado quando o
     * usuário move o mouse no canvas
     *
     * Inspetor de eventos: http://fabricjs.com/events
     * Lista de eventos: http://fabricjs.com/docs/fabric.Canvas.html#fire
     */
    canvas.on("mouse:move", (options) => {
      handleCanvaseMouseMove({
        options,
        canvas,
        isDrawing,
        selectedShapeRef,
        shapeRef,
        syncShapeInStorage,
      });
    });

    /**
     * ouvir o evento de soltar o mouse no canvas que é disparado quando o
     * usuário libera o mouse no canvas
     *
     * Inspetor de eventos: http://fabricjs.com/events
     * Lista de eventos: http://fabricjs.com/docs/fabric.Canvas.html#fire
     */
    canvas.on("mouse:up", () => {
      handleCanvasMouseUp({
        canvas,
        isDrawing,
        shapeRef,
        activeObjectRef,
        selectedShapeRef,
        syncShapeInStorage,
        setActiveElement,
      });
    });

    /**
     * ouvir o evento de criação de caminho no canvas que é disparado quando
     * o usuário cria um caminho no canvas usando o modo de desenho livre
     *
     * Inspetor de eventos: http://fabricjs.com/events
     * Lista de eventos: http://fabricjs.com/docs/fabric.Canvas.html#fire
     */
    canvas.on("path:created", (options) => {
      handlePathCreated({
        options,
        syncShapeInStorage,
      });
    });

    /**
     * ouvir o evento de objeto modificado no canvas que é disparado
     * quando o usuário modifica um objeto no canvas. Basicamente, quando o
     * usuário altera a largura, altura, cor, etc. propriedades/atributos de
     * o objeto ou move o objeto no canvas.
     *
     * Inspetor de eventos: http://fabricjs.com/events
     * Lista de eventos: http://fabricjs.com/docs/fabric.Canvas.html#fire
     */
    canvas.on("object:modified", (options) => {
      handleCanvasObjectModified({
        options,
        syncShapeInStorage,
      });
    });

    /**
     * ouvir o evento de movimento do objeto no canvas que é disparado
     * quando o usuário move um objeto no canvas.
     *
     * Inspetor de eventos: http://fabricjs.com/events
     * Lista de eventos: http://fabricjs.com/docs/fabric.Canvas.html#fire
     */
    canvas?.on("object:moving", (options) => {
      handleCanvasObjectMoving({
        options,
      });
    });

    /**
     * ouvir o evento de seleção criada no canvas que é disparado
     * quando o usuário seleciona um objeto no canvas.
     *
     * Inspetor de eventos: http://fabricjs.com/events
     * Lista de eventos: http://fabricjs.com/docs/fabric.Canvas.html#fire
     */
    canvas.on("selection:created", (options) => {
      handleCanvasSelectionCreated({
        options,
        isEditingRef,
        setElementAttributes,
      });
    });

    /**
     * ouvir o evento de escala no canvas que é disparado quando o
     * usuário escala um objeto no canvas.
     *
     * Inspetor de eventos: http://fabricjs.com/events
     * Lista de eventos: http://fabricjs.com/docs/fabric.Canvas.html#fire
     */
    canvas.on("object:scaling", (options) => {
      handleCanvasObjectScaling({
        options,
        setElementAttributes,
      });
    });

    /**
     * ouvir o evento de roda do mouse no canvas que é disparado quando
     * o usuário rola a roda do mouse no canvas.
     *
     * Inspetor de eventos: http://fabricjs.com/events
     * Lista de eventos: http://fabricjs.com/docs/fabric.Canvas.html#fire
     */
    canvas.on("mouse:wheel", (options) => {
      handleCanvasZoom({
        options,
        canvas,
      });
    });

    /**
     * ouvir o evento de redimensionamento na janela que é disparado quando o
     * usuário redimensiona a janela.
     *
     * Estamos usando isso para redimensionar o canvas quando o usuário redimensiona o
     * janela.
     */
    window.addEventListener("resize", () => {
      handleResize({
        canvas: fabricRef.current,
      });
    });

    /**
     * ouvir o evento de pressionar uma tecla na janela que é disparado quando o
     * usuário pressiona uma tecla no teclado.
     *
     * Estamos usando isso para realizar algumas ações como excluir, copiar, colar, etc. quando o usuário pressiona as teclas respectivas no teclado.
     */
    window.addEventListener("keydown", (e) =>
      handleKeyDown({
        e,
        canvas: fabricRef.current,
        undo,
        redo,
        syncShapeInStorage,
        deleteShapeFromStorage,
      })
    );

    // descartar o canvas e remover os ouvintes de eventos quando o componente for desmontado
    return () => {
      /**
       * dispose é um método fornecido pelo Fabric que permite descartar
       * o canvas. Limpa o canvas e remove todos os ouvintes de eventos
       *
       * dispose: http://fabricjs.com/docs/fabric.Canvas.html#dispose
       */
      canvas.dispose();

      // remover os ouvintes de eventos
      window.removeEventListener("resize", () => {
        handleResize({
          canvas: null,
        });
      });

      window.removeEventListener("keydown", (e) =>
        handleKeyDown({
          e,
          canvas: fabricRef.current,
          undo,
          redo,
          syncShapeInStorage,
          deleteShapeFromStorage,
        })
      );
    };
  }, [canvasRef]); // execute este efeito apenas uma vez quando o componente é montado e o canvasRef muda

  // renderizar o canvas quando os canvasObjects do armazenamento ao vivo mudam
  useEffect(() => {
    renderCanvas({
      fabricRef,
      canvasObjects,
      activeObjectRef,
    });
  }, [canvasObjects]);

  const [isMobileButtonOpen, setIsMobileButtonOpen] = useState(false);

  return (
    <main className='h-screen overflow-hidden'>
      <Navbar
        setIsMobileButtonOpen={setIsMobileButtonOpen}
        imageInputRef={imageInputRef}
        activeElement={activeElement}
        handleImageUpload={(e: any) => {
          // impedir o comportamento padrão do elemento de entrada
          e.stopPropagation();

          handleImageUpload({
            file: e.target.files[0],
            canvas: fabricRef as any,
            shapeRef,
            syncShapeInStorage,
          });
        }}
        handleActiveElement={handleActiveElement}
      />

      <section className='flex h-full flex-row overflow-hidden'>
        <LeftSidebar allShapes={Array.from(canvasObjects)} />

        <Live canvasRef={canvasRef} undo={undo} redo={redo} />

        <RightSidebar
          elementAttributes={elementAttributes}
          setElementAttributes={setElementAttributes}
          fabricRef={fabricRef}
          isEditingRef={isEditingRef}
          activeObjectRef={activeObjectRef}
          syncShapeInStorage={syncShapeInStorage}
          isMobileButtonOpen={isMobileButtonOpen}
        />
      </section>
    </main>
  );
};

export default Home;
