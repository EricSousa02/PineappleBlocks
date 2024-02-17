"use client";

import { useMemo } from "react";

import { generateRandomName } from "@/lib/utils";
import { useOthers, useSelf } from "@/liveblocks.config";

import Avatar from "./Avatar";

const ActiveUsers = () => {
  /**
   * useOthers retorna a lista de outros usuários na sala.
   *
   * useOthers: https://liveblocks.io/docs/api-reference/liveblocks-react#useOthers
   */
  const others = useOthers();

  /**
   * useSelf retorna os detalhes do usuário atual na sala
   *
   * useSelf: https://liveblocks.io/docs/api-reference/liveblocks-react#useSelf
   */
  const currentUser = useSelf();

  // memorizamos o resultado dessa função para que ele não seja alterado a cada renderização, mas apenas quando houver novos usuários entrando na sala
  const memoizedUsers = useMemo(() => {
    const hasMoreUsers = others.length > 2;

    return (
      <div className='flex items-center justify-center gap-1 '>
        {currentUser && (
          <Avatar
            name='você'
            otherStyles='border-[3px] border-primary-yellow'
          />
        )}

        {others.slice(0, 2).map(({ connectionId }) => (
          <Avatar
            key={connectionId}
            name={generateRandomName()}
            otherStyles='-ml-3'
          />
        ))}

        {hasMoreUsers && (
          <div className='z-10 -ml-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary-black'>
            +{others.length - 2}
          </div>
        )}
      </div>
    );
  }, [others.length]);

  return memoizedUsers;
};

export default ActiveUsers;
