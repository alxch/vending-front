import { useState, useEffect } from 'react';
import Item from './Item';
import request from './request';

// const Rows = 6;
const Cols = 10;
const Cells = [
  2,0,2,0,2,0,2,0,2,0,
  2,0,2,0,2,0,2,0,2,0,
  1,1,1,1,1,1,1,1,1,1,
  1,1,1,1,1,1,1,1,1,1,
  1,1,1,1,1,1,1,1,1,1,
  1,1,1,1,1,1,1,1,1,1
];

function Items(props){
  const isAdmin = props.isAdmin;
  const [items, setItems] = useState([]);
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
      setTimer(setTimeout(getItems, 3000));
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

  const getCell = cellIdx => {
    const col = cellIdx % Cols;
    const row = (cellIdx - col) / Cols;
    return {col:col+1,row:row+1,size:Cells[cellIdx]};
  };

  const getItemIdx = cellIdx => {
    const {row,col} = getCell(cellIdx);
    return items.findIndex(item => item.key === `${row}.${col}`);
  };

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
    <div className={`grid grid-cols-10 gap-[25px] p-5`} style={
      isAdmin && mode === 'view' ? {
        background: 'repeating-linear-gradient(45deg, #ddd, #ddd 10px, #fff 10px, #fff 20px'
      } : {}
    }>
      {/* Cells */}
      {Cells.map((cell,cellIdx) => cell !== 0 && (
        <Item key={cellIdx} cell={getCell(cellIdx)}
          mode={mode} idx={cellIdx} isAdmin={isAdmin}
          item={getItemIdx(cellIdx) !== -1 ? items[getItemIdx(cellIdx)] : null}
          onSave={(saveItem)=>{
            if(getItemIdx(cellIdx) === -1) return;
            const [row,col] = saveItem.key.split('.').map(Number);
            if(!Cells[(row-1)*Cols+(col-1)]) {
              console.error('Item key not allowed:', saveItem.key);
              return;
            }

            items[getItemIdx(cellIdx)] = saveItem;
            // setItems([...items]);
            postItems();
          }}
          onRemove={(removeItem)=>{
            if(getItemIdx(cellIdx) === -1) return;
            if(!window.confirm("Do You really want to delete item " + removeItem.key + "?")) return;
            
            items.splice(getItemIdx(cellIdx),1);
            // setItems([...items]);
            postItems();
          }}
          onAdd={(newItem)=>{
            const [row,col] = newItem.key.split('.').map(Number);
            if(!Cells[(row-1)*Cols+(col-1)]) {
              console.error('Item key not allowed:', newItem.key);
              return;
            }

            items.push(newItem);
            // setItems([...items]);
            postItems();
          }}
        />
      ))}

    </div>
  </>);
}

export default Items;