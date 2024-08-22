import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Menu(){
  const location = useLocation();
  const path = location.pathname.slice(1);
  const payment = ['success','payment'].includes(path);
  const success = path == 'success';
  return (
    <div className="mx-[10px] my-[85px] px-[36px] py-[25px] font-medium
      border-[4px] border-[var(--menu-color-active)] rounded-full  
      flex items-center gap-[33px] text-[24px] text-[var(--menu-color-active)]
    ">
      <span>Выберите товар</span><span className="">⟶</span>
      <span className={`text-[var(--menu-color${payment ? '-active' : ''})]`}>Произведите оплату</span>
      <span className={`text-[var(--menu-color${payment ? '-active' : ''})]`}>⟶</span>
      <span className={`text-[var(--menu-color${success ? '-active' : ''})]`}>Наслаждайтесь</span>
    </div>
  );
}
