"use client";
import { Button } from '@/components/ui/button'
import React, { useContext, useEffect, useState } from 'react'
import EmptyState from './_components/EmptyState'
import Link from 'next/link';
import { db } from '@/config/db';
import { VideoData } from '@/config/schema';
import { eq } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import VideoList from './_components/VideoList';


function Dashboard() {
  const [videoList, setVideoList] = useState([])
 
  const {user} = useUser();

  useEffect(()=>{
    user&&GetVideoList();
  },[user])
  /**
   * Used to Get User Video
   */
  const GetVideoList =async () =>{
    const result  = await db.select().from(VideoData)
    .where(eq(VideoData?.createdBy,user?.primaryEmailAddress?.emailAddress));

    console.log(result);
    setVideoList(result);
  }

  return (
    <div>
    <div className='flex items-center justify-between'>
      <h2 className='text-2xl font-bold text-primary'>Dashboard</h2>
      
      <Link href={'/dashboard/create-new'}>
      <Button>+Create New</Button>
      </Link>

    </div>

    {/* Empty State */}
    {videoList?.length==0 && <div>
      <EmptyState/>
    </div>}

      {/* List of Video */}
      <VideoList videoList={videoList} />


    </div>
  )
}

export default Dashboard
