import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Item from './Item';

const StaticItems = [
  {
    key: '1.1',
    price: 1000,
    name: 'Coca-Cola\n100ml',
    src: require('./assets/images/item-1.png')
  },
  {
    key: '1.2',
    price: 2000,
    name: 'Coca-Cola\n200ml',
    src: require('./assets/images/item-2.png')
  },
  {
    key: '1.3',
    price: 3000,
    name: 'Coca-Cola\n300ml',
    src: require('./assets/images/item-3.png')
  },
];

function Items(props){
  const isAdmin = props.isAdmin;
  const [mode, setMode] = useState(isAdmin ? "edit" : "view");
  const [items, setItems] = useState(JSON.parse(localStorage.getItem('vm-items')||JSON.stringify(StaticItems)));

  useEffect(()=>{
    localStorage.setItem('vm-items', JSON.stringify(items));
  }, [items]);

  const changeMode = (e) => {
    setMode(e.target.value);
  }

  return (<>
    {/* Controls */}
    {isAdmin && 
      <div className={` 
        flex flex-col gap-2 text-[26px] mb-[50px] p-[15px] border border-dashed rounded
      `}>
        Display mode: 
        <label>
          <input type='radio' value="edit" name="mode" checked={mode==="edit"} onChange={changeMode} className='scale-[1.5] -translate-y-[2px] mr-2 no-keyboard'/>
          <span>edit</span>
        </label>
        <label>
          <input type='radio' value="view" name="mode" checked={mode==="view"} onChange={changeMode} className='scale-[1.5] -translate-y-[2px] mr-2 no-keyboard'/>
          <span>view</span>
        </label>
      </div>
    }
    {/* Wrap */}
    <div className='rounded flex flex-wrap gap-[60px] justify-center items-stretch p-[20px]' style={
      isAdmin && mode === 'view' ? {
        background: 'repeating-linear-gradient(45deg, #ddd, #ddd 10px, #fff 10px, #fff 20px'
      } : {}
    }>
      {/* Items */}
      {items.map((item,idx)=>(isAdmin ? 
        <div key={idx} className='flex flex-col items-center justify-end'>
          <Item idx={idx} mode={mode} item={item} onSave={(saveItem)=>{
            items[idx] = saveItem;
            setItems([...items]);
          }} onRemove={(removeItem)=>{
            if(!window.confirm("Do You really want to delete item " + removeItem.key + "?")) return;
            items.splice(idx,1);
            setItems([...items]);
          }} />
        </div> : /* not admin */
        <Link key={idx} className='flex flex-col items-center justify-end' to='/payment' state={item}>
          <Item idx={idx} item={item} />
        </Link>
      ))}
      {/* New item */}
      {isAdmin && mode === "edit" && 
        <div className='flex flex-col items-center justify-end'>
          <Item idx="_" mode={mode} onAdd={(newItem)=>{
            items.push(newItem);
            setItems([...items]);
          }} />
        </div>
      }
    </div>
  </>);
}

export default Items;