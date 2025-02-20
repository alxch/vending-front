import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';
import banner from './assets/images/banner-1.png'
import Items from './Items';
import Success from './Success';
import Payment from './Payment';
import Setup from './Setup';
import Menu from './Menu';
import { useEffect, useState } from 'react';
import request from './request';
// import { ThemeContext } from "./Theme";

export default function App() {
  // const { theme, toggleTheme } = useContext(ThemeContext);
  const adminPage = window.location.search.slice(1) === 'admin';
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(()=>{
    if(!adminPage) return;
    // login
    request({
      onError: setError,
      loading: setLoading,
      params: {
        url: 'setup/login',
        method: 'post',
        body: JSON.stringify({
          login: localStorage.getItem('vm-login'),
          token: localStorage.getItem('vm-token')
        }),
      },
      done: result=>{
        console.log('Login:', result);
        setIsAdmin(true);
      }
    });
    // eslint-disable-next-line
  }, []);

  return <div className={`flex flex-col items-center pb-[40px] relative`}>

    {/* Admin */}
    {adminPage && <a href={"/setup"} className={`absolute top-5 right-7 z-10 rounded-lg border-2 p-2 uppercase text-white bg-black opacity-80 hover:opacity-100`}>Back to Setup menu</a>}
    
    {/* Content */}
    {window.location.pathname === "/" ? 
      <HashRouter>
        {/* Banner */}
        <img alt="banner" src={banner} className={`w-full`} />
        {!adminPage || adminPage && isAdmin ? 
          <><Menu/>
          <Routes>
            <Route path="/" element={<Items isAdmin={isAdmin}/>}/>
            <Route path="/payment" element={<Payment/>}/>
            <Route path="/success" element={<Success/>}/>
          </Routes></> 
        : 
          <div className='mt-[20px]'>
            {error && <span className='text-[24px] text-red-700'>{error}</span>}
            {loading && <span className='text-[24px] text-green-700'>Loading...</span>}  
          </div>
        }
      </HashRouter>
      :    
      <BrowserRouter>
        <Routes>
          <Route path="/setup" element={<Setup/>}/>
        </Routes>
      </BrowserRouter>
    }
  </div>;
}
