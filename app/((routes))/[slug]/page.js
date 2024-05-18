"use client";
import ChatBox from "@/app/components/ChatBox";
import UploadViewer from "@/app/components/UploadViewer";
import { Spinner } from "@nextui-org/spinner";
import NextImage from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const page = () => {
  
  const [uploads, setUploads] = useState([]);
  const [chatData, setChatData] = useState([]);
  const [textAreaValue, setTextAreaValue] = useState("");
  const { slug } = useParams();
  const [ID, setID] = useState(slug);

  useEffect(() => {
    const newSlug = decodeURIComponent(slug)
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9\-]/g, "");
    if (newSlug !== slug) {
      window.location.replace("/" + newSlug);
      setID(newSlug);
    }
  }, []);

  const fileUploadClickHandler = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*"; // Accept only image files
    fileInput.multiple = true;
    fileInput.click();
    fileInput.addEventListener("change", (e) => {
      const files = e.target.files;
      if (files.length > 0) {
        const newUploads = [...uploads];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (file.type.startsWith("image/")) { // Check if the file is an image
            if (file.size > 10485760) { // Check if the file size is greater than 10MB
              alert("Image files larger than 10MB are not allowed");
              continue;
            }
            const newUpload = {
              id: new Date().getTime().toString(),
              type: file.type.split("/")[0],
              name: file.name,
              file: file,
            };
            newUpload.url = URL.createObjectURL(file);
            newUploads.push(newUpload);
          } else {
            alert("Only image files are allowed"); // Show an alert if the user tries to upload a non-image file
          }
        }
        setUploads(newUploads);
      }
    });
  };

  const insertClickHandler = (e) => {
    const message = textAreaValue.trim();
    if (message.length === 0 && uploads.length === 0) {
      alert("Please enter a message or upload a file");
      return;
    }

    const chatUploads = uploads.map(upload => {
      if (upload.type === 'image') {
        if (typeof upload.file === 'string' && upload.file.startsWith('data:')) {
          // If the upload is a base64 image string, create a Blob URL
          const blob = dataURItoBlob(upload.file);
          return {
            ...upload,
            file: blob,
            url: URL.createObjectURL(blob)
          };
        } else {
          // If the upload is a file, create a Blob URL
          return {
            ...upload,
            url: URL.createObjectURL(upload.file)
          };
        }
      } else {
        // If the upload is not an image, create a Blob URL
        return {
          ...upload,
          url: URL.createObjectURL(upload.file)
        };
      }
    });

    const chat = {
      id: new Date().getTime().toString(),
      message: message,
      uploads: chatUploads
    };

    setChatData((prevChatData) => [...prevChatData, chat]);
    setTextAreaValue("");
    setUploads([]);
  };

  const textPasteHandler = (e) => {
    const pastedText = (e.clipboardData || window.clipboardData).getData("text/plain");
    setTextAreaValue(prevValue => prevValue + pastedText);
  };

  const imagePasteHandler = (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    const newUploads = [...uploads];

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        const reader = new FileReader();
        const itemType = items[i].type;
        reader.onloadend = function () {
          const base64data = reader.result;
          if (uploads.some((upload) => upload.file === base64data)) {
            alert("This image has already been uploaded");
            return;
          }
          const extension = itemType.split("/")[1];
          const newUpload = {
            id: new Date().getTime().toString(),
            type: "image",
            name: `image_${new Date().getTime()}.${extension}`,
            file: base64data,
            url: URL.createObjectURL(blob),
          };
          newUploads.push(newUpload);
          setUploads(newUploads);
        };
        reader.readAsDataURL(blob);
      }
    }
  };

  const pasteHandler = (e) => {
    e.preventDefault();
    textPasteHandler(e);
    imagePasteHandler(e);
  };

  // Helper function to convert a base64 string to a Blob
  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }

  return (
    <div className="w-full h-full flex justify-center items-end">
      <div className=" h-full w-[70%]  flex flex-col justify-start items-center">
        <div className=" w-full overflow-hidden py-3 flex-1 h-full">
          <ChatBox chatData={chatData} />
        </div>
        <div className="Input-Area w-full flex justify-center items-center mb-5 max-h-fit relative">
          <div
            className={`absolute top-0 translate-y-[-100%] left-0 w-[40%] aspect-video pb-3 ${
              uploads.length === 0 ? "hidden" : "block"
            }`}
          >
            <div
              id="uploads"
              className="uploads w-full h-full bg-transparant border-[1px] border-[#fafafa]/15 rounded-md overflow-hidden"
            >
              <UploadViewer uploads={uploads} setUploads={setUploads} />
            </div>
          </div>
          <button
            onClick={fileUploadClickHandler}
            className="file-upload-button group bg-transparent border-[1px] duration-200 hover:border-[#fafafa] border-[#fafafa]/15 rounded-md h-full aspect-square mr-2 flex justify-center items-center"
          >
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
            value={textAreaValue}
            onChange={(e) => setTextAreaValue(e.target.value)}
            onPaste={pasteHandler}
            className=" whitespace-pre-wrap text-area-input w-[90%] h-[70px] placeholder:text-[#fafafa]/30 placeholder:font-light bg-transparent  resize-none border px-3 pt-3 rounded-md focus:outline-none focus:border-[#fafafa]/70 border-[#fafafa]/15"
            placeholder="Type your message here"
          ></textarea>
          <button
            onClick={insertClickHandler}
            className="insert-button aspect-video flex justify-center items-center h-full hover:bg-yellow-300 bg-yellow-400 text-black text-lg font-medium tracking-wide rounded-md ml-2"
          >
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