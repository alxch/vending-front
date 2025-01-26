import { /* createBrowserRouter, */ createHashRouter, RouterProvider } from 'react-router-dom';
import banner from './assets/images/banner-1.png'
import Items from './Items';
import Success from './Success';
import Payment from './Payment';
import Menu from './Menu';
import { ThemeContext } from "./Theme";
import { useContext } from 'react';

export default function App() {
  const isAdmin = window.location.search.slice(1) === 'admin';
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (<div className={`${theme === 'dark' ? 'bg-black':'bg-white'} flex flex-col items-center select-none pb-[40px]`}>
    {/* Banner */}
    <img onDoubleClick={toggleTheme} alt="banner" src={banner} className="w-full"/>
    
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
