const baseUrl = `http://${process.env.NODE_ENV === 'development' ? 'localhost' : '10.42.0.1'}:3001/api/`;
const repeatInterval = 1000;

// only one request allowed at a time
const request = async({params, repeat, done, loading, onError}) => {
  try{
    const url = params.url;
    if(params.method.toLowerCase() === 'post'){
      params.headers = {
        'Content-Type': 'application/json;charset=utf-8'
      };
    }
    // request.controller = new AbortController();
    // params.signal = request.controller.signal;  
    loading && loading(true);
    // onError && onError(null);
    const response = await fetch(baseUrl+url, params);
    // setTimeout(()=>request({params, repeat, done, loading, onError}),5000);
    if(response.status >= 500){
      console.log(`${params.method.toUpperCase()} ${url}`, response.status);
      throw new Error(await response.text());
    }
    
    const result = await response.json();
    // console.log(`${params.method.toUpperCase()} ${url}`, result, response.status);
    if(!result.status) throw new Error(JSON.stringify(result));

    switch(result.status){
      case 'processing': 
        const repeatCallback = repeat && repeat(result);
        const timer = setTimeout(()=>{
          repeatCallback && repeatCallback(result);
        }, repeatInterval);
        request.timeouts.push(timer);
      break;
      case 'done': 
        loading && loading(false);  
        done && done(result);
        onError && onError(null);   
      break;
      case 'error':
        throw new Error(result.error);
      default: 
        throw new Error(JSON.stringify(result));
    }
  }
  catch(error){
    loading && loading(false);
    console.error(error.message);
    onError && onError(error.message);
  }
};

request.timeouts = [];
request.stop = () => {
  request.timeouts.forEach(clearTimeout);
  request.timeouts = [];
  // request.controller.abort();
};

export default request;
