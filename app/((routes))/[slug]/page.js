"use client";
import ChatBox from "@/app/components/ChatBox";
import UploadViewer from "@/app/components/UploadViewer";
import { Spinner } from "@nextui-org/spinner";
import NextImage from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { base } from "@uploadcare/upload-client";
import axios from "axios";
import imageCompression from "browser-image-compression";
import debounce from "lodash/debounce";
import toast, { Toaster } from "react-hot-toast";

const Page = () => {
  const [uploads, setUploads] = useState([]);
  const [chatData, setChatData] = useState([]);
  const [textAreaValue, setTextAreaValue] = useState("");
  const { slug } = useParams();
  const [ID, setID] = useState(slug);
  const [isUploading, setIsUploading] = useState(false);

  const fetchChatHistory = useCallback(async () => {
    // show toast the chat is being fetched
    toast.loading("Fetching chat history...");
    try {
      const response = await axios.post("/api/fetch", { chatID: ID });
      if (response.status == 200) {
        setChatData(response.data.chatHistory);
        toast(`Your chat will expire in ${response.data.expiryTime}`, {
          icon: "🕒",
        });
      } else {
        console.error(
          "Server error when fetching chat history:",
          response.data.error
        );
        toast.error("Server error when fetching chat history");
      }
    } catch (error) {
      console.error("Network error when fetching chat history:", error);
      toast.error("Network error when fetching chat history");
    }finally{
      toast.remove();
      toast.success("fetched");
    }
  }, [ID, setChatData]);

  const updateChatHistory = useCallback(
    debounce(async (chatHistory) => {
      try {
        const response = await axios.post("/api/update", {
          chatID: ID,
          chatHistory,
        });
        if (response.status == 200) {
          setChatData(response.data.chatHistory);
          toast.success("saved");
        } else {
          console.error(
            "Server error when updating chat history:",
            response.data.error
          );
          toast.error("Server error when updating chat history");
        }
      } catch (error) {
        console.error("Network error when updating chat history:", error);
        toast.error("Network error when updating chat history");
      }
    }, 300),
    [ID, setChatData, debounce, toast]
  );

  useEffect(() => {
    const newSlug = decodeURIComponent(slug)
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9\-]/g, "");

    if (newSlug !== slug) {
      window.location.replace("/" + newSlug);
      setID(newSlug);
    } else {
      fetchChatHistory();
    }
  }, [fetchChatHistory, slug]);

  const fileUploadClickHandler = useCallback(() => {
    try {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.multiple = true;
      fileInput.click();
      fileInput.addEventListener("change", async (e) => {
        try {
          const files = e.target.files;
          if (files.length > 0) {
            const newUploads = Array.from(files).map((file) => {
              try {
                if (file.type.startsWith("image/")) {
                  if (file.size > 10485760) {
                    toast.error("Image files larger than 10MB are not allowed");
                    return null;
                  }
                  const newUpload = {
                    id: new Date().getTime().toString(),
                    type: file.type.split("/")[0],
                    name: file.name,
                    file: file,
                  };
                  newUpload.url = URL.createObjectURL(file);
                  return newUpload;
                } else {
                  toast.error("Only image files are allowed");
                  return null;
                }
              } catch (error) {
                console.error("Error processing file:", error);
                toast.error("Error processing file");
                return null;
              }
            });
            setUploads((prevUploads) => [
              ...prevUploads,
              ...newUploads.filter(Boolean),
            ]);
          }
        } catch (error) {
          console.error("Error in file input change event:", error);
          toast.error("Error in file input change event");
        }
      });
    } catch (error) {
      console.error("Error in file upload click handler:", error);
      toast.error("Error in file upload click handler");
    }
  }, []);

  const insertClickHandler = useCallback(async () => {
    try {
      setIsUploading(true);
      const message = textAreaValue;
      if (message.length === 0 && uploads.length === 0) {
        toast.error("Please enter a message or upload an image");
        setIsUploading(false);
        return;
      }

      // show toast the chat is being uploaded
      toast.loading("Uploading chat...");
      const chatUploads = await Promise.all(
        uploads.map(async (upload) => {
          try {
            if (upload.type === "image") {
              console.log("Compressing image:", upload.name);
              const file =
                upload.file instanceof Blob
                  ? upload.file
                  : dataURItoBlob(upload.file);
              const compressedFile = await imageCompression(file, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
              });

              console.log("Uploading image:", upload.name);
              const result = await base(compressedFile, {
                publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_KEY,
                store: false,
                metadata: {
                  subsystem: "uploader",
                  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                },
              });
              const fileId = Object.values(result)[0];
              return {
                id: fileId,
                type: upload.type,
                name: upload.name,
                url: `https://ucarecdn.com/${fileId}/${upload.name}`,
              };
            } else {
              return upload;
            }
          } catch (error) {
            console.error("Error processing upload:", error);
            toast.error("Error processing upload");
            return null;
          }
        })
      );
      // remove the loading toast
      toast.remove();

      const chat = {
        id: new Date().getTime().toString(),
        message,
        uploads: chatUploads.filter(Boolean),
      };
      const newData = [...chatData, chat];
      await updateChatHistory(newData);
      setTextAreaValue("");
      setUploads([]);
      setIsUploading(false);
    } catch (error) {
      console.error("Error in insert click handler:", error);
      toast.error("Error while inserting content");
      setIsUploading(false);
    }
  }, [chatData, textAreaValue, uploads, updateChatHistory]);

  const textPasteHandler = useCallback((e) => {
    try {
      const pastedText = (e.clipboardData || window.clipboardData).getData(
        "text/plain"
      );
      setTextAreaValue((prevValue) => prevValue + pastedText);
    } catch (error) {
      console.error("Error in text paste handler:", error);
      toast.error("Error in text paste handler");
    }
  }, []);

  const imagePasteHandler = useCallback(
    (e) => {
      try {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        const newUploads = [...uploads];

        for (let i = 0; i < items.length; i++) {
          try {
            if (items[i].type.indexOf("image") !== -1) {
              const blob = items[i].getAsFile();
              const reader = new FileReader();
              const itemType = items[i].type;
              reader.onloadend = function () {
                try {
                  const base64data = reader.result;
                  if (uploads.some((upload) => upload.file === base64data)) {
                    toast.error("This image has already been uploaded");
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
                } catch (error) {
                  console.error("Error in reader onloadend:", error);
                  toast.error("Error in reader onloadend");
                }
              };
              reader.readAsDataURL(blob);
            }
          } catch (error) {
            console.error("Error processing item:", error);
            toast.error("Error processing item");
          }
        }
      } catch (error) {
        console.error("Error in image paste handler:", error);
        toast.error("Error while pasting image");
      }
    },
    [uploads]
  );

  const pasteHandler = useCallback(
    (e) => {
      try {
        e.preventDefault();
        textPasteHandler(e);
        imagePasteHandler(e);
      } catch (error) {
        console.error("Error in paste handler:", error);
        toast.error("Error while pasting content");
      }
    },
    [textPasteHandler, imagePasteHandler]
  );

  const dataURItoBlob = useCallback((dataURI) => {
    try {
      const byteString = atob(dataURI.split(",")[1]);
      const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ab], { type: mimeString });
    } catch (error) {
      console.error("Error in data URI to blob conversion:", error);
      toast.error("Error in data URI to blob conversion");
      return null;
    }
  }, []);

  return (
    <div className="w-full h-full flex justify-center items-end">
      <Toaster />
      <div className="h-full lg:w-[70%] w-[96%] flex flex-col justify-start items-center">
        <div className="w-full overflow-hidden py-3 flex-1 h-full">
          <ChatBox chatData={chatData} />
        </div>
        <div className={`Input-Area ${isUploading ? "pointer-events-none cursor-not-allowed" : "pointer-events-auto"} w-full flex justify-center items-center mb-5 max-h-fit relative`}>
          <div
            className={`absolute top-0 translate-y-[-100%] left-0 bg-[#09090b] w-full sm:w-[60%] md:w-[40%] aspect-video pb-3 ${
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
            <div className="relative w-[50%] aspect-square flex justify-center items-center">
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
          </button>
          <textarea
            value={textAreaValue}
            onChange={(e) => setTextAreaValue(e.target.value)}
            onPaste={pasteHandler}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                insertClickHandler();
              }
            }}
            className="whitespace-pre-wrap text-area-input w-[90%] h-[50px] md:h-[70px] placeholder:text-sm md:placeholder:text-base placeholder:text-[#fafafa]/30 placeholder:font-light bg-transparent resize-none border px-3 pt-3 rounded-md focus:outline-none focus:border-[#fafafa]/70 border-[#fafafa]/15"
            placeholder="Type your message here"
          ></textarea>
          <button
            onClick={insertClickHandler}
            className="insert-button aspect-square md:aspect-video flex justify-center items-center h-full hover:bg-yellow-300 bg-yellow-400 text-black text-lg font-medium tracking-wide rounded-md ml-2"
          >
            <div className="relative h-[50%] aspect-square flex justify-center items-center">
              {isUploading ? (
                <Spinner size="md" color="current" />
              ) : (
                <NextImage
                  src="/Send.svg"
                  fill={true}
                  alt="send"
                  className="object-cover w-full h-full"
                />
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
