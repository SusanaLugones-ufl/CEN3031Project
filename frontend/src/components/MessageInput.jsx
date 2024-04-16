import React from 'react'
import { BsSend } from 'react-icons/bs'

const MessageInput = () => {
    return (
        <form className='px-4 my-3'>
            <div className='w-full relative'>
                <input type='text' className='border text-sm rounded-lg w-full p-2.5 bg-gray-200 border-gray-600 text-white' placeholder='Send a message' />
                <button type='submit' className='absolute flex items-center pe-3 inset-y-0 end-0'><BsSend /></button>
            </div>
        </form>
    )
}

export default MessageInput