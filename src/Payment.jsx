import { useEffect, useState } from 'react';
import LogoClick from './assets/images/click.png'
import LogoPayme from './assets/images/payme.png'
import LogoUzum from './assets/images/uzum.png'
import LogoCash from './assets/images/cash.png'
import ButtonBack from './ButtonBack';
import { useLocation, useNavigate } from 'react-router-dom';
import {QRCodeSVG} from 'qrcode.react';
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
  const [item/* , setItem */] = useState(location.state);
  const [paymentDetails, setPaymentDetails] = useState({
    cash:{amount:'',status:false},
    payme:{link:'',status:false}
  });
  const [paymentMethod, setPaymentMethod] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState('');

  useEffect(()=>{
    if(!item) return;

    // 1. select item
    const selectItem = async()=>{
      // setLoading('Selecting item');
      request.setError = setError;
      request.setLoading = setLoading;
      request({
        params: {
          url: 'select-item',
          method: 'post',
          body: JSON.stringify(item),
        },
        done: getPaymentDetails
      });
    };

    // 2. get payment details
    const getPaymentDetails = async() => {
      request({
        params: { 
          url: 'payment-details', 
          method: 'get'
        },
        repeat: result => {
          setPaymentMethod(result.paymentMethod);
          setPaymentDetails(result.paymentDetails);
          return getPaymentDetails;
        },
        done: result => {
          setPaymentDetails(result.paymentDetails);
          checkItemDelivery();
        }
      });
    };

    // 3. check item delivery
    const checkItemDelivery = () => {
      setLoading('Getting item delivery');
      request({
        params: {
          url: 'item-delivery', 
          method: 'get'
        },
        repeat: ()=>checkItemDelivery,
        done: result => {
          navigate('/success');
        }
      }); 
    };

    selectItem();
    return ()=>{
      request.stop();
    }
  }, [item,navigate]);

  const selectPaymentMethod = async (paymentMethod) => {
    setLoading('Selecting payment method');
    request({
      params: {
        url: 'select-payment-method', 
        method: 'post',
        body: JSON.stringify({paymentMethod}),
      },
      done: result => {
        setPaymentMethod(result.paymentMethod);
        setPaymentDetails(result.paymentDetails);
      }
    });
  };
  
  if(!item) return <h1 className="text-red-600 text-4xl">Item not specified</h1>;

  return (
    <div className={`flex flex-col gap-[80px] justify-start items-center px-[20px] relative`}>
      {/* Overlay */}
      <div className={`${loading ? 'block' : 'hidden'} absolute w-full h-full z-10 bg-white opacity-80 flex justify-center items-center`}>
        <span className='text-[30px]'>{loading}...</span>
      </div>
      {/* Error */}
      {error && <span className="text-center text-[75px] text-red-700">{error}</span>}
      
      {/* Item */}
      <div className="flex flex-row justify-center items-center relative">
        {/* Left */}
        <img className={`relative top-[10px] scale-[115%] mr-[80px]`} alt="" src={item.src}/>
        {/* Right */}
        <div className="flex flex-col items-center justify-center gap-[38px]">
          {/* Name */}
          <span className={`text-[70px] font-medium mb-[-5px]`}>{item.name}</span>
          {/* Price */}
          <div className="relative px-[62px] py-[42px]
            bg-[var(--price-color)] rounded-full text-white font-bold
          ">
            <span className={`text-[72px]`}>{item.price} UZS</span>
            {/* Key */}
            <span className={`absolute left-[calc(100%-65px)] top-[-25px] 
              rounded-full text-[42px] bg-black px-[40px] py-[20px]
            `}>{item.key}</span>
          </div>
          {/* Back */}
          <ButtonBack title="Вернуться назад"/>
        </div>
      </div>

      {/* Payment methods */}
      <span className="text-center text-[75px] text-gray-700">Выберите способ оплаты:</span>
      <div className={`flex flex-row justify-center gap-10 items-stretch w-full`}>
        {Object.keys(paymentDetails).map(paymentKey=>(
          <div onClick={()=>selectPaymentMethod(paymentKey)} key={paymentKey} className={`flex flex-col justify-between items-center gap-[15px] rounded-lg p-5 ${paymentKey === paymentMethod ? 'border-4' : 'border-0' } text-[28px]`}>
            <img alt={paymentKey} src={Logo[paymentKey]}/>
            {paymentKey === 'cash' ? 
              <span>{paymentDetails[paymentKey].amount !== '' && `${paymentDetails[paymentKey].amount} UZS`}</span> : 
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
