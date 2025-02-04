import { Link } from "react-router-dom";

export default function ButtonBack({disabled, title,to,onClick}){
  return <Link to={to} onClick={e=> {
    if(onClick) {
      e.stopPropagation();
      e.preventDefault();
      onClick();
    }
  }} className={`text-[40px] text-white ${disabled ? 'bg-gray-500':'bg-[var(--menu-color-active)]'}
    rounded-full px-[40px] py-[30px]`}>⟵ {title}</Link>
}