import { Link } from "react-router-dom";

export default function ButtonBack({title,onClick}){
  return <Link to="/" className="text-[40px] text-white bg-[var(--menu-color-active)]
    rounded-full px-[40px] py-[30px]">⟵ {title}</Link>
}