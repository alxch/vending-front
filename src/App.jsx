import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';
import banner from './assets/images/banner-1.png'
import Items from './Items';
import Success from './Success';
import Payment from './Payment';
import Setup from './Setup';
import Menu from './Menu';
// import { ThemeContext } from "./Theme";

export default function App() {
  // const { theme, toggleTheme } = useContext(ThemeContext);
  const isAdmin = window.location.search.slice(1) === 'admin';

  return <div className={`flex flex-col items-center pb-[40px] relative`}>
    {/* Admin/User */}
    {/* <a href={isAdmin ? "/" : "/?admin"} className={`absolute top-5 right-7 z-10 rounded-lg border-2 p-2 uppercase text-white bg-black`}>{isAdmin ? 'User':'Admin'}</a> */}
    
    {/* Content */}
    {window.location.pathname == "/" ? 
      <HashRouter>
        {/* Banner */}
        <img alt="banner" src={banner} className={`w-full`} />
        <Menu/>
        <Routes>
          <Route path="/" element={<Items isAdmin={isAdmin}/>}/>
          <Route path="/payment" element={<Payment/>}/>
          <Route path="/success" element={<Success/>}/>
        </Routes>
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
