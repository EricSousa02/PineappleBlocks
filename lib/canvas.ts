import { fabric } from "fabric";
import { v4 as uuid4 } from "uuid";

import {
  CanvasMouseDown,
  CanvasMouseMove,
  CanvasMouseUp,
  CanvasObjectModified,
  CanvasObjectScaling,
  CanvasPathCreated,
  CanvasSelectionCreated,
  RenderCanvas,
} from "@/types/type";
import { defaultNavElement } from "@/constants";
import { createSpecificShape } from "./shapes";

// inicializar o canvas fabric
export const initializeFabric = ({
  fabricRef,
  canvasRef,
}: {
  fabricRef: React.MutableRefObject<fabric.Canvas | null>;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
}) => {
  // obter elemento canvas
  const canvasElement = document.getElementById("canvas");

  // criar canvas fabric
  const canvas = new fabric.Canvas(canvasRef.current, {
    width: canvasElement?.clientWidth,
    height: canvasElement?.clientHeight,
  });

  // definir a referência do canvas para fabricRef para que possamos usá-lo posteriormente fora do ouvinte do canvas
  fabricRef.current = canvas;

  return canvas;
};

// instanciar a criação de objeto/forma fabric personalizado e adicioná-lo ao canvas
export const handleCanvasMouseDown = ({
  options,
  canvas,
  selectedShapeRef,
  isDrawing,
  shapeRef,
}: CanvasMouseDown) => {
  // obter coordenadas do ponteiro
  const pointer = canvas.getPointer(options.e);

  /**
   * obter objeto alvo, ou seja, o objeto clicado
   * findTarget() retorna o objeto clicado
   *
   * findTarget: http://fabricjs.com/docs/fabric.Canvas.html#findTarget
   */
  const target = canvas.findTarget(options.e, false);

  // definir modo de desenho do canvas como false
  canvas.isDrawingMode = false;

  // se a forma selecionada for livre, definir o modo de desenho como true e retornar
  if (selectedShapeRef.current === "freeform") {
    isDrawing.current = true;
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.width = 5;
    return;
  }

  canvas.isDrawingMode = false;

  // se o alvo for a forma selecionada ou seleção ativa, definir isDrawing como false
  if (
    target &&
    (target.type === selectedShapeRef.current ||
      target.type === "activeSelection")
  ) {
    isDrawing.current = false;

    // definir objeto ativo como alvo
    canvas.setActiveObject(target);

    /**
     * setCoords() é usado para atualizar os controles do objeto
     * setCoords: http://fabricjs.com/docs/fabric.Object.html#setCoords
     */
    target.setCoords();
  } else {
    isDrawing.current = true;

    // criar objeto/forma fabric personalizado e defini-lo como shapeRef
    shapeRef.current = createSpecificShape(
      selectedShapeRef.current,
      pointer as any
    );

    // se shapeRef não for nulo, adicioná-lo ao canvas
    if (shapeRef.current) {
      // add: http://fabricjs.com/docs/fabric.Canvas.html#add
      canvas.add(shapeRef.current);
    }
  }
};

// lidar com o evento de movimento do mouse no canvas para desenhar formas com diferentes dimensões
export const handleCanvaseMouseMove = ({
  options,
  canvas,
  isDrawing,
  selectedShapeRef,
  shapeRef,
  syncShapeInStorage,
}: CanvasMouseMove) => {
  // se a forma selecionada for livre, retornar
  if (!isDrawing.current) return;
  if (selectedShapeRef.current === "freeform") return;

  canvas.isDrawingMode = false;

  // obter coordenadas do ponteiro
  const pointer = canvas.getPointer(options.e);

  // dependendo da forma selecionada, definir as dimensões da forma armazenada em shapeRef na etapa anterior de handleCanvasMouseDown
  // calcular dimensões da forma com base nas coordenadas do ponteiro
  switch (selectedShapeRef?.current) {
    case "rectangle":
      shapeRef.current?.set({
        width: pointer.x - (shapeRef.current?.left || 0),
        height: pointer.y - (shapeRef.current?.top || 0),
      });
      break;

    case "circle":
      shapeRef.current.set({
        radius: Math.abs(pointer.x - (shapeRef.current?.left || 0)) / 2,
      });
      break;

    case "triangle":
      shapeRef.current?.set({
        width: pointer.x - (shapeRef.current?.left || 0),
        height: pointer.y - (shapeRef.current?.top || 0),
      });
      break;

    case "line":
      shapeRef.current?.set({
        x2: pointer.x,
        y2: pointer.y,
      });
      break;

    case "image":
      shapeRef.current?.set({
        width: pointer.x - (shapeRef.current?.left || 0),
        height: pointer.y - (shapeRef.current?.top || 0),
      });

    default:
      break;
  }

  // renderizar objetos no canvas
  // renderAll: http://fabricjs.com/docs/fabric.Canvas.html#renderAll
  canvas.renderAll();

  // sincronizar forma no armazenamento
  if (shapeRef.current?.objectId) {
    syncShapeInStorage(shapeRef.current);
  }
};

