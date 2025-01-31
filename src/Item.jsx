import { useId, useState, useEffect, Fragment, useContext } from "react";
import { ThemeContext } from "./Theme";

const newItemData = {
  new: true,
  src: '',
  price: '',
  name: '',
  key: ''
};

export default function Item(props){
  const { theme } = useContext(ThemeContext);
  const [changed, setChanged] = useState(false);
  const [item, setItem] = useState({...props.item || newItemData});
  const mode = props.mode || 'view';
  const idx = props.idx; // useId();

  useEffect(()=>{
    // console.log(item,props.item);
    if(JSON.stringify(item) === JSON.stringify({...props.item || newItemData})){
      setChanged(false);
    }
    else {
      setChanged(true);
    }
  }, [item, props.item]);

  useEffect(()=>{
    if(!props.itemModifier || props.itemModifier.idx != idx) return;
    delete props.itemModifier.idx;
    setItem({...item, ...props.itemModifier});
  }, [props.itemModifier]);

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
    props.onChange && props.onChange('src-'+idx, src);
  }
  const setPrice = (e) => {
    const price = e.target.value;
    setItem({...item, price});
    props.onChange && props.onChange('price-'+idx, price);
  }
  const setKey = (e) => {
    const key = e.target.value;
    setItem({...item, key});
    props.onChange && props.onChange('key-'+idx, key);
  }
  const setName = (e) => {
    const name = e.target.value;
    setItem({...item, name});
    props.onChange && props.onChange('name-'+idx, name);
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
    setItem({...props.item || newItemData});
  }
  
  return <>
    {/* Buttons */}
    {mode === "edit" && <div className="flex flex-row gap-1 items-center justify-center mb-3">
      {item.new ? 
        <button disabled={!changed} onClick={add} className={`btn ${changed ? 'btn-green' : ''}`}>Add</button>  
        : <>
          <button onClick={remove} className={`btn btn-red`}>X</button>  
          <button disabled={!changed} onClick={save} className={`btn ${changed ? 'btn-blue' : ''}`}>Save</button>  
        </>
      }
      <button disabled={!changed} onClick={reset} className={`btn ${changed ? 'btn-blue' : ''} `}>Reset</button>  
    </div>}
    {/* Image */}
    {mode === "view" ? <img alt='' src={item.src} /> : 
      <div className={`flex flex-col items-center justify-end gap-2 border border-gray-500 border-dashed rounded w-full h-full min-w-[100px] min-h-[100px] p-[10px] ${changed === true ? 'bg-orange-400' : ''}
      ${theme==='dark'?'text-white':'text-black'}
      `}>
        <img alt='' src={item.src}/>
        <span>specify src</span>
        {/* {item.src?.match(/^data:image\/(png|jpg);base64,/) && <span>{'[Base64 image]}'}</span>} */}
        <textarea value={item.src} className="text-black border rounded p-[3px] max-w-[200px] border-gray-500 border-dotted" onChange={setSrc} rows={3} id={'src-'+idx} />
        <span>or select file</span>
        <input type="file" accept="image/*" className="border max-w-[200px] border-gray-500 border-dotted rounded" onChange={setFile} id={'file-'+idx}/>
      </div>
    }
    {/* Price */}
    <div className='relative mt-[36px] px-[32px] py-[22px] 
      bg-[var(--price-color)] rounded-full text-white font-bold
      flex flex-row gap-2 items-center justify-center
    '>
      {mode === "view" ? <span className="text-[36px]">{item.price}</span> : 
        <input type="text" value={item.price} onChange={setPrice} id={'price-'+idx} 
          className="text-center text-[22px] text-black rounded max-w-[100px]"/>
      }
      <span className="text-[36px]"> UZS</span>
      {/* Key */}
      <div className={`absolute right-[-15px] top-[-20px] 
        rounded-full text-[20px] border-[1px] ${theme==='dark'?'border-white':'border-black'} 
        bg-black text-white px-[20px] py-[10px]
      `}>
        {mode === "view" ? item.key : 
          <input type="text" value={item.key} onChange={setKey} id={'key-'+idx}
            className="bg-white text-black rounded max-w-[30px] text-center"/>
        }
      </div>
    </div>
    {/* Name */}
    {mode === "view" ? 
      <span className={`${theme==='dark'?'text-white':'text-black'} mt-[12px] text-center text-[36px]/[40px]`}>{
        item.name.split('\n').map((item,key,array) => <Fragment key={key}><Fragment>{item}</Fragment>{key<array.length-1 && <br/>}</Fragment>)
      }</span> :
      <textarea value={item.name} className="text-[20px] text-center mt-[12px] max-w-[220px] border rounded p-[3px] border-gray-500 border-dotted" onChange={setName} rows={2} id={'name-'+idx}/>
    }
  </>
}