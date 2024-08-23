import { Link } from 'react-router-dom';
import item1 from './assets/images/item-1.png'
import item2 from './assets/images/item-2.png'

function Items(){
  return (
    <div className="flex flex-wrap gap-[60px] justify-center items-stretch px-[100px]">
    {items.map(item=>(
      <Link key={item.id} to="/payment" state={item} className="flex flex-col items-center justify-end">
        <img alt={`item-${item.id}`} src={item.src}/>
        {/* Price */}
        <div className="relative mt-[36px] px-[32px] py-[22px] 
          bg-[var(--price-color)] rounded-full text-white font-bold
        ">
          <span className="text-[36px]">{item.price} UZS</span>
          <span className="absolute left-[calc(100%-35px)] top-[-15px] 
            rounded-full text-[22px] bg-black px-[20px] py-[10px]
          ">{item.id}</span>
        </div>
        {/* Name */}
        <span className="mt-[12px] text-[36px]/[40px] text-center max-w-[170px]">{item.name}</span>
      </Link>
    ))}
    </div>
  );
}

const items = [
  {
    id: 1,
    src: item1,
    price: '6 000',
    name: 'Coca Cola 300 мл'
  },
  {
    id: 2,
    src: item2,
    price: '7 000',
    name: 'Coca Cola 500 мл'
  },
  {
    id: 3,
    src: item1,
    price: '6 000',
    name: 'Coca Cola 300 мл'
  },
  {
    id: 4,
    src: item2,
    price: '7 000',
    name: 'Coca Cola 500 мл'
  },
  {
    id: 5,
    src: item1,
    price: '6 000',
    name: 'Coca Cola 300 мл'
  },
  {
    id: 6,
    src: item2,
    price: '7 000',
    name: 'Coca Cola 500 мл'
  },
  {
    id: 7,
    src: item1,
    price: '6 000',
    name: 'Coca Cola 300 мл'
  },
  {
    id: 8,
    src: item2,
    price: '7 000',
    name: 'Coca Cola 500 мл'
  },
];

export default Items; 