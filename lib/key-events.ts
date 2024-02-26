import { fabric } from "fabric";
import { v4 as uuidv4 } from "uuid";

import { CustomFabricObject } from "@/types/type";

export const handleCopy = (canvas: fabric.Canvas) => {
  const activeObjects = canvas.getActiveObjects();
  if (activeObjects.length > 0) {
    // Serializar os objetos selecionados
    const serializedObjects = activeObjects.map((obj) => obj.toObject());
    // Armazenar os objetos serializados na área de transferência
    localStorage.setItem("clipboard", JSON.stringify(serializedObjects));
  }

  return activeObjects;
};

export const handlePaste = (
  canvas: fabric.Canvas,
  syncShapeInStorage: (shape: fabric.Object) => void
) => {
  if (!canvas || !(canvas instanceof fabric.Canvas)) {
    console.error("Objeto de canvas inválido. Abortando a operação de colar.");
    return;
  }

  // Recuperar objetos serializados da área de transferência
  const clipboardData = localStorage.getItem("clipboard");

  if (clipboardData) {
    try {
      const parsedObjects = JSON.parse(clipboardData);
      parsedObjects.forEach((objData: fabric.Object) => {
        // converter os objetos JavaScript simples recuperados do localStorage em objetos fabricjs (desserialização)
        fabric.util.enlivenObjects(
          [objData],
          (enlivenedObjects: fabric.Object[]) => {
            enlivenedObjects.forEach((enlivenedObj) => {
              // Deslocar os objetos colados para evitar sobreposição com objetos existentes
              enlivenedObj.set({
                left: enlivenedObj.left || 0 + 20,
                top: enlivenedObj.top || 0 + 20,
                objectId: uuidv4(),
                fill: enlivenedObj.fill,
              } as CustomFabricObject<any>);

              canvas.add(enlivenedObj);

              //syncShapeInStorage(enlivenedObj);
            });
            canvas.renderAll();
          },
          "fabric"
        );
      });
    } catch (error) {
      console.error("Erro ao analisar dados da área de transferência:", error);
    }
  }
};

export const handleDelete = (
  canvas: fabric.Canvas,
  deleteShapeFromStorage: (id: string) => void
) => {
  const activeObjects = canvas.getActiveObjects();
  if (!activeObjects || activeObjects.length === 0) return;

  if (activeObjects.length > 0) {
    activeObjects.forEach((obj: CustomFabricObject<any>) => {
      if (!obj.objectId) return;
      canvas.remove(obj);
      deleteShapeFromStorage(obj.objectId);
    });
  }

  canvas.discardActiveObject();
  canvas.requestRenderAll();
};

export const handleClone = (
  canvas: fabric.Canvas,
  syncShapeInStorage: (shape: fabric.Object) => void
) => {
  const activeObjects = canvas.getActiveObjects();
  
  // Se houver mais de um objeto selecionado, não execute a clonagem
  if (activeObjects.length !== 1) {
    return;
  }

  const activeObject = activeObjects[0];

  activeObject.clone(function (cloned: any) {
    cloned.set({
      left: cloned.left + 20,
      top: cloned.top + 20,
      objectId: uuidv4(),
    } as CustomFabricObject<any>);

    canvas.add(cloned);
    syncShapeInStorage(cloned);
  });

  canvas.renderAll();
};


// criar uma função handleKeyDown que ouve diferentes eventos de tecla pressionada
export const handleKeyDown = ({
  e,
  canvas,
  undo,
  redo,
  syncShapeInStorage,
  deleteShapeFromStorage,
}: {
  e: KeyboardEvent;
  canvas: fabric.Canvas | any;
  undo: () => void;
  redo: () => void;
  syncShapeInStorage: (shape: fabric.Object) => void;
  deleteShapeFromStorage: (id: string) => void;
}) => {
  // Verificar se a tecla pressionada é ctrl/cmd + b (copiar)
  if ((e?.ctrlKey || e?.metaKey) && e.keyCode === 66) {
    handleCopy(canvas);

  // Verificar se a tecla pressionada é ctrl/cmd + c (clonar)
  } else if ((e?.ctrlKey || e?.metaKey) && e.keyCode === 67) {
    handleClone(canvas, syncShapeInStorage);
  }

  // Verificar se a tecla pressionada é ctrl/cmd + v (colar)
  else if ((e?.ctrlKey || e?.metaKey) && e.keyCode === 86) {
    handlePaste(canvas, syncShapeInStorage);
  }

  // Verificar se a tecla pressionada é delete (excluir)
  else if ( e.keyCode === 46) {
    handleDelete(canvas, deleteShapeFromStorage);
  }

  // Verificar se a tecla pressionada é ctrl/cmd + x (cortar)
  else if ((e?.ctrlKey || e?.metaKey) && e.keyCode === 88) {
    handleCopy(canvas);
    handleDelete(canvas, deleteShapeFromStorage);
  }

  // Verificar se a tecla pressionada é ctrl/cmd + z (desfazer)
  else if ((e?.ctrlKey || e?.metaKey) && e.keyCode === 90) {
    undo();
  }

  // Verificar se a tecla pressionada é ctrl/cmd + y (refazer)
  else if ((e?.ctrlKey || e?.metaKey) && e.keyCode === 89) {
    redo();
  }

  if (e.keyCode === 191 && !e.shiftKey) {
    e.preventDefault();
  }
};
