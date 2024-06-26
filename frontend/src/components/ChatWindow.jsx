import React, { useState, useEffect } from 'react'
import MessageInput from './MessageInput'
import Messages from './Messages'
import axios from 'axios'
import { TiMessages } from 'react-icons/ti'
import useConversation from '../zustand/useConversation'


const ChatWindow = () => {
  // States to hold the selected conversation and the user to send the message
  const { selectedConversation, setSelectedConversation, setMessages } = useConversation()
  const [toUser, setToUser] = useState('')

  // Set the clicked conversation as the selected conversation
  useEffect(() => {
    if (selectedConversation) {
      setToUser(selectedConversation.username)
    }
  }, [selectedConversation])
  

  // Render the chat window
  return (
    <div className='md:min-w-[450px] flex flex-col'>
      {!selectedConversation ? (
        <div className='flex flex-col items-center justify-center flex-grow'>
          <h1 className='text-4xl text-gray-800 font-semibold'>Select a chat</h1>
          <TiMessages className='text-8xl text-gray-800' />
        </div>
      ) : (
        <>
        <div className='bg-slate-400 px-4 py-2 mb-1'>
          <span className='label-text'>To:</span>{" "}
          <span className='text-gray-800 font-semibold'>{toUser}</span>
        </div>

        <Messages />
        <MessageInput />
      </>
      )}
    </div>
  )
}

export default ChatWindow