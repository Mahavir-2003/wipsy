import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import CopyToClipboard from "react-copy-to-clipboard";
import { GoCopy } from "react-icons/go";
import { GoDownload } from "react-icons/go";
import toast from "react-hot-toast";

const customStyle = {
  width: "100%",
  overflowX: "auto",
  whiteSpace: "pre-wrap",
  wordWrap: "break-word",
  fontSize: "1rem",
  lineHeight: "1.5rem",
  backgroundColor: "transparent",
};

const components = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <div className="relative w-full bg-[#1515156e] rounded-md border border-[#fafafa]/15 overflow-hidden">
        <div className="w-full flex justify-between items-center py-2 px-4 border-b border-[#fafafa]/15">
          <p>{match[1]}</p>
          <CopyToClipboard
            className="hover:bg-[#fafafa]/15 p-2 rounded-md"
            onCopy={() => {
              toast.success("Copied to Clipboard");
            }}
            text={String(children).replace(/\n$/, "")}
          >
            <button>
              <GoCopy />
            </button>
          </CopyToClipboard>
        </div>
        <div className=" w-full px-2">
          <SyntaxHighlighter
            className="code-block"
            showLineNumbers={true}
            language={match[1]}
            style={nightOwl}
            customStyle={customStyle}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      </div>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  p: ({ node, ...props }) => {
    return (
      <span className="whitespace-pre-wrap" {...props} />
    );
  },
};

const downloadFile = async (url, name) => {
  try {
    // Fetch the image data
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.blob();

    // Create an object URL for the image data
    const objectUrl = window.URL.createObjectURL(data);

    // Create a link and simulate a click to download the image
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = name;
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(objectUrl);

    toast.success("File Downloaded");
  } catch (error) {
    console.error("An error occurred while downloading the file:", error);
    toast.error("An error occurred while downloading the file.");
  }
};
const ChatBox = ({ chatData }) => {
  return (
    <div className="bg-transparent min-h-full flex flex-col gap-y-10 justify-start items-center chat-history w-full px-3 py-2 overflow-x-hidden overflow-y-auto h-[200px]">
      {chatData.map((chat, index) => (
        <div
          key={index}
          className="flex flex-col justify-start items-start w-full"
        >
          <div className="flex flex-col justify-center items-start  w-full">
            <ReactMarkdown
              className=" w-full"
              remarkPlugins={[remarkGfm]}
              components={components}
            >
              {chat.message}
            </ReactMarkdown>
          </div>
          {chat.uploads?.length > 0 && (
            <div className="flex flex-wrap flex-row justify-start items-start mt-2 ">
              {chat.uploads.map((upload, index) => (
                <div key={upload.id} className="mr-2 mb-2 ">
                  {upload.type === "image" ? (
                    <div className="relative min-w-fit min-h-fit group ">
                      <div
                        key={upload.id}
                        onClick={() => downloadFile(upload.url, upload.name)}
                        className="absolute m-1 p-2 bg-[#151515] rounded-md right-0 bottom-0 md:opacity-0 opacity-100 group-hover:opacity-100 hover:cursor-pointer"
                      >
                        <GoDownload size={22} />
                      </div>
                      <img
                        src={upload.url}
                        alt={upload.name}
                        className="h-[200px] aspect-auto rounded-md"
                      />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatBox;
