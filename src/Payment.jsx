import { useEffect, useState } from 'react';
import Click from './assets/images/Click.png'
import Payme from './assets/images/Payme.png'
import Uzum from './assets/images/Uzum.png'
import ButtonBack from './ButtonBack';
import { useLocation, useNavigate } from 'react-router-dom';
// import {QRCodeSVG} from 'qrcode.react';

export default function Payment(){
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state;
  const baseUrl = 'http://localhost:8080/';
  const [qr, setQr] = useState(false);
  const [error, setError] = useState('');

  useEffect(()=>{
    if(!item) return;
    const handle = async ({fetch, repeat, done}) => {
      try{
        const response = await fetch;
        const result = JSON.parse(await response.text());
        console.log(repeat.name+':', result);
        switch(result.status){
          case 'processing': await new Promise(resolve=>setTimeout(resolve,1000)); repeat(); break;
          case 'done': done(); break;
          default: throw new Error(result.error);
        }
      }
      catch(error){
        console.error(error);
        setError(error.message);
      }
    };

    const checkItem = async () => {
      handle({
        fetch: fetch(baseUrl + 'select-item', {
          method: 'post',
          body: JSON.stringify({...item, src: undefined, count: 1, name: item.name.replaceAll('\n',' ')}),
          // headers: {
          //   'Content-Type': 'application/json;charset=utf-8'
          // }
        }),
        repeat: checkItem,
        done: getLinks,
      });
    };
    const getLinks = async () => {
      handle({
        fetch: fetch(baseUrl + `payment-links?key=${item.key}`, {
          method: 'get'
        }),
        repeat: getLinks,
        done: () => {
          setQr(true);
          // TODO: set QRs using links
          checkPayment(); 
        }
      });
    };
    const checkPayment = async () => {
      handle({
        fetch: fetch(baseUrl + `payment-status?key=${item.key}`, {
          method: 'get'
        }),
        repeat: checkPayment,
        done: () => {
          navigate('/success');
        }
      });
    };
    checkItem();
  }, [item]);
  
  if(!item) return <h1 className="text-red-600 text-4xl">Item not specified</h1>;

  return (
    <div className="flex flex-col gap-[100px] justify-start items-center px-[20px]">
      {/* Error */}
      {error && <span className="text-center text-[75px] text-red-700">Ошибка: {error}</span>}
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
            ">{item.key}</span>
          </div>
          {/* Back */}
          <ButtonBack title="Вернуться назад"/>
        </div>
      </div>
      {/* QR-codes */}
      <span className="text-center text-[75px]">Оплатите товар через:</span>
      <div className={`mx-[210px] flex flex-row justify-center gap-[140px] ${qr ? '' : 'blur-sm'}`}>
        <img alt="Click" src={Click}/>
        <img alt="Payme" src={Payme}/>
        <img alt="Uzum" src={Uzum}/>
      </div>
    </div>
  );
}