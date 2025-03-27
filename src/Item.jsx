import { useState, useEffect, Fragment } from "react";
import { Link } from 'react-router-dom';

export default function Item(props){
  const cell = props.cell;
  const newItemData = {
    new: true,
    src: 'http://localhost:3001/images/unknown.png',
    price: '',
    name: 'Unknown',
    key: `${cell.row}.${cell.col}`,
    count: 1,
    sold: 0,
  };
  const [changed, setChanged] = useState(false);
  const [item, setItem] = useState(props.item || newItemData);
  const mode = props.mode || 'view';
  const idx = props.idx; // useId();
  const isAdmin = props.isAdmin;
  // const onChange = props.onChange || (()=>{});

  useEffect(()=>{
    if(!props.item) 
      setItem(newItemData);
    else
      setItem(props.item);
    // eslint-disable-next-line
  }, [props.item]);

  useEffect(()=>{
    if(!isAdmin) return;
    if(JSON.stringify(item) === JSON.stringify(props.item || newItemData)){
      setChanged(false);
    }
    else {
      setChanged(true);
    }
    // eslint-disable-next-line
  }, [item, props.item]);

  const setFile = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setItem({
          ...item, src: e.target.result
        });
      }
      reader.readAsDataURL(files[0]);
    }
  };
  const setSrc = (e) => {
    const src = e.target.value;
    setItem({...item, src});
    // onChange('src-'+idx, src);
  }
  const setPrice = (e) => {
    const price = Number(e.target.value);
    setItem({...item, price});
    // onChange('price-'+idx, price);
  }
  const setKey = (e) => {
    const key = e.target.value;
    setItem({...item, key});
    // onChange('key-'+idx, key);
  }
  const setName = (e) => {
    const name = e.target.value;
    setItem({...item, name});
    // onChange('name-'+idx, name);
  }
  const setCount = (e) => {
    const count = Number(e.target.value);
    setItem({...item, count});
    // onChange('count-'+idx, count);
  }

  const add = () => {
    if(props.onAdd){
      setItem({...newItemData});
      props.onAdd({...item,new:undefined});
    }
  }
  const save = () => {
    props.onSave && props.onSave({...item});
  }
  const remove = () => {
    props.onRemove && props.onRemove({...item});  
  }
  const reset = () => {
    setItem(props.item || newItemData);
  }
  
  const Wrap = (isAdmin || !item.count || item.new) ? 'div' : Link;

  return <Wrap id={`cell-`+idx} 
    to='/payment'
    state={item}
    className={`
      ${item.new && 'bg-gray-100'}
      ${changed && 'bg-orange-400'}
      ${cell.size === 2 && `col-span-2`}
      ${item.count === 0 && !isAdmin && 'grayscale'}
      rounded-xl p-2 flex flex-col items-center justify-end relative
    `}>
    
    {/* Idx */}
    <span className="grow">#{idx+1}</span>

    {(!item.new || mode === 'edit') && <>

      {/* Buttons */}
      {mode === "edit" && 
        <div className="flex flex-wrap flex-row gap-1 items-center justify-center my-3">
          {item.new ? 
            <button disabled={!changed} onClick={add} className={`btn ${changed ? 'btn-green' : ''}`}>Add</button>  
            : <>
              <button onClick={remove} className={`btn btn-red`}>X</button>  
              <button disabled={!changed} onClick={save} className={`btn ${changed ? 'btn-blue' : ''}`}>Save</button>  
            </>
          }
          <button disabled={!changed} onClick={reset} className={`btn ${changed ? 'btn-blue' : ''} `}>Reset</button>  
        </div>
      }
      
      {/* Count */}
      <div className="flex flex-row flex-wrap justify-center items-center text-[20px] p-[10px]">
        {mode === "view" ? 
          item.count 
          : 
          <input type="text" value={item.count} onChange={setCount} id={'count-'+idx}
          className="border-[1px] border-solid text-black rounded text-center max-w-[40px] mr-1"/>
        }
        pcs.
        {isAdmin && <span>/{item.sold || 0} sold</span>}
      </div>

      {/* Image */}
      {mode === "view" ? <img alt='' src={item.src} /> : 
        <div className={`flex flex-col items-center justify-end gap-2 w-full h-full min-w-[100px] min-h-[100px]`}>
          <img alt='' src={item.src}/>
          <span>specify src</span>
          {/* {item.src?.match(/^data:image\/(png|jpg);base64,/) && <span>{'[Base64 image]}'}</span>} */}
          <textarea value={item.src} className={`border rounded p-[3px] w-full border-dotted`} onChange={setSrc} rows={3} id={'src-'+idx} />
          <span>or select file</span>
          <input type="file" accept="image/*" className="border w-full border-dotted rounded no-keyboard" onChange={setFile} id={'file-'+idx}/>
        </div>
      }
      
      {/* Info */}
      <div className={`relative mt-[36px] ${mode === 'view' ? 'px-[22px] py-[12px] rounded-full' : 'rounded p-2'}
        bg-[var(--price-color)] text-white font-bold
        flex ${mode === 'view' ? 'flex-row' : 'flex-col'} gap-2 items-center justify-center
      `}>
        {/* Price */}
        {mode === 'edit' && <span>Price:</span>}
        {mode === "view" ? <span className="text-[36px]">{item.price}</span> : 
          <input type="text" value={item.price} onChange={setPrice} id={'price-'+idx} 
            className="text-center text-[22px] text-black rounded w-full"/>
        }
        {mode === 'view' && <span className={mode === 'view' && 'text-[36px]'}> UZS</span>}
        
        {/* Key */}
        {mode === 'edit' && <span>Key:</span>}
        <div className={`${mode === 'view' ? `
            absolute right-[-10px] top-[-20px]
            rounded-full text-[20px] border-[1px] 
            px-[10px] py-[5px]
          ` : 'rounded p-2'} 
          bg-black text-white 
        `}>
          {mode === "view" ? item.key : 
            <input type="text" value={item.key} onChange={setKey} id={'key-'+idx}
              className="text-black rounded max-w-[40px] text-center"/>
          }
        </div>
      </div>

      {/* Name */}
      {mode === "view" ? 
        <span className={`mt-[12px] text-center text-[36px]/[40px]`}>{
          item.name.split('\n').map((item,key,array) => <Fragment key={key}><Fragment>{item}</Fragment>{key<array.length-1 && <br/>}</Fragment>)
        }</span> :
        <textarea value={item.name} className={`text-[20px] text-center mt-[12px] w-full border rounded p-[3px] border-dotted`} onChange={setName} rows={3} id={'name-'+idx}/>
      }

    </>}
  </Wrap>
}