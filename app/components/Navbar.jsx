"use client";
import { useParams } from "next/navigation"

const Navbar = () => {
  const {slug} = useParams();

  const redirectToHome = () => {
    window.location.href = '/';
  }
  
  return (
    <header className='w-full border-b-[1px] border-[#fafafa]/10 py-4 px-6 flex justify-between items-center'>
        <h1 onClick={redirectToHome} className='hover:cursor-pointer text-2xl font-medium'>Wipsy<span className="text-[#fafafa]/50 font-light text-xl">{slug ? " / "+slug : null}</span></h1>
    </header>
  )
}

export default Navbar