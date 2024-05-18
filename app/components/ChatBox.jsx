import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';

const customStyle = {
  padding: '1rem',
  width : '100%',
  borderRadius: '0.5rem',
  overflowX: 'auto',
  whiteSpace: 'pre-wrap',
  wordWrap: 'break-word',
  fontSize: '1rem',
  lineHeight: '1.5rem',
  backgroundColor: '#151515BC',
  border : '1px solid #FAFAFA2E',
}

const components = {
  code({node, inline, className, children, ...props}) {
    const match = /language-(\w+)/.exec(className || '')
    return !inline && match ? (
      <div className="relative w-full">
         <CopyToClipboard text={String(children).replace(/\n$/, '')}>
          <button className="absolute right-2 top-2 bg-gray-800 text-white p-1 rounded-md">
            <FaCopy />
          </button>
        </CopyToClipboard>
        <SyntaxHighlighter language={match[1]} style={nightOwl} customStyle={customStyle} PreTag="div" children={String(children).replace(/\n$/, '')} {...props} />
       
      </div>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }
};

const ChatBox = ({ chatData }) => {
  return (
    <div className="bg-transparent min-h-full flex flex-col justify-start items-center chat-history w-full border-[0px] border-[#fafafa]/15 rounded-md px-3 py-2 overflow-x-hidden overflow-y-auto h-[200px]">
      {chatData.map((chat, index) => (
        <div key={index} className="flex flex-col justify-start items-start w-full mb-2 ">
          <div className="flex flex-col justify-center items-start ml-2 w-full">
            <ReactMarkdown className=' w-full' remarkPlugins={[remarkGfm]} components={components}>
              {chat.message}
            </ReactMarkdown>
          </div>
          {chat.uploads.length > 0 && (
            <div className="flex flex-wrap justify-start items-center mt-2">
              {chat.uploads.map((upload, index) => (
                <div key={index} className="mr-2 mb-2">
                  {upload.type === 'image' ? (
                    <img src={upload.url} alt={upload.name} className="max-w-[200px] max-h-[200px]" />
                  ) : (
                    <a href={upload.url} download={upload.name}>
                      {upload.name}
                    </a>
                  )}
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