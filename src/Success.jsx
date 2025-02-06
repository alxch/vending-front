import { useLocation } from "react-router-dom";
import ButtonBack from "./ButtonBack";
import success from "./assets/images/success.png"

export default function Success(){
  const location = useLocation();
  return (
    <div className="flex flex-col items-center gap-[30px] justify-center">
      <img alt="success" src={success}/>
      <span className="text-center text-[60px] text-gray-700">Оплата прошла успешно.<br/>Возвращайтесь еще!</span>
      <ButtonBack to="/" title="Вернуться к выбору товаров" state={location.state} />    
    </div>
  );
}