import React, { useContext } from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { UserDetailContext } from '@/app/_context/UserDetailContext';
function Header() {
  const {userDetail,setUserDetail} = useContext(UserDetailContext);
  return (
    <div className="p-3 px-5 sticky w-full top-0 bg-white flex items-center justify-between shadow-md">
      <div className="flex  gap-3 items-center">
        <Image src={'/logo.svg'} alt='logo' width={30} height={30} />
        <h2 className='font-bold text-xl'>Ai Short Video</h2>
      </div>
      <div className="flex gap-3 items-center">
        <div className='flex gap-1 items-center'>
          <Image src={'/star.png'} width={20} height={20} alt='star'/>
          <h2>{userDetail?.credits}</h2>
        </div>
        <Button>Dashboad</Button>
        <UserButton/>
      </div>
    </div>
  )
}

export default Header
