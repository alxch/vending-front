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
    switch(result.status){
      case 'processing': 
        if(repeat){
          delete result.status;
          request.timeout = setTimeout(()=>repeat(result),2000);
          break;
        } // done
      case 'done': 
        request.setLoading(false);  
        delete result.status;
        done && done(result);      
      break;
      default: throw new Error(result.error);
    }
  }
  catch(error){
    request.setLoading(false);
    console.error(error.message);
    request.setError(error.message);
  }
};

request.stop = () => {
  request.timeout && clearTimeout(request.timeout);
  request.controller.abort();
};

export default request;
