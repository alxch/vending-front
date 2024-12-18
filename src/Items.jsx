import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Item from './Item';

const StaticItems = [
  {
    key: 1,
    price: 1000,
    name: 'Coca-Cola\n100ml',
    src: require('./assets/images/item-1.png')
  },
  {
    key: 2,
    price: 2000,
    name: 'Coca-Cola\n200ml',
    src: require('./assets/images/item-2.png')
  },
  {
    key: 3,
    price: 3000,
    name: 'Coca-Cola\n300ml',
    src: require('./assets/images/item-3.png')
  },
];

function Items(props){
  const isAdmin = props.isAdmin;
  const [mode, setMode] = useState(isAdmin ? "edit" : "view");
  const [items, setItems] = useState(JSON.parse(localStorage.getItem('vm-items')||JSON.stringify(StaticItems)));
  const newKey = items.reduce((newKey,item)=>newKey <= item.key ? (
    isNaN(Number(item.key)) ? item.key + '2' : String(Number(item.key) + 1)
  ) : newKey, '');

  useEffect(()=>{
    localStorage.setItem('vm-items', JSON.stringify(items));
  }, [items]);

  const changeMode = (e) => {
    setMode(e.target.value);
  }

  const compareFn = (a,b)=>{
    if(a.key>b.key) return 1;
    if(a.key<b.key) return -1;
    return 0;
  };

  return (<>
    {/* Controls */}
    {isAdmin && <div className="flex flex-col gap-2 text-[22px] mb-[50px] p-[10px] border border-dashed border-gray-500 rounded">
      Display mode: 
      <label><input type='radio' value="edit" name="mode" checked={mode==="edit"} onChange={changeMode}/> edit</label>
      <label><input type='radio' value="view" name="mode" checked={mode==="view"} onChange={changeMode}/> view</label>
    </div>}
    <div className='rounded flex flex-wrap gap-[60px] justify-center items-stretch p-[20px]' style={
      isAdmin && mode === 'view' ? {
        background: 'repeating-linear-gradient(45deg, #ddd, #ddd 10px, #fff 10px, #fff 20px'
      } : {}
    }>
      {/* Items */}
      {items.map((item,key)=>(isAdmin ? 
        <div key={key} className='flex flex-col items-center justify-end'>
          <Item mode={mode} item={item} onSave={(saveItem)=>{
            items[key] = saveItem;
            setItems([...items].sort(compareFn));
          }} onRemove={(removeItem)=>{
            if(!window.confirm("Do You really want to delete item " + removeItem.key + "?")) return;
            items.splice(key,1);
            setItems([...items].sort(compareFn));
          }}/>
        </div> : 
        <Link key={key} className='flex flex-col items-center justify-end' to='/payment' state={item}>
          <Item item={item} />
        </Link>
      ))}
      {/* New item */}
      {isAdmin && mode === "edit" && 
        <div className='flex flex-col items-center justify-end'>
          <Item mode={mode} newKey={newKey} onAdd={(newItem)=>{
            items.push(newItem);
            setItems([...items].sort(compareFn));
          }} />
        </div>
      }
    </div>
  </>);
}

export default Items;