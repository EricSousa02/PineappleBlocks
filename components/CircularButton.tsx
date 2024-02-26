import React, { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CircularButtonProps {
  onButtonClick: (buttonKey: string) => void;
}

const CircularButton: React.FC<CircularButtonProps> = ({ onButtonClick }) => {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  return (
    <div className='absolute max-lg:left-2 max-lg:top-2 lg:bottom-20 lg:right-3'>
      <div className='buttons'>
        <Button
          className={`main-button active:scale-90 ${active ? "rotate-45" : ""}`}
          onClick={handleClick}
        >
          <Image src='/assets/plus.svg' width='30' height='30' alt='chat' />
        </Button>

        <Button
          className={`${active ? "translate-x-0 max-lg:translate-y-[70px] lg:-translate-y-[70px]" : ""} button hover:bg-[#ff4500] max-lg:hidden`}
          onClick={() => onButtonClick("Reactions")}
          style={{
            transitionDelay: "0.2s, 0s, 0.2s",
          }}
        >
          <Image src='/assets/emoji.svg' width='30' height='30' alt='chat' />
        </Button>
        <Button
          className={`${active ? "max-lg:translate-x-[47px] max-lg:translate-y-[47px] lg:-translate-x-[47px] lg:-translate-y-[47px]" : ""} button hover:bg-[#0093ff] max-lg:hidden`}
          onClick={() => onButtonClick("Chat")}
          style={{
            transitionDelay: "0.3s, 0s, 0.3s",
          }}
        >
          <Image
            src='/assets/message.svg'
            width='30'
            height='30'
            alt='mensagem'
          />
        </Button>

        <Button
          className={`${active ? "max-lg:translate-x-[0px] max-lg:translate-y-[150px] lg:-translate-x-[47px] lg:-translate-y-[47px] " : ""} button hover:bg-[#0093ff] lg:hidden`}
          onClick={() => onButtonClick("Redo")}
          style={{
            transitionDelay: "0.2s, 0s, 0.2s",
          }}
        >
          <Image src='/assets/redo.svg' width='30' height='30' alt='refazer' />
        </Button>

        <Button
          className={`${active ? "max-lg:translate-x-[0px] max-lg:translate-y-[100px] lg:-translate-x-[70px]" : ""} button hover:bg-[#4CAF50] lg:hidden`}
          onClick={() => onButtonClick("Undo")}
          style={{
            transitionDelay: "0.3s, 0s, 0.3s",
          }}
        >
          <Image src='/assets/undo.svg' width='30' height='30' alt='desfazer' />
        </Button>

        <Dialog>
          <DialogTrigger
            className={`${active ? "max-lg:translate-x-[0px] max-lg:translate-y-[50px] lg:-translate-x-[70px]" : ""} button hover:bg-[#8A2BE2]`}
            style={{
              transitionDelay: "0.4s, 0s, 0.4s",
            }}
          >
            <Image
              src='/assets/question.svg'
              width='30'
              height='30'
              alt='ajuda'
            />
          </DialogTrigger>
          <DialogContent className='border-none bg-primary-black text-primary-grey-300 overflow-y-auto h-[85%] max-lg:h-full'>
            <DialogHeader>
              <DialogTitle>Quer uma ajuda?</DialogTitle>
              <DialogDescription>

              <div className='hidden max-lg:flex mt-4 bg-primary-grey-100 right-0 w-full flex-col border-b border-primary-grey-200 px-5 py-3 align-middle rounded-md'>
                  <span className='text-xs text-primary-grey-300 text-start'>
                    <span className="text-red-600">algumas funções só estão disponiveis utilizando mouse,
                     então recomendamos que use esta aplicação em seu Desktop.</span>
                  </span>
                </div>

                <div className='right-0 flex w-full flex-col justify-between border-b border-primary-grey-200 px-5 py-3 align-middle'>
                  <div className='flex w-full justify-between align-middle'>
                    <h3 className=' pt-4 text-xs uppercase'>Imagens</h3>
                  </div>

                  <span className='mt-3 text-red-600 text-xs text-start'>
                    selecione apenas imagens com qualidade regular, imagens muito pesadas podém acarretar erro de carregamento
                     se acontecer algum apenas aperte F5 e atualize a aplicação. 
                  </span>
                </div>

                <div className='right-0 flex w-full flex-col justify-between border-b border-primary-grey-200 px-5 py-3 align-middle'>
                  <div className='flex w-full justify-between align-middle'>
                    <h3 className=' pt-4 text-xs uppercase'>Clonar</h3>
                  </div>

                  <span className='mt-3  text-xs text-primary-grey-300 text-start'>
                    aperte CRTL + C enquanto estiver selecionado um objeto para clonar/copiar 
                    <span className="text-red-600"> não é possivel clonar mais de uma peça ao mesmo tempo ainda.</span>
                  </span>
                </div>

                <div className='right-0 flex w-full flex-col justify-between border-b border-primary-grey-200 px-5 py-3 align-middle'>
                  <div className='flex w-full justify-between align-middle'>
                    <h3 className=' pt-4 text-xs uppercase'>Deletar</h3>
                  </div>

                  <span className='mt-3  text-xs text-primary-grey-300 text-start'>
                    aperte o botão BACKSPACE ou DELETE para deletar um objeto selecionado.
                  </span>
                </div>

                <div className='right-0 flex w-full flex-col justify-between border-b border-primary-grey-200 px-5 py-3 align-middle'>
                  <div className='flex w-full justify-between align-middle'>
                    <h3 className=' pt-4 text-xs uppercase'>Desfazer</h3>
                  </div>

                  <span className='mt-3  text-xs text-primary-grey-300 text-start'>
                    aperte CRTL + Z para desfazer sua ultima ação.
                  </span>
                </div>

                <div className='right-0 flex w-full flex-col justify-between border-b border-primary-grey-200 px-5 py-3 align-middle'>
                  <div className='flex w-full justify-between align-middle'>
                    <h3 className=' pt-4 text-xs uppercase'>Refazer</h3>
                  </div>

                  <span className='mt-3  text-xs text-primary-grey-300 text-start '>
                   aperte CRTL + Y para refazer sua ultima ação desfeita.
                  </span>
                </div>

                <div className='right-0 flex w-full flex-col justify-between border-b border-primary-grey-200 px-5 py-3 align-middle'>
                  <div className='flex w-full justify-between align-middle'>
                    <h3 className=' pt-4 text-xs uppercase'>Comentar</h3>
                  </div>

                  <span className='mt-3  text-xs text-primary-grey-300 text-start'>
                   aperte / para chamar um bloco de comentario que seguirá seu mouse.
                  </span>
                </div>

                <div className='right-0 flex w-full flex-col justify-between border-b border-primary-grey-200 px-5 py-3 align-middle'>
                  <div className='flex w-full justify-between align-middle'>
                    <h3 className=' pt-4 text-xs uppercase'>Emojis</h3>
                  </div>

                  <span className='mt-3  text-xs text-primary-grey-300 text-start'>
                   aperte . para chamar uma seleção de emojis que após selecionar
                    você pode segurar o botão direito do mouse na tela e fazer chover o emoji selecionado.
                  </span>
                </div>

                <div className='right-0 flex w-full flex-col justify-between border-b border-primary-grey-200 px-5 py-3 align-middle'>
                  <div className='flex w-full justify-between align-middle'>
                    <h3 className=' pt-4 text-xs uppercase'>Exportar</h3>
                  </div>

                  <span className='mt-3  text-xs text-primary-grey-300 text-start'>
                    o botão ao final da barra lateral direita ira basicamente tirar um
                     print e converter em pdf tudo que estiver na area de edição então
                      você pode dar zoom se quiser fazer seu enquadramento.
                  </span>
                </div>
                
                

              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CircularButton;
