import logo from './assets/logo.svg';
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import request from './request';

export default function App() {
  const [login, setLogin] = useState(localStorage.getItem('vm-login')||'');
  const [pass, setPass] = useState('');
  const [token, setToken] = useState(localStorage.getItem('vm-token')||'');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(()=>{
    localStorage.setItem('vm-login', login);
    localStorage.setItem('vm-token', token);
    console.log('Login, Token:', login, token);
  },[login,token]);

  useEffect(()=>{
    // login
    request({
      onError: error => {
        // setError(error);
        error && setToken('');
      },
      loading: setLoading,
      params: {
        url: 'setup/login',
        method: 'post',
        body: JSON.stringify({login,token}),
      },
      done: result=>{
        console.log('Login:', result);
        setToken(result.token);
      }
    });
    // eslint-disable-next-line
  },[]);

  const logout = () => {
    request({
      onError: setError,
      loading: setLoading,
      params: {
        url: 'setup/logout',
        method: 'post',
        body: JSON.stringify({login}),
      },
      done: result => {
        console.log('Logout:', result);
        setToken('');
      }
    });
  };

  const auth = () => {
    request({
      onError: setError,
      loading: setLoading,
      params: {
        url: 'setup/auth',
        method: 'post',
        body: JSON.stringify({login,pass}),
      },
      done: result => {
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
        <Button disabled={loading} LinkComponent={'a'} href="/?admin" variant="contained" >
          Edit assortment of goods
        </Button>
        <Button disabled={loading} variant="contained" onClick={logout}>Logout</Button>
      </>}
    </div>
  );
}
