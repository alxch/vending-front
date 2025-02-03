const baseUrl = 'http://localhost:3001/api/';

const request = async({params, repeat, done}) => {
  const url = params.url;
  if(params.method.toLowerCase() === 'post'){
    params.headers = {
      'Content-Type': 'application/json;charset=utf-8'
    };
  }
  request.controller = new AbortController();
  params.signal = request.controller.signal;

  try{
    request.setError(null);
    const response = await fetch(baseUrl+url, params);
    const result = await response.json();
    console.log(`${params.method.toUpperCase()} ${url}`, result);
    if(!result.status) throw new Error(JSON.stringify(result));
    
    switch(result.status){
      case 'processing': 
        if(repeat){
          request.timeout = setTimeout(()=>repeat(result),2000);
          break;
        } // done
      case 'done': 
        request.setLoading(false);  
        done && done(result);      
      break;
      case 'error':
        throw new Error(result.error);
      default: 
        throw new Error(JSON.stringify(result));
    }
  }
  catch(error){
    request.setLoading(false);
    console.error(error.message);
    request.setError(error.message);
    // TODO: repeat request after delay
  }
};

request.stop = () => {
  request.timeout && clearTimeout(request.timeout);
  request.controller.abort();
};

export default request;