// lidar com o evento de soltar o mouse no canvas para parar de desenhar formas
export const handleCanvasMouseUp = ({
  canvas,
  isDrawing,
  shapeRef,
  activeObjectRef,
  selectedShapeRef,
  syncShapeInStorage,
  setActiveElement,
}: CanvasMouseUp) => {
  isDrawing.current = false;
  if (selectedShapeRef.current === "freeform") return;

  // sincronizar forma no armazenamento, pois o desenho foi interrompido
  syncShapeInStorage(shapeRef.current);

  // definir tudo como nulo
  shapeRef.current = null;
  activeObjectRef.current = null;
  selectedShapeRef.current = null;

  // se o canvas não estiver em modo de desenho, definir o elemento ativo como elemento de navegação padrão após 700ms
  if (!canvas.isDrawingMode) {
    setTimeout(() => {
      setActiveElement(defaultNavElement);
    }, 700);
  }
};

// atualizar forma no armazenamento quando o objeto é modificado
export const handleCanvasObjectModified = ({
  options,
  syncShapeInStorage,
}: CanvasObjectModified) => {
  const target = options.target;
  if (!target) return;

  if (target?.type == "activeSelection") {
    // corrigir isso
  } else {
    syncShapeInStorage(target);
  }
};


// atualizar forma no armazenamento quando o caminho é criado no modo livre
export const handlePathCreated = ({
  options,
  syncShapeInStorage,
}: CanvasPathCreated) => {
  // obter objeto de caminho
  const path = options.path;
  if (!path) return;

  // definir ID único para o objeto de caminho
  path.set({
    objectId: uuid4(),
  });

  // sincronizar forma no armazenamento
  syncShapeInStorage(path);
};

// verificar como o objeto está se movendo no canvas e restringir aos limites do canvas
export const handleCanvasObjectMoving = ({
  options,
}: {
  options: fabric.IEvent;
}) => {
  // obter objeto alvo que está se movendo
  const target = options.target as fabric.Object;

  // target.canvas é o canvas no qual o objeto está se movendo
  const canvas = target.canvas as fabric.Canvas;

  // definir coordenadas do objeto alvo
  target.setCoords();

  // restringir objeto aos limites horizontais do canvas
  if (target && target.left) {
    target.left = Math.max(
      0,
      Math.min(
        target.left,
        (canvas.width || 0) - (target.getScaledWidth() || target.width || 0)
      )
    );
  }

  // restringir objeto aos limites verticais do canvas
  if (target && target.top) {
    target.top = Math.max(
      0,
      Math.min(
        target.top,
        (canvas.height || 0) - (target.getScaledHeight() || target.height || 0)
      )
    );
  }
};

// definir atributos do elemento quando o elemento é selecionado
export const handleCanvasSelectionCreated = ({
  options,
  isEditingRef,
  setElementAttributes,
}: CanvasSelectionCreated) => {
  // se o usuário estiver editando manualmente, retornar
  if (isEditingRef.current) return;

  // se nenhum elemento estiver selecionado, retornar
  if (!options?.selected) return;

  // obter o elemento selecionado
  const selectedElement = options?.selected[0] as fabric.Object;

  // se apenas um elemento estiver selecionado, definir atributos do elemento
  if (selectedElement && options.selected.length === 1) {
    // calcular dimensões escaladas do objeto
    const scaledWidth = selectedElement?.scaleX
      ? selectedElement?.width! * selectedElement?.scaleX
      : selectedElement?.width;

    const scaledHeight = selectedElement?.scaleY
      ? selectedElement?.height! * selectedElement?.scaleY
      : selectedElement?.height;

    setElementAttributes({
      width: scaledWidth?.toFixed(0).toString() || "",
      height: scaledHeight?.toFixed(0).toString() || "",
      fill: selectedElement?.fill?.toString() || "",
      stroke: selectedElement?.stroke || "",
      // @ts-ignore
      fontSize: selectedElement?.fontSize || "",
      // @ts-ignore
      fontFamily: selectedElement?.fontFamily || "",
      // @ts-ignore
      fontWeight: selectedElement?.fontWeight || "",
    });
  }
};

