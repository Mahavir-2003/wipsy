import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const ChatBox = ({chatData}) => {
  return (
    <div className='bg-transparent min-h-full flex flex-col  justify-start items-center chat-history w-full border-[0px] border-[#fafafa]/15 rounded-md px-3 py-2 overflow-x-hidden overflow-y-auto h-[200px]'>
      {chatData.map((chat, index) => (
        <div key={index} className='flex justify-start items-center w-full mb-2'>
          <div className='flex flex-col justify-center items-start ml-2'>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{chat.message}</ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ChatBox