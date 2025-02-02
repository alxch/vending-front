import { useContext, useEffect, useState } from 'react';
import LogoClick from './assets/images/click.png'
import LogoPayme from './assets/images/payme.png'
import LogoUzum from './assets/images/uzum.png'
import LogoCash from './assets/images/cash.png'
import ButtonBack from './ButtonBack';
import { useLocation, /* useNavigate */ } from 'react-router-dom';
import {QRCodeSVG} from 'qrcode.react';
import { ThemeContext } from './Theme';
import request from './request';

const Logo = {
  cash: LogoCash,
  payme: LogoPayme,
  click: LogoClick,
  uzum: LogoUzum
};

export default function Payment(){
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [item/* , setItem */] = useState(location.state);
  const [paymentDetails, setPaymentDetails] = useState({
    cash:{amount:0,status:false},
    payme:{link:'',status:false},
    // click:{link:'',status:false},
    // uzum: {link:'',status:false},
  });
  const [paymentMethod, setPaymentMethod] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    if(!item) return;

    // select item
    setLoading(true);
    request.setError = setError;
    request.setLoading = setLoading;
    request({
      params: {
        url: 'select-item',
        method: 'post',
        body: JSON.stringify(item),
      },
      done: result =>{
        // get payment details
        const getPaymentDetails = async() => {
          request({
            params: { 
              url: 'payment-details', 
              method: 'get'
            },
            repeat: result => {
              setPaymentDetails(result.paymentDetails);
              getPaymentDetails();
            },
            done: result => {
              setPaymentDetails(result.paymentDetails);
              setTimeout(()=>{
                navigate('/success');
              }, 3000);
            }
          });
        };
        getPaymentDetails();
      }
    });
    return ()=>{
      request.stop();
    }
  }, [item]);

  const selectPaymentMethod = async (paymentMethod) => {
    setLoading(true);
    request({
      params: {
        url: 'select-payment-method', 
        method: 'post',
        body: JSON.stringify({paymentMethod}),
      },
      done: result => {
        setPaymentMethod(paymentMethod);
      }
    });
  };
  
  if(!item) return <h1 className="text-red-600 text-4xl">Item not specified</h1>;

  return (
    <div className={`flex flex-col gap-[80px] justify-start items-center px-[20px] relative`}>
      {/* Overlay */}
      <div className={`${loading ? 'block' : 'hidden'} ${theme == 'dark' ? 'bg-black text-white' : 'bg-white text-black'} absolute w-full h-full z-10 opacity-80 flex justify-center items-center`}>
        <span className='text-[30px]'>Loading...</span>
      </div>
      {/* Error */}
      {error && <span className="text-center text-[75px] text-red-700">Ошибка: {error}</span>}
      
      {/* Item */}
      <div className="flex flex-row justify-center items-center relative">
        {/* Left */}
        <img className={`relative top-[10px] scale-[115%] mr-[80px]`} alt="" src={item.src}/>
        {/* Right */}
        <div className="flex flex-col items-center justify-center gap-[38px]">
          {/* Name */}
          <span className={`${theme==='dark'?'text-white':'text-black'} text-[70px] font-medium mb-[-5px]`}>{item.name}</span>
          {/* Price */}
          <div className="relative px-[62px] py-[42px]
            bg-[var(--price-color)] rounded-full text-white font-bold
          ">
            <span className={`text-[72px]`}>{item.price} UZS</span>
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

      {/* Payment methods */}
      <span className="text-center text-[75px] text-gray-700">Выберете способ оплаты:</span>
      <div className={`flex flex-row justify-center gap-10 items-stretch w-full`}>
        {Object.keys(paymentDetails).map(paymentKey=>(
          <div onClick={()=>selectPaymentMethod(paymentKey)} key={paymentKey} className={`flex flex-col justify-between items-center gap-[15px] rounded-lg p-5 ${theme === "dark" ? 'border-white text-white' : 'border-black text-black'} ${paymentKey === paymentMethod ? 'border-4' : 'border-0' } text-[28px]`}>
            <img alt={paymentKey} src={Logo[paymentKey]}/>
            {paymentKey === 'cash' ? 
              <span>{paymentMethod == 'cash' ? 
                `${paymentDetails[paymentKey].amount} UZS` : ''
              }</span> : 
              <QRCodeSVG level="Q" size="210" value={
                paymentMethod !== 'cash' ? paymentDetails[paymentKey].link : ''
              } />
            }
          </div>
        ))}
      </div>
    </div>
  );
}