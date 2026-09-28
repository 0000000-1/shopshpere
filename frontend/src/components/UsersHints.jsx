import { useState } from 'react'

const UsersHints = () => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div 
            className={'flex fixed left-0 bg-blue-600 h-auto p-4 border-2 border-l-0 text-white cursor-pointer rounded-r-2xl transform transition-all duration-300 ease-in-out overflow-hidden'}
            style={{ width: isOpen ? '200px' : '75px' }} 
            onMouseEnter={()=> setIsOpen(true)}
            onMouseLeave={()=> setIsOpen(false)}
        >
            {isOpen ? (
                <div className="whitespace-nowrap overflow-hidden gap-2 flex flex-col" >
                    <p className='text-md font-extrabold'>Users</p>
                    <div className='flex flex-col'>
                        <span>admin@gmail.com</span>
                        <span className='text-sm opacity-75'>1234567890</span>
                    </div>
                    <div className='flex flex-col'>
                        <span>user@gmail.com</span>
                        <span className='text-sm opacity-75'>1234567890</span>
                    </div>
                </div>
            ) : (
                <p className='text-md font-extrabold'>hints!</p>
            )}
        </div>
    )
}

export default UsersHints
