import logo from '../assets/logo.svg';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import request from '../request';

export default function App() {
  const [login, setLogin] = useState('');
  const [pass, setPass] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const auth = async () => {
    request({
      onError: (error, result) => {
        if(result && result.token){
          setTimeout(()=>{
            setToken(result.token);
            setError(null);
          }, 1000);
        }
        setError(error);
      },
      loading: setLoading,
      params: {
        url: 'setup/auth',
        method: 'post',
        body: JSON.stringify({login,pass}),
      },
      done: result => {
        console.log('Auth token:', result.token);
        setToken(result.token);
      }
    });
  };

  return (
    <div className="App App-header">
      <img src={logo} className="App-logo" alt="logo" />

      {error && <span className='text-[14px] text-red-700'>{error}</span>}
      
      {!token ? <>
        <TextField disabled={loading} label="Login" value={login} onChange={e => setLogin(e.target.value)} />
        <TextField disabled={loading} label="Pass" type="password" value={pass} onChange={e => setPass(e.target.value)} />
        <Button disabled={loading} variant="outlined" onClick={auth}>Authorize</Button>
      </>
      : <>
        {/* TODO: make separate editor and store values in backend */}
        <Button LinkComponent={'a'} href="/?admin" variant="contained" >
          Edit assortment of goods
        </Button>
      </>}
    </div>
  );
}
