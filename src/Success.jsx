import ButtonBack from "./ButtonBack";
import success from "./assets/images/success.png"

export default function Success(){
  return (
    <div className="flex flex-col items-center gap-[80px] justify-center flex-grow px-[20px]">
      <img alt="success" src={success}/>
      <span className="text-center text-[75px] text-gray-700">Оплата прошла успешно.<br/>Возвращайтесь еще!</span>
      <ButtonBack to="/" title="Вернуться к выбору товаров"/>    
    </div>
  );
}