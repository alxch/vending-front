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

const PaymentMethods = ['cash', 'payme'];

export default function Payment(){
  const location = useLocation();
  const navigate = useNavigate();
  const [item, setItem] = useState(location.state);
  const [payment, setPayment] = useState({
    method: '',
    cash:{amount:'',done:false,error:null},
    payme:{link:'',done:false,error:null}
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState('');
  const [back, setBack] = useState(false);
  
  // 1. select item
  const selectItem = async()=>{
    if(!item) return;
    request({
      onError: setError,
      params: {
        url: 'select-item',
        method: 'post',
        body: JSON.stringify(item),
      },
      done: result => {
        console.log('Item:',result.item);
        setItem(result.item);
        getPaymentDetails();
      }
    });
  };
  request.selectItem = selectItem;

  // 2. get payment details
  const getPaymentDetails = async() => {
    request({
      onError: setError,
      params: {
        url: 'payment-details', 
        method: 'get'
      },
      repeat: request.getPaymentDetailsRepeat,
      done: request.getPaymentDetailsDone
    });
  };
  request.getPaymentDetailsRepeat = result => {
    if(
      payment.cash.amount !== result.payment.cash.amount ||
      payment.payme.link !== result.payment.payme.link
    )
      console.log('Payment:',result.payment.method,result.payment.cash,result.payment.payme);
    setPayment(result.payment);
    return getPaymentDetails;
  };
  // to get actual `back` value
  request.getPaymentDetailsDone = result => {
    const payment = result.payment;
    console.log('Payment:',payment.method,payment.cash,payment.payme);
    setPayment(payment);

    if(back) return;
    deliverItem();
  }; 

  // 3. deliver item
  const deliverItem = () => {
    request({
      onError: error => {
        setError({message:error, overlay:true, action: 
          <span className='underline' onClick={() => {
            // console.log('Reset');
            request({
              onError: setError,
              params: {
                url: 'reset',
                method: 'post'
              },
              done: () => {
                console.log('Reset:');
                navigate('/');
              }
            });
          }}>go back and accept losing Your money</span>
        });
      },
      loading: status=>setLoading(status && 'Delivering item'),
      params: {
        url: 'deliver-item', 
        method: 'post'
      },
      done: result => {
        console.log('Delivery:', result.itemDelivered);
        navigate('/success', {state:{...item, count: item.count-1, sold: (item.sold || 0) + 1}});
      }
    }); 
  };

  // start
  useEffect(()=>{
    // serial port requires permission on each reboot:
    // https://stackoverflow.com/questions/74323297/web-serial-api-not-persisting-port-access
    // 
    // attempt to access serial port:
    // await navigator.serial.requestPort({ filters: [{usbVendorId: 0x1a86}] });
    // const port = (await navigator.serial.getPorts())[0];
    // await port.open({baudRate:9600});
    // const writer = port.writable.getWriter();
    // const reader = port.readable.getReader();
    // await reader.read().then(console.log,console.log);
    // await writer.write(new Uint8Array([0x01,0x02,0x03]));

    request.selectItem();
    return ()=>{
      request.stop();
    }
  }, []);

  // payment method
  const selectPaymentMethod = async (paymentMethod) => {
    if(payment.method === paymentMethod) return;
    if(PaymentMethods.some(paymentMethod=>paymentMethod && payment[paymentMethod].done)) return;

    return request({
      onError: setError,
      loading: status=>setLoading(status && `${paymentMethod === '' ? 'Deselecting' : 'Selecting'} payment method`),
      params: {
        url: 'select-payment-method', 
        method: 'post',
        body: JSON.stringify({paymentMethod}),
      },
      done: result => {
        const payment = result.payment;
        console.log('Payment method:',payment.method/*,payment.cash,payment.payme */);
        setPayment(payment);
      }
    });
  };
  
  // back
  const paymentDone = payment.payme.done || payment.cash.done;
  const goBack = async () => {
    if(paymentDone) return;

    setBack(true);
    await selectPaymentMethod('');
    navigate('/');
  }

  return (!item ? <h1 className="text-red-700 text-4xl">Item not specified</h1> :
    <div className={`flex flex-col gap-[60px] justify-start items-center px-[20px] relative`}>
      {/* Overlay */}
      <div className={`${loading ? 'block' : 'hidden'} absolute w-[110%] h-full z-10 bg-white opacity-90 flex justify-center items-start`}>
        <span className='relative text-[40px] top-[30%]'>{loading}...</span>
      </div>
      {/* Error */}
      {error && (error.overlay ? 
        <div className={`text-[30px] absolute w-[110%] h-full z-10 gap-3 opacity-80 flex flex-col justify-center items-center`}
          style={{background: 'repeating-linear-gradient(45deg, #fdd, #fdd 10px, #fff 10px, #fff 20px)'}}
        >
          <span>{error.message}</span>{error.action}
        </div>
        :
        <span className="text-center text-[75px] text-red-700">{error}</span>
      )}
      
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
          <ButtonBack disabled={paymentDone} onClick={goBack} title="Вернуться назад"/>
        </div>
      </div>

      {/* Payment methods */}
      <span className="text-center text-[60px] text-gray-700">Выберите способ оплаты:</span>
      <div className={`flex flex-row justify-center gap-10 items-stretch w-full`}>
        {PaymentMethods.map(paymentMethod=>(
          <div onClick={()=>selectPaymentMethod(paymentMethod)} key={paymentMethod} className={`
            ${payment[paymentMethod].error ? 'bg-red-700' : (payment[paymentMethod].done ? 'bg-green-700' : '')} 
            flex flex-col justify-between items-center gap-[15px] rounded-lg p-5 ${paymentMethod === payment.method ? 'border-2' : 'border-0' } text-[28px]`}
          >
            <img alt={paymentMethod} src={Logo[paymentMethod]}/>
            {paymentMethod === 'cash' ? <>
                {payment[paymentMethod].error && <span>{payment[paymentMethod].error}</span>}
                {payment[paymentMethod].amount && <span>{`${payment[paymentMethod].amount} UZS`}</span>} 
              </> : <>
                <QRCodeSVG level="Q" size="210" value={payment[paymentMethod].link} />
                <a className='max-w-[200px] break-all' href={payment[paymentMethod].link}>{payment[paymentMethod].link}</a>
              </>
            }
          </div>
        ))}
      </div>
    </div>
  );
}
