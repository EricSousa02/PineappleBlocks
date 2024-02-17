import React, { useMemo, useRef } from "react";

import { RightSidebarProps } from "@/types/type";
import { bringElement, modifyShape } from "@/lib/shapes";

import Text from "./settings/Text";
import Color from "./settings/Color";
import Export from "./settings/Export";
import Dimensions from "./settings/Dimensions";
import ActiveUsers from "./users/ActiveUsers";

const RightSidebar = ({
  elementAttributes,
  setElementAttributes,
  fabricRef,
  activeObjectRef,
  isEditingRef,
  syncShapeInStorage,
  isMobileButtonOpen,
}: RightSidebarProps) => {
  const colorInputRef = useRef(null);
  const strokeInputRef = useRef(null);

  const handleInputChange = (property: string, value: string) => {
    if (!isEditingRef.current) isEditingRef.current = true;

    setElementAttributes((prev) => ({ ...prev, [property]: value }));

    modifyShape({
      canvas: fabricRef.current as fabric.Canvas,
      property,
      value,
      activeObjectRef,
      syncShapeInStorage,
    });
  };

  const classeAnimacao = isMobileButtonOpen
    ? "max-lg:translate-x-0 transition-transform"
    : "max-lg:translate-x-full transition-transform max-lg:hidden";

  
  const memoizedContent = useMemo(
    () => (
      <section
        className={`z-indexBar custom-scrollbar sticky right-0 flex h-full min-w-[227px] select-none flex-col overflow-y-auto border-t border-primary-grey-200 bg-primary-black pb-20 text-primary-grey-300 max-lg:absolute ${classeAnimacao}`}
      >
        <div className='right-0 flex w-full flex-col justify-between border-b border-primary-grey-200 px-5 py-3 align-middle lg:hidden'>
          <div className='flex w-full justify-between align-middle'>
            <h3 className=' pt-4 text-xs uppercase'>Usuários</h3>
            <ActiveUsers />
          </div>

          <span className='mt-3  text-xs text-primary-grey-300'>
            você e os outros que estão online
          </span>
        </div>

        <h3 className=' px-5 pt-4 text-xs uppercase'>Design</h3>
        <span className='mt-3 border-b border-primary-grey-200 px-5 pb-4 text-xs text-primary-grey-300'>
          Faça as alterações que desejar na tela
        </span>

        <Dimensions
          isEditingRef={isEditingRef}
          width={elementAttributes.width}
          height={elementAttributes.height}
          handleInputChange={handleInputChange}
        />

        <Text
          fontFamily={elementAttributes.fontFamily}
          fontSize={elementAttributes.fontSize}
          fontWeight={elementAttributes.fontWeight}
          handleInputChange={handleInputChange}
        />

        <Color
          inputRef={colorInputRef}
          attribute={elementAttributes.fill}
          placeholder='Cor'
          attributeType='fill'
          handleInputChange={handleInputChange}
        />

        <Color
          inputRef={strokeInputRef}
          attribute={elementAttributes.stroke}
          placeholder='Borda'
          attributeType='stroke'
          handleInputChange={handleInputChange}
        />

        <Export />
      </section>
    ),
    [elementAttributes, isMobileButtonOpen]
  ); // só será renderizado novamente quando elementAttributes for alterado

  return memoizedContent;
};

export default RightSidebar;
