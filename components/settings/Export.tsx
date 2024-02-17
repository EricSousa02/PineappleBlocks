import { exportToPdf } from "@/lib/utils";

import { Button } from "../ui/button";

const Export = () => (
  <div className='flex flex-col gap-3 px-5 py-3'>
    <h3 className='text-[10px] uppercase'>Exportar</h3>
    <Button
      variant='outline'
      className='hover:bg-primary-yellow w-full border border-primary-grey-100 hover:text-primary-black'
      onClick={exportToPdf}
    >
      Exportar para PDF
    </Button>
  </div>
);

export default Export;
