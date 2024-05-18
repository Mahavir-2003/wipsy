import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CopyToClipboard from 'react-copy-to-clipboard';
import { GoCopy } from "react-icons/go";

const customStyle = {
  width : '100%',
  overflowX: 'auto',
  whiteSpace: 'pre-wrap',
  wordWrap: 'break-word',
  fontSize: '1rem',
  lineHeight: '1.5rem',
  backgroundColor: 'transparent',
}

const components = {
  code({node, inline, className, children, ...props}) {
    const match = /language-(\w+)/.exec(className || '')
    return !inline && match ? (
      <div className="relative w-full bg-[#1515156e] rounded-md border border-[#fafafa]/15 overflow-hidden">
        <div className='w-full flex justify-between items-center py-2 px-4 border-b border-[#fafafa]/15'>
          <p>{match[1]}</p>
         <CopyToClipboard onCopy={
          () => alert('Code Copied')
         } text={String(children).replace(/\n$/, '')}>
          <button>
          <GoCopy />
          </button>
        </CopyToClipboard>
        </div>
        <div className=' w-full px-2'>
        <SyntaxHighlighter className="code-block" language={match[1]} style={nightOwl} customStyle={customStyle} PreTag="div" children={String(children).replace(/\n$/, '')} {...props} />
        </div>
       
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