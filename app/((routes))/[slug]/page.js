"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const page = () => {
  const { slug } = useParams();
  const [ID, setID] = useState(slug);
  useEffect(() => {
    // remove the space(%20) and replace it with a dash(-)
    const newSlug = decodeURIComponent(slug)
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9\-]/g, "");
    if (newSlug != slug) {
      window.location.replace("/" + newSlug);
      setID(newSlug);
    }
  }, []);

  return (
    <div className="w-full h-full flex justify-center items-end">
      <div className=" h-full w-[70%]  flex flex-col justify-start items-center">
        <div className="chat-history w-full flex-1 overflow-x-hidden overflow-y-scroll">
          chatbox
        </div>
        <div className="Input-Area w-full flex justify-center items-center mb-10 max-h-fit">
          <textarea
            className="w-[90%] h-[70px] bg-transparent  resize-none border px-3 pt-3 rounded-md focus:outline-none focus:border-[#fafafa]/60 border-[#fafafa]/10"
            placeholder="Type your message here"
          ></textarea>
          <button className="min-w-[10%] flex justify-center items-center h-full hover:bg-yellow-400 bg-yellow-300 text-black text-lg font-medium tracking-wide rounded-md ml-2">
            {
              <div className="relative w-[25%] aspect-square">
                {
                  true ?
                <Image
                  src="/send.svg"
                  fill={true}
                  alt="send"
                  className="object-cover w-full h-full"
                /> : null
                }
              </div>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
