"use client";
import ChatBox from "@/app/components/ChatBox";
import { Spinner } from "@nextui-org/spinner";
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
        <div className=" w-full overflow-hidden py-3 flex-1 h-full">
          <ChatBox />
        </div>
        <div className="Input-Area w-full flex justify-center items-center mb-5 max-h-fit">
          <button className="file-upload-button group bg-transparent border-[1px] duration-200 hover:border-[#fafafa] border-[#fafafa]/15 rounded-md h-full aspect-square mr-2 flex justify-center items-center">
            {
              <div className="relative w-[50%] aspect-square flex justify-center items-center ">
                {false ? (
                  <Spinner size="md" color="current" />
                ) : (
                  <Image
                    src="/Upload.svg"
                    fill={true}
                    alt="send"
                    className="object-cover w-full h-full duration-200 opacity-50 group-hover:opacity-100"
                  />
                )}
              </div>
            }
          </button>
          <textarea
            className="text-area-input w-[90%] h-[70px] placeholder:text-[#fafafa]/30 placeholder:font-light bg-transparent  resize-none border px-3 pt-3 rounded-md focus:outline-none focus:border-[#fafafa]/70 border-[#fafafa]/15"
            placeholder="Type your message here"
          ></textarea>
          <button className="insert-button aspect-video flex justify-center items-center h-full hover:bg-yellow-300 bg-yellow-400 text-black text-lg font-medium tracking-wide rounded-md ml-2">
            {
              <div className="relative h-[50%] aspect-square flex justify-center items-center">
                {false ? (
                  <Spinner size="md" color="current" />
                ) : (
                  <Image
                    src="/send.svg"
                    fill={true}
                    alt="send"
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
