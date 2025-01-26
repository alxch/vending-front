import { useContext, useEffect, useState } from 'react';
import Click from './assets/images/click.png'
import Payme from './assets/images/payme.png'
import Uzum from './assets/images/uzum.png'
import ButtonBack from './ButtonBack';
import { useLocation, useNavigate } from 'react-router-dom';
import {QRCodeSVG} from 'qrcode.react';
import { ThemeContext } from './Theme';
const logo = {
  payme: Payme,
  click: Click,
  uzum: Uzum
};

export default function Payment(){
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [item, setItem] = useState({...location.state, available: false});
  const baseUrl = 'http://localhost:3001/api/';
  const [payment, setPayment] = useState({
    payme:{link:'',status:false},
    click:{link:'',status:false},
    uzum: {link:'',status:false}
  });
  const [error, setError] = useState('');
  
  useEffect(()=>{
    if(!item) return;
    
    const controller = new AbortController();
    const handle = async ({fetch, repeat, done}) => {
      try{
        const response = await fetch;
        const result = JSON.parse(await response.text());
        console.log(repeat.name+':', result);
        switch(result.status){
          case 'processing': 
            try{
              await new Promise((resolve)=>{
                setTimeout(resolve,1000);
              });
              repeat(result);
            } catch {}; 
          break;
          case 'done': done(result); break;
          default: throw new Error(result.error);
        }
      }
      catch(error){
        console.error(error.message);
        setError(error.message);
      }
    };
    
    // 1.
    const selectItem = async () => {
      handle({
        fetch: fetch(baseUrl + 'select-item', {
          method: 'post',
          body: JSON.stringify({...item, src: undefined, count: 1, name: item.name.replaceAll('\n',' ')}),
          signal: controller.signal
        }),
        repeat: selectItem,
        done: (result) => {
          setItem({...item, available: true});
          getLinks();
        },
      });
    };
    // 2.
    const getLinks = async () => {
      handle({
        fetch: fetch(baseUrl + `payment-links?key=${item.key}`, {
          method: 'get',
          signal: controller.signal
        }),
        repeat: getLinks,
        done: (result) => {
          payment.payme.link = result.payme;
          payment.click.link = result.click;
          payment.uzum.link = result.uzum;
          setPayment({...payment});
          checkPayment(); 
        }
      });
    };
    // 3.
    const checkPayment = async () => {
      handle({
        fetch: fetch(baseUrl + `payment-status?key=${item.key}`, {
          method: 'get',
          signal: controller.signal
        }),
        repeat: checkPayment,
        done: (result) => {
          payment[result.method].status = true;
          setPayment({...payment});
          setTimeout(()=>{
            // navigate('/success');
          }, 3000);
        }
      });
    };

    // start
    // checkItem();

    return ()=>{
      if(controller) controller.abort();
      fetch(baseUrl + 'cancel', {method: 'post', body: JSON.stringify({key:item.key})});
    }
    // eslint-disable-next-line
  }, []); 
  
  if(!item) return <h1 className="text-red-600 text-4xl">Item not specified</h1>;

  return (
    <div className="flex flex-col gap-[100px] justify-start items-center px-[20px]">
      {/* Error */}
      {error && <span className="text-center text-[75px] text-red-700">Ошибка: {error}</span>}
      {/* Item */}
      <div className="flex flex-row justify-center items-center relative">
        {/* Left */}
        <img className={`relative top-[10px] scale-[115%] mr-[80px] ${item.available ? '' : 'blur-sm'}`} alt="" src={item.src}/>
        {/* Right */}
        <div className="flex flex-col items-center justify-center gap-[38px]">
          {/* Name */}
          <span className={`${theme==='dark'?'text-white':'text-black'} text-[70px] font-medium mb-[-5px] ${item.available ? '' : 'blur-sm'}`}>{item.name}</span>
          {/* Price */}
          <div className="relative px-[62px] py-[42px]
            bg-[var(--price-color)] rounded-full text-white font-bold
          ">
            <span className={`text-[72px] ${item.available ? '' : 'blur-sm'}`}>{item.price} UZS</span>
            {/* Key */}
            <span className={`absolute left-[calc(100%-65px)] top-[-25px] 
              rounded-full text-[42px] bg-black px-[40px] py-[20px]
              ${theme==='dark'?'bg-white text-black':'bg-black text-white'}
            `}>{item.key}</span>
          </div>
          {/* Back */}
          <ButtonBack title="Вернуться назад"/>
        </div>
      </div>
      {/* QR-codes */}
      <span className="text-center text-[75px] text-gray-700">Оплатите товар через:</span>
      <div className={`flex flex-row justify-between items-end w-full`}>
        {['payme','click','uzum'].map(item=>(
          <div key={item} className={`flex flex-col justify-between items-center gap-[15px] ${payment[item].link?'':'blur-sm'}`}>
            <img alt={item} src={logo[item]}/>
            <QRCodeSVG level="Q" size="210" value={payment[item].link} bgColor={payment[item].status ? 'lime':'white'}/>
          </div>
        ))}
      </div>
    </div>
  );
}