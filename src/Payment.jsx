import Click from './assets/images/Click.png'
import Payme from './assets/images/Payme.png'
import Uzum from './assets/images/Uzum.png'
import ButtonBack from './ButtonBack';
import { Link, useLocation } from 'react-router-dom';

export default function Payment(){
  const location = useLocation();
  const item = location.state;
  if(!item) return <h1 className="text-red-600 text-4xl">Item not specified</h1>;

  return (
    <div className="flex flex-col gap-[100px] justify-start items-center px-[20px]">
      {/* Item */}
      <div className="flex flex-row justify-center items-center relative">
        {/* Left */}
        <img className="relative top-[10px] scale-[115%] mr-[80px]" alt="" src={item.src}/>
        {/* Right */}
        <div className="flex flex-col items-center justify-center gap-[38px]">
          <span className="text-[70px] font-medium mb-[-5px]">{item.name}</span>
          {/* Price */}
          <div className="relative px-[62px] py-[42px]
            bg-[var(--price-color)] rounded-full text-white font-bold
          ">
            <span className="text-[72px]">{item.price} UZS</span>
            <span className="absolute left-[calc(100%-65px)] top-[-25px] 
              rounded-full text-[42px] bg-black px-[40px] py-[20px]
            ">{item.count}</span>
          </div>
          {/* Back */}
          <ButtonBack title="Вернуться назад"/>
        </div>
      </div>
      {/* QR-codes */}
      <span className="text-center text-[75px]">Оплатите товар через:</span>
      <div className="mx-[210px] flex flex-row justify-center gap-[140px]">
        <Link to="/success"><img alt="Click" src={Click}/></Link>
        <Link to="/success"><img alt="Payme" src={Payme}/></Link>
        <Link to="/success"><img alt="Uzum" src={Uzum}/></Link>
      </div>
    </div>
  );
}