import React, { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";

interface CircularButtonProps {
  onButtonClick: (buttonKey: string) => void;
}

const CircularButton: React.FC<CircularButtonProps> = ({ onButtonClick }) => {

  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  return (
    <div className='absolute lg:bottom-20 lg:right-3 max-lg:top-2 max-lg:left-2'>
      <div className='buttons'>
        <Button
          className={`main-button active:scale-90 ${active ? "rotate-45" : ""}`}
          onClick={handleClick}
        >
          <Image
            src='/assets/plus.svg'
            width='30'
            height='30'
            alt='chat'
          />
        </Button>

        <Button
          className={`${active ? "lg:-translate-y-[70px] max-lg:translate-y-[70px] translate-x-0" : ""} max-lg:hidden button hover:bg-[#ff4500]`}
          onClick={() => onButtonClick('Reactions')}
          style={{
            transitionDelay: "0.2s, 0s, 0.2s"
          }}
        >
          <Image src='/assets/emoji.svg' width='30' height='30' alt='chat' />
        </Button>
        <Button
          className={`${active ? "lg:-translate-x-[47px] lg:-translate-y-[47px] max-lg:translate-x-[47px] max-lg:translate-y-[47px]" : ""} max-lg:hidden button hover:bg-[#0093ff]`}
          onClick={() => onButtonClick('Chat')}
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
          className={`${active ? "lg:-translate-x-[47px] lg:-translate-y-[47px] max-lg:translate-x-[0px] max-lg:translate-y-[100px] " : ""} lg:hidden button hover:bg-[#0093ff]`}
          onClick={() => onButtonClick('Redo')}
          style={{
            transitionDelay: "0.3s, 0s, 0.3s",
          }}
        >
          <Image
            src='/assets/redo.svg'
            width='30'
            height='30'
            alt='refazer'
          />
        </Button>

        <Button
          className={`${active ? "lg:-translate-x-[70px] max-lg:translate-x-[0px] max-lg:translate-y-[50px]" : ""} button hover:bg-[#4CAF50]`}
          onClick={() => onButtonClick('Undo')}
          style={{
            transitionDelay: "0.4s, 0s, 0.4s",
           
          }}
        >
          <Image src='/assets/undo.svg' width='30' height='30' alt='desfazer' />
        </Button>
      </div>
    </div>
  );
};

export default CircularButton;
