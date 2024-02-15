import Image from "next/image";

const Loader = () => (
  <div className='flex h-screen w-screen flex-col items-center justify-center gap-2'>
    <div className='loader'>
      <div className='loader-square'></div>
      <div className='loader-square'></div>
      <div className='loader-square'></div>
      <div className='loader-square'></div>
      <div className='loader-square'></div>
      <div className='loader-square'></div>
      <div className='loader-square'></div>
    </div>{" "}
    <p className='text-sm font-bold text-primary-grey-300'>Carregando...</p>
  </div>
);

export default Loader;
