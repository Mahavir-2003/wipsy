"use client";
import Image from "next/image";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";


export default function Home() {

  const redirectUser = () => {
    const inputElement = document.getElementById("chat-creation-input");
    const chatId = inputElement.value;
    if (chatId) {
      inputElement.value = "";
      window.location.href = `/${chatId}`;
    }else{
    toast.error("Please enter a chat ID to continue.");
    }
  };

  return (
    <main className="flex w-full  h-full flex-col items-center justify-start pt-24">
      <Toaster />
      <div className=" text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold">Welcome to <span className=" text-blue-400">Wipsy</span></div>
      <p className=" w-[85%] lg:w-[60%] text-center text-lg sm:text-xl md:text-xl lg:text-2xl text-white/60 font-light mt-4">Store your temporary notes in a Notepad like interface with Wipsy. A free and open-source web app. built with Next.js. Data Storage for a Day.</p>
      <div className="  w-[85%] lg:w-[50%] mt-14 flex  justify-center items-center max-h-fit gap-x-2">
        <input id="chat-creation-input" type="text" className=" w-full h-12  p-4 rounded-lg bg-[#09090b] text-white/60 border border-white" placeholder="Enter your chat ID" />
        <button onClick={
          redirectUser
        } className=" bg-yellow-300 h-full flex justify-center items-center aspect-video rounded-lg text-white/80">
          <Image src="/Send.svg" alt="send" width={24} height={24} />
        </button>
      </div>
      <p className=" w-[85%] lg:w-[60%] text-center text-lg sm:text-xl md:text-xl lg:text-2xl text-white/60 font-light mt-14">Created by <Link className=" font-medium text-green-300" href="https://mhvr.vercel.app/" alt="website">Mahavir Patel</Link></p>
    </main> 
  );
}
