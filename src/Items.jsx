import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Item from './Item';

function Items(props){
  const isAdmin = props.isAdmin;
  const [mode, setMode] = useState(isAdmin ? "edit" : "view");
  const itemsData = JSON.parse(localStorage.getItem('vm-items')||'[]');
  const [items, setItems] = useState(itemsData);

  useEffect(()=>{
    localStorage.setItem('vm-items', JSON.stringify(items));
  },[items]);

  const newItemData = {
    new: true,
    src: '',
    price: '',
    count: '',
    name: ''
  };
  const [newItem, setNewItem] = useState(newItemData);
  const changeMode = (e) => {
    setMode(e.target.value);
  }

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
      {items.map((item, key)=>(isAdmin ? 
        <div key={key} className='flex flex-col items-center justify-end'>
          <Item mode={mode} item={item} onSave={(item)=>{
            // console.log('Save', key, item);
            items[key] = item;
            setItems([...items]);
          }} onRemove={(item)=>{
            // console.log('Remove', key, item);
            if(!window.confirm("Do You really want to delete item " + key + "?")) return;
            items.splice(key,1);
            setItems([...items]);
          }}/>
        </div> : 
        <Link key={key} className='flex flex-col items-center justify-end' to='/payment' state={item}>
          <Item item={item} mode={mode} />
        </Link>
      ))}
      {/* New item */}
      {isAdmin && mode === "edit" && 
        <div className='flex flex-col items-center justify-end'>
          <Item mode={mode} item={newItem} onAdd={(item)=>{
            // console.log('Add', item);
            delete item.new;
            setNewItem(newItemData);
            setItems([...items, item]);
          }} onChange={(newItem)=>{
            // console.log('Change:', newItem);
            // setNewItem(newItem);
          }}/>
        </div>
      }
    </div>
  </>);
}

export default Items;