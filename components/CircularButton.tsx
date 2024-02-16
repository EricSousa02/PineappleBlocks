import React, { useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";

const CircularButton = () => {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  return (
    <div className='absolute bottom-20 right-3 max-lg:bottom-16'>
      <div className='buttons'>
        <Button
          className={`main-button active:scale-90`}
        >
          <Image
            src='/assets/plus.svg'
            width='30'
            height='30'
            alt='chat'
            onClick={handleClick}
          />
        </Button>

        <Button
          className={`${active ? "-translate-y-[70px] translate-x-0" : ""} reddit-button button hover:bg-[#ff4500]`}
          style={{
            transitionDelay: "0.2s, 0s, 0.2s",

          }}
        >
          <Image src='/assets/emoji.svg' width='30' height='30' alt='chat' />
        </Button>
        <Button
          className={`${active ? "-translate-x-[47px] -translate-y-[47px]" : ""} messenger-button button hover:bg-[#0093ff]`}
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
          className={`${active ? "-translate-x-[70px] translate-y-0" : ""} pinterest-button button hover:bg-[#4CAF50]`}
          style={{
            transitionDelay: "0.4s, 0s, 0.4s",
           
          }}
        >
          <Image src='/assets/back-2.svg' width='30' height='30' alt='voltar' />
        </Button>
      </div>
    </div>
  );
};

export default CircularButton;
