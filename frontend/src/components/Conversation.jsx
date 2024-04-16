import React from 'react'
import useConversation from '../zustand/useConversation'

const Conversation = ({conversation, lastIdx}) => {
  const {selectedConversation, setSelectedConversation} = useConversation()

  const isSelected = selectedConversation?._id === conversation._id;
  return <>
    <div className={`flex gap-2 items-center hover:bg-teal-500 rounded p-2 py-1 cursor-pointer
      ${isSelected ? 'bg-teal-500' : ''}
    `} onClick={() => setSelectedConversation(conversation)}>
      <div classname='flex flex-col flex-1'>
        <div className='flex gap-3 justify-between'>
          <p className='font-semibold text-gray-800'>{conversation.username}</p>
        </div>
      </div>
    </div>
    {!lastIdx && <div className='divider my-0 py-0 h-1'></div>}
  </>
}

export default Conversation