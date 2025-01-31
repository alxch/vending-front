import { Link } from 'react-router-dom';
import { useState, useEffect, useContext, useRef } from 'react';
import Item from './Item';
import { ThemeContext } from './Theme';
import Keyboard from './Keyboard';

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
  const { theme } = useContext(ThemeContext);
  const isAdmin = props.isAdmin;
  const [mode, setMode] = useState(isAdmin ? "edit" : "view");
  const [items, setItems] = useState(JSON.parse(localStorage.getItem('vm-items')||JSON.stringify(StaticItems)));

  useEffect(()=>{
    localStorage.setItem('vm-items', JSON.stringify(items));
  }, [items]);

  const changeMode = (e) => {
    setMode(e.target.value);
    setInput(null);
  }

  const [input,setInput] = useState();
  const [position,setPosition] = useState({});
  const click = el => {
    if(!['textarea','input'].includes(el.target.nodeName.toLowerCase()) || ['file', 'radio'].includes(el.target.type)){
      setInput(null);
    }
    else {
      setInput({id:el.target.id,value:el.target.value});
      setTimeout(()=>{
        const keyboard = document.getElementById('keyboard');
        const dy = 40, y = el.pageY, h = keyboard.clientHeight;
        const dx = 40, x = el.pageX, w = keyboard.clientWidth;
        const body = document.body;
        setPosition({
          left: x+w/2 >= body.clientWidth ? body.clientWidth - w - dx : (x-w/2 <= 0 ? dx : x-w/2),
          top:  y+h+dy >= body.clientHeight ? y-h-dy : y+dy 
        });
      },1);
    }
  }
  const keyDown = el => {
    if(el.key === "Escape") setInput(null);
  };

  const [itemModifier, setItemModifier] = useState(null);
  const changeInput = (value)=>{
    const [field, idx] = input.id.split('-');
    setItemModifier({
      idx, [field]: value
    });
  };
  
  const changeKeyboard = (id, value)=>{
    setInput({id,value});
  };

  return (<>
    {/* Controls */}
    {isAdmin && 
      <div className={`${theme === "dark" ? "bg-black text-white" : "bg-white text-black"} 
        flex flex-col gap-2 text-[26px] mb-[50px] p-[15px] border border-dashed border-gray-500 rounded`}>
        Display mode: 
        <label>
          <input type='radio' value="edit" name="mode" checked={mode==="edit"} onChange={changeMode} className='scale-[1.5] -translate-y-[2px] mr-2'/>
          <span>edit</span>
        </label>
        <label>
          <input type='radio' value="view" name="mode" checked={mode==="view"} onChange={changeMode} className='scale-[1.5] -translate-y-[2px] mr-2'/>
          <span>view</span>
        </label>
      </div>
    }
    {/* Wrap */}
    <div onKeyDown={keyDown} onClick={click} className='rounded flex flex-wrap gap-[60px] justify-center items-stretch p-[20px]' style={
      isAdmin && mode === 'view' ? (theme === "dark" ? {
        background: 'repeating-linear-gradient(45deg, #111, #111 10px, #000 10px, #000 20px'
      } : {
        background: 'repeating-linear-gradient(45deg, #ddd, #ddd 10px, #fff 10px, #fff 20px'
      }) : {}
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
          }} itemModifier={itemModifier} onChange={changeKeyboard} />
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
          }} itemModifier={itemModifier} onChange={changeKeyboard} />
        </div>
      }
    </div>
    {/* Keyboard */}
    <div id="keyboard" style={position} 
      className={`transition-all z-50 min-w-[600px] ${input ? 'absolute':'hidden'}`}
    >
      <Keyboard theme={theme} input={input} onChange={changeInput} onClose={()=>setInput(null)}/>
    </div>
  </>);
}

export default Items;