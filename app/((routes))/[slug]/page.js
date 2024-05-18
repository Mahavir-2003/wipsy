"use client";
import ChatBox from "@/app/components/ChatBox";
import UploadViewer from "@/app/components/UploadViewer";
import { Spinner } from "@nextui-org/spinner";
import NextImage from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { base } from "@uploadcare/upload-client";
import axios from "axios";

const page = () => {
  
  const [uploads, setUploads] = useState([]);
  const [chatData, setChatData] = useState([]);
  const [textAreaValue, setTextAreaValue] = useState("");
  const { slug } = useParams();
  const [ID, setID] = useState(slug);
  const [isUploading, setIsUploading] = useState(false);


  const fetchChatHistory = async () => {
    const response = await axios.post("/api/fetch", { chatID: ID });
    if (response.status === 200) {
      setChatData(response.data.chatHistory);
    }else{
      console.log("Error fetching chat history : ", response.data.error);
      alert("Error fetching chat history");
    }
  };

  const updateChatHistory = async (Chat) => {
    const response = await axios.post("/api/update", { chatID: ID, chatHistory: Chat });
    if (response.status === 200) {
      await setChatData(response.data.chatHistory);
    }else{
      console.log("Error updating chat history : ", response.data.error);
      alert("Error updating chat history");
    }
  };

  useEffect(() => {
    const newSlug = decodeURIComponent(slug)
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9\-]/g, "");
    if (newSlug !== slug) {
      window.location.replace("/" + newSlug);
      setID(newSlug);
    }

    fetchChatHistory();
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





  const insertClickHandler = async (e) => {
    setIsUploading(true);
    const message = textAreaValue.trim();
    if (message.length === 0 && uploads.length === 0) {
      alert("Please enter a message or upload an image");
      return;
    }
  
    const chatUploads = await Promise.all(
      uploads.map(async (upload) => {
        if (upload.type === "image") {
          console.log("Uploading image:", upload.name); // Log uploading status
          let file;
          if (typeof upload.file === 'string' && upload.file.startsWith('data:')) {
            // If the upload is a base64 image string, convert it to a Blob
            file = dataURItoBlob(upload.file);
          } else {
            // If the upload is a File object, use it as is
            file = upload.file;
          }
          const result = await base(file, {
//             # Expire in 30 min, e.g., 1454903856
// expire = int(time.time()) + 60 * 30
// set expiry in 30 seconds
            publicKey: "8c1816e1b2b84ba30ae9",
            store: false,
            metadata: {              
              subsystem: "uploader",
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Set TTL to 24 hours
            },
          });
          const fileId = Object.values(result)[0];
          return {
            id: fileId, // Use the UUID returned from Uploadcare
            type: upload.type,
            name: upload.name,
            file: file,
            url: `https://ucarecdn.com/${fileId}/${upload.name}`, // Use Uploadcare URL
          };
        } else {
          return upload;
        }
      })
    );
  
    const chat = {
      id: new Date().getTime().toString(),
      message: message,
      uploads: chatUploads,
    };
    const newData = [...chatData , chat];
    await updateChatHistory(newData);
    // await setChatData((prevChatData) => [...prevChatData, chat]);
    setTextAreaValue("");
    setUploads([]);
    setIsUploading(false);
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
                {isUploading ? (
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
                {isUploading ? (
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