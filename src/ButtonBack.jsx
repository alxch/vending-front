import { Link } from "react-router-dom";

export default function ButtonBack(props){
  return <Link state={props.state} to={props.to} onClick={e=> {
    if(props.onClick) {
      e.stopPropagation();
      e.preventDefault();
      props.onClick();
    }
  }} className={`text-[40px] text-white ${props.disabled ? 'bg-gray-500':'bg-[var(--menu-color-active)]'}
    rounded-full px-[40px] py-[30px]`}>⟵ {props.title}</Link>
}