// atualizar atributos do elemento quando o elemento é redimensionado
export const handleCanvasObjectScaling = ({
  options,
  setElementAttributes,
}: CanvasObjectScaling) => {
  const selectedElement = options.target;

  // calcular dimensões escaladas do objeto
  const scaledWidth = selectedElement?.scaleX
    ? selectedElement?.width! * selectedElement?.scaleX
    : selectedElement?.width;

  const scaledHeight = selectedElement?.scaleY
    ? selectedElement?.height! * selectedElement?.scaleY
    : selectedElement?.height;

  setElementAttributes((prev) => ({
    ...prev,
    width: scaledWidth?.toFixed(0).toString() || "",
    height: scaledHeight?.toFixed(0).toString() || "",
  }));
};

// renderizar objetos do canvas vindos do armazenamento no canvas
export const renderCanvas = ({
  fabricRef,
  canvasObjects,
  activeObjectRef,
}: RenderCanvas) => {
  // limpar canvas
  fabricRef.current?.clear();

  // renderizar todos os objetos no canvas
  Array.from(canvasObjects, ([objectId, objectData]) => {
    /**
     * enlivenObjects() é usado para renderizar objetos no canvas.
     * Leva dois argumentos:
     * 1. objectData: dados do objeto para renderizar no canvas
     * 2. callback: função de retorno a ser executada após renderizar objetos
     * no canvas
     *
     * enlivenObjects: http://fabricjs.com/docs/fabric.util.html#.enlivenObjectEnlivables
     */
    fabric.util.enlivenObjects(
      [objectData],
      (enlivenedObjects: fabric.Object[]) => {
        enlivenedObjects.forEach((enlivenedObj) => {
          // se o elemento estiver ativo, mantê-lo no estado ativo para que possa ser editado posteriormente
          if (activeObjectRef.current?.objectId === objectId) {
            fabricRef.current?.setActiveObject(enlivenedObj);
          }

          // adicionar objeto ao canvas
          fabricRef.current?.add(enlivenedObj);
        });
      },
      /**
       * especificar o namespace do objeto para o fabric renderizá-lo no canvas
       * Um namespace é uma string usada para identificar o tipo de
       * objeto.
       *
       * Fabric Namespace: http://fabricjs.com/docs/fabric.html
       */
      "fabric"
    );
  });

  fabricRef.current?.renderAll();
};

// redimensionar dimensões do canvas no redimensionamento da janela
export const handleResize = ({ canvas }: { canvas: fabric.Canvas | null }) => {
  const canvasElement = document.getElementById("canvas");
  if (!canvasElement) return;

  if (!canvas) return;

  canvas.setDimensions({
    width: canvasElement.clientWidth,
    height: canvasElement.clientHeight,
  });
};

// dar zoom no canvas com rolagem do mouse
export const handleCanvasZoom = ({
  options,
  canvas,
}: {
  options: fabric.IEvent & { e: WheelEvent };
  canvas: fabric.Canvas;
}) => {
  const delta = options.e?.deltaY;
  let zoom = canvas.getZoom();

  // permitir zoom mínimo de 20% e máximo de 100%
  const minZoom = 0.2;
  const maxZoom = 1;
  const zoomStep = 0.001;

  // calcular zoom com base na roda de rolagem do mouse com zoom mínimo e máximo
  zoom = Math.min(Math.max(minZoom, zoom + delta * zoomStep), maxZoom);

  // definir zoom para o canvas
  // zoomToPoint: http://fabricjs.com/docs/fabric.Canvas.html#zoomToPoint
  canvas.zoomToPoint({ x: options.e.offsetX, y: options.e.offsetY }, zoom);

  options.e.preventDefault();
  options.e.stopPropagation();
};
