import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import banner from './assets/images/banner-1.png'
import Items from './Items';
import Success from './Success';
import Payment from './Payment';
import Menu from './Menu';

export default function App() {
  return (<>
    {/* Banner */}
    <img alt="banner" src={banner} className="w-full"/>
    
    {/* Content */}
    <RouterProvider router={ createBrowserRouter([
      {
        path: '/',
        element: <><Menu/><Items/></>
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
  </>);
}
