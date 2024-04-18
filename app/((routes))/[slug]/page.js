"use client";
import ChatBox from "@/app/components/ChatBox";
import UploadViewer from "@/app/components/UploadViewer";
import { Spinner } from "@nextui-org/spinner";
import NextImage from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const page = () => {

  const [uploads, setUploads] = useState([]);

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
    fileInput.accept = '*'; // accept all file types
    fileInput.multiple = true;
    fileInput.click();
    fileInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files.length > 0) {
        const newUploads = [...uploads];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          // check file type and size
          if (file.type.startsWith('video/') || file.size > 10485760) {
            alert('Video files and files larger than 10MB are not allowed');
            continue;
          }
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

  const imagePasteHandler = (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    // iterate until we find an image
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        const reader = new FileReader();
        const itemType = items[i].type; // Store the type in a variable
        reader.onloadend = function() {
          const base64data = reader.result;
          // Check if image already exists in uploads
          if (uploads.some(upload => upload.file === base64data)) {
            alert('This image has already been uploaded');
            return;
          }
          // Extract the extension from the MIME type
          const extension = itemType.split('/')[1]; // Use the stored type
          const newUpload = {
            id: new Date().getTime().toString(),
            type: 'image',
            name: `image_${new Date().getTime()}.${extension}`, // Dynamic extension
            file: base64data,
            url: URL.createObjectURL(blob),
          };
          setUploads((prevUploads) => [...prevUploads, newUpload]);
        }
        reader.readAsDataURL(blob);
        break;
      }
    }
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
          onDrop={textAreaDragAndDropHandler}
          onPaste={imagePasteHandler}
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
