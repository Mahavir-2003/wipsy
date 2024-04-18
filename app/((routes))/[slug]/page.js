"use client";
import ChatBox from "@/app/components/ChatBox";
import UploadViewer from "@/app/components/UploadViewer";
import { Spinner } from "@nextui-org/spinner";
import NextImage from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const page = () => {

  const [uploads, setUploads] = useState([
    {
      id: "1",
      type: "image", // file
      url : "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
      name: "image.jpg",
    },
    {
      id: "2",
      type: "file", // file
      name: "file.pdf",
    },
  ]);

  // Extras for the page
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


  // Logical part of the page
  const fileUploadClickHandler = () => {
    // open file upload dialog
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '*';
    fileInput.multiple = true;
    fileInput.click();
    fileInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files.length > 0) {
        const newUploads = [...uploads];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const newUpload = {
            id: new Date().getTime().toString(),
            type: file.type.split('/')[0],
            name: file.name,
            file: file,
          };
          if (newUpload.type === 'image') {
            newUpload.url = URL.createObjectURL(file);
          }
          newUploads.push(newUpload);
        }
        setUploads(newUploads);
      }
    });
  };

  const insertClickHandler = () => {
    console.log("insertClickHandler");
  };

  const textAreaDragAndDropHandler = () => {
    console.log("textAreaDragAndDropHandler");
  };



  return (
    <div className="w-full h-full flex justify-center items-end">
      <div className=" h-full w-[70%]  flex flex-col justify-start items-center">
        <div className=" w-full overflow-hidden py-3 flex-1 h-full">
          <ChatBox />
        </div>
        <div className="Input-Area w-full flex justify-center items-center mb-5 max-h-fit relative">
          <div className={`absolute top-0 translate-y-[-100%] left-0 w-[40%] aspect-video pb-3 ${uploads.length == 0 ? "hidden" : "block"}`}>
              <div id="uploads" className="uploads w-full h-full bg-transparant border-[1px] border-[#fafafa]/15 rounded-md overflow-hidden">
                <UploadViewer uploads={uploads} setUploads={setUploads}/>
              </div>
          </div>
          <button onClick={fileUploadClickHandler} className="file-upload-button group bg-transparent border-[1px] duration-200 hover:border-[#fafafa] border-[#fafafa]/15 rounded-md h-full aspect-square mr-2 flex justify-center items-center">
            {
              <div className="relative w-[50%] aspect-square flex justify-center items-center ">
                {false ? (
                  <Spinner size="md" color="current" />
                ) : (
                  <NextImage
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
                  <NextImage
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
