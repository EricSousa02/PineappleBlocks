import { CursorChatProps, CursorMode } from "@/types/type";
import CursorSVG from "@/public/assets/CursorSVG";

const CursorChat = ({ cursor, cursorState, setCursorState, updateMyPresence }: CursorChatProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateMyPresence({ message: e.target.value });
    setCursorState({
      mode: CursorMode.Chat,
      previousMessage: null,
      message: e.target.value,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setCursorState({
        mode: CursorMode.Chat,
        // @ts-ignore
        previousMessage: cursorState.message,
        message: "",
      });
    } else if (e.key === "Escape") {
      setCursorState({
        mode: CursorMode.Hidden,
      });
    }
  };

  return (
    <div
      className="absolute top-0 left-0"
      style={{
        transform: `translateX(${cursor.x}px) translateY(${cursor.y}px)`,
      }}
    >
      {/* Mostrar entrada de mensagem quando o cursor estiver no modo de bate-papo */}
      {cursorState.mode === CursorMode.Chat && (
        <>
          {/* Custom Cursor shape */}
          <CursorSVG color="#000" />

          <div
            className="absolute left-2 top-5 bg-blue-500 px-4 py-2 text-sm leading-relaxed text-white"
            onKeyUp={(e) => e.stopPropagation()}
            style={{
              borderRadius: 20,
            }}
          >
            {/**
             * Se houver uma mensagem anterior, mostre-a acima da entrada
             *
             * Estamos fazendo isso porque, quando o usuário pressiona enter, queremos
             * mostrar a mensagem anterior na parte superior e a entrada na parte inferior
             */}
            {cursorState.previousMessage && <div>{cursorState.previousMessage}</div>}
            <input
              className="z-10 w-60 border-none	bg-transparent text-white placeholder-blue-300 outline-none"
              autoFocus={true}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={cursorState.previousMessage ? "" : "Diga alguma coisa…"}
              value={cursorState.message}
              maxLength={50}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CursorChat;
