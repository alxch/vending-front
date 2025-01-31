import { /* createBrowserRouter, */ createHashRouter, RouterProvider } from 'react-router-dom';
import banner from './assets/images/banner-1.png'
import Items from './Items';
import Success from './Success';
import Payment from './Payment';
import Menu from './Menu';
import { ThemeContext } from "./Theme";
import { useContext, useState } from 'react';

export default function App() {
  const isAdmin = window.location.search.slice(1) === 'admin';
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [full,setFull] = useState(false);
  const click = ()=>{
    if(!full) {
      if(!window.fullScreen) document.documentElement.requestFullscreen();
      setFull(true);
    } else {
      if(window.fullScreen) document.exitFullscreen();
      setFull(false);
    }
  };

  return (<div className={`${theme === 'dark' ? 'bg-black':'bg-white'} flex flex-col items-center select-none pb-[40px] relative`}>
    {/* Fullscreen */}
    <button className={`absolute top-5 right-7 z-10 rounded-lg border-2 p-2 uppercase ${theme==="dark"? 'border-black text-black':'border-white text-white'}`} onClick={click}>{full?'Exit fullscreen':'Fullscreen'}</button>

    {/* Banner */}
    <img onDoubleClick={toggleTheme} alt="banner" src={banner} className={`${theme==="dark"?'-scale-x-100':''} w-full`}/>
    
    {/* Content */}
    <RouterProvider router={ createHashRouter([
      {
        path: '/',
        element: <><Menu/><Items isAdmin={isAdmin}/></>
      },
      {
        path: '/payment',
        element: <><Menu/><Payment/></>
      },
      {
        path: '/success',
        element: <><Menu/><Success/></>
      },
    ])}/>    
  </div>);
}
