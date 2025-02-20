import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Item from './Item';
import request from './request';

function Items(props){
  const isAdmin = props.isAdmin;
  const [items, setItems] = useState(null);
  const [mode, setMode] = useState(isAdmin ? "edit" : "view");
  const [/* loading */, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(null);

  const getItems = () => {
    request({
      onError: setError,
      loading: setLoading,
      params: {
        url: 'items',
        method: 'get'
      },
      done: request.getItemsDone
    });
  };
  request.getItemsDone = result => {
    if(JSON.stringify(items) !== JSON.stringify(result.items)){
      console.log('Items get:', result.items);
      setItems(result.items);
    } else {
      console.log('Items get');
    }
    if(!isAdmin){
      setTimer(setTimeout(getItems, 2000));
    }
  };

  request.clearTimer = () => {
    if(timer) clearTimeout(timer);
  };

  useEffect(()=>{
    getItems();
    return () => {
      request.clearTimer();
    };
    // eslint-disable-next-line
  }, []);

  const postItems = () => {
    if(!isAdmin) return;

    request({
      onError: setError,
      loading: setLoading,
      params: {
        url: 'items',
        method: 'post',
        body: JSON.stringify(items),
      },
      done: result=>{
        console.log('Items post:', result.items);
        setItems(result.items);
      }
    });
  };

  useEffect(()=>{
    setMode(props.isAdmin ? "edit" : "view");
  }, [props.isAdmin]);

  const changeMode = (e) => {
    setMode(e.target.value);
  }

  return (<>
    {/* Controls */}
    {isAdmin && 
      <div className={`flex flex-col gap-2 text-[26px] mb-[20px] p-[10px]`}>
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
    {/* Status */}
    <div className='mb-[20px]'>
      {error && <span className='text-[24px] text-red-700'>{error}</span>}
      {/* {loading && <span className='text-[24px] text-green-700'>Loading...</span>} */}
    </div>
    {/* Wrap */}
    <div className='rounded flex flex-wrap gap-[50px] justify-evenly items-stretch p-[20px]' style={
      isAdmin && mode === 'view' ? {
        background: 'repeating-linear-gradient(45deg, #ddd, #ddd 10px, #fff 10px, #fff 20px'
      } : {}
    }>
      {/* Items */}
      {items && items.map((item,idx)=>(isAdmin ? 
        <Item isAdmin={isAdmin} key={idx} idx={idx} mode={mode} item={item} onSave={(saveItem)=>{
          items[idx] = saveItem;
          postItems();
        }} onRemove={(removeItem)=>{
          if(!window.confirm("Do You really want to delete item " + removeItem.key + "?")) return;
          items.splice(idx,1);
          postItems();
        }} /> : 
        /* not admin */
        <Link key={idx} className={`${item.count ? '':'grayscale'} flex flex-col items-center justify-end`} to={item.count ? '/payment' : ''} state={item}>
          <Item idx={idx} item={item} />
        </Link>
      ))}

      {/* New item */}
      {isAdmin && mode === "edit" && 
        <Item idx="_" mode={mode} onAdd={(newItem)=>{
          items.push(newItem);
          postItems();
        }} />
      }
    </div>
  </>);
}

export default Items;