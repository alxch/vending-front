import { /* createBrowserRouter, */ createHashRouter, RouterProvider } from 'react-router-dom';
import banner from './assets/images/banner-1.png'
import Items from './Items';
import Success from './Success';
import Payment from './Payment';
import Menu from './Menu';
import { useState } from 'react';
// import { ThemeContext } from "./Theme";

export default function App() {
  // const { theme, toggleTheme } = useContext(ThemeContext);
  const isAdmin = window.location.search.slice(1) === 'admin';
  const [fullscreen,setFullscreen] = useState(false);
  const changeFullscreen = ()=>{
    if(!fullscreen) {
      if(!document.fullscreen) document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      if(document.fullscreen) document.exitFullscreen();
      setFullscreen(false);
    }
  };

  return (<div className={`flex flex-col items-center select-none pb-[40px] relative`}>
    {/* Banner */}
    <img alt="banner" src={banner} className={`w-full`} onDoubleClick={changeFullscreen}/>
    
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
