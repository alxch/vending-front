const baseUrl = 'http://localhost:3001/api/';
const repeatInterval = 8000;

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
    if(response.status >= 500){
      console.log(`${params.method.toUpperCase()} ${url}`, response.status);
      throw new Error(await response.text());
    }
    
    const result = await response.json();
    console.log(`${params.method.toUpperCase()} ${url}`, result, response.status);
    if(!result.status) throw new Error(JSON.stringify(result));

    switch(result.status){
      case 'processing': 
        const repeatCallback = repeat && repeat(result);
        request.timeout = setTimeout(()=>repeatCallback && repeatCallback(result),repeatInterval);
      break;
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
