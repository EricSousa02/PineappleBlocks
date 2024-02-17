import dynamic from "next/dynamic";

/**
 * desabilita o ssr para evitar problemas de pré-renderização do Next.js
 *
 * estamos fazendo isso porque estamos usando um elemento de canvas que não pode ser pré-renderizado pelo Next.js no servidor
 */
const App = dynamic(() => import("./App"), { ssr: false });

export default App;
