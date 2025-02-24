"use client";
import React, { useContext, useEffect, useState } from 'react'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle';
import SelectDuration from './_components/SelectDuration';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import CustomLoading from './_components/CustomLoading';
import {v4 as uuidv4 } from 'uuid';
import { VideoDataContext } from '@/app/_context/VideoDataContext';
import { Users, VideoData } from '@/config/schema';
import { useUser } from '@clerk/nextjs';
import {db} from '@/config/db';
import PlayerDialog from '../_components/PlayerDialog';
import { UserDetailContext } from '@/app/_context/UserDetailContext';
import { toast } from 'sonner';
import { eq } from 'drizzle-orm';


function CreateNew() {

    const [formData, setFormData] = useState([]);
    const[loading,setLoading] = useState(false);
    const[videoScript,setVideoScript] = useState();
    const [audioFileUrl, setAudioFileUrl] = useState();
    const [caption,setCaption] = useState();
    const [imageList,setImageList] = useState()
    const [playVideo,setPlayVideo] = useState(false);
    const [videoId,setVideoId] = useState();
   

    const {videoData,setVideoData} = useContext(VideoDataContext);
    // const {userDetail,setUserDetail} = useContext(UserDetailContext);
    const {user} = useUser();

    const onHandleInputChange = (fieldName, fieldValue)=>{
        console.log(fieldName, fieldValue);

        setFormData(prev=>({
            ...prev,
            [fieldName]:fieldValue
        }))
    }

    const onCreateClickHandler =()=>{
        // if(!userDetail?.credits>0){
        //     toast("You don't have enough Credits")
        //     return ;
        // }
        GetVideoScript();
    }
    // Get Video Script

    const GetVideoScript = async ()=>{
        setLoading(true);
        const prompt='Write a script to generate '+formData.duration+' video on topic :'+formData.topic+' along with AI image prompt in '+formData.imageStyle+' format for each scene and give me result in JSON format with imagePrompt and Content Text as field'
        console.log(prompt);
        const resp = await axios.post('/api/get-video-script',{
            prompt:prompt
        })
            if(resp.data.result){
                setVideoData(prev => ({
                    ...prev,
                    'videoScript': resp.data.result || []
                }));
                console.log("API Response (GetVideoScript):", resp.data);
            setVideoScript(resp.data.result);
            GenerateAudioFile(resp.data.result);
        }
        setLoading(false);
    }

/**
 * Generate Audio File and Save to Cloudinary storage
 * @param {*} videoScriptData 
 */

const GenerateAudioFile = async (videoScriptData) =>{
    setLoading(true)
    let script ='';
    const id = uuidv4()
    const text = videoScriptData.map(scene => scene.contentText).join(' ');
    const resp =  await axios.post('/api/generate-audio',{
        text:text,
        id:id
    });
        setVideoData(prev=>({
            ...prev,
            'audioFileUrl':resp.data.result
        }))
        setAudioFileUrl(resp.data.result);
    
    setLoading(false);
    resp.data.result && GenerateAudioCaption(resp.data.result,videoScriptData)
}

/**
 * Use to Generate  Caption from Audio File 
 * @param {*} videoScriptData 
 */

const GenerateAudioCaption = async (fileUrl, videoScriptData) => {
    setLoading(true);

    try {
        const resp = await axios.post('/api/generate-caption', { audioFileUrl: fileUrl });

        console.log("Caption API Response:", resp.data); 

        if (!resp.data.result) {
            console.error("Error: Captions are null or undefined");
            return;
        }

        setVideoData(prev => ({
            ...prev,
            captions: resp.data.result, 
        }));

        setCaption(resp.data.result);

        GenerateImage(videoScriptData);
    } catch (error) {
        console.error("Error fetching captions:", error);
    } finally {
        setLoading(false);
    }
};


/**
 * Generate AI Images and Save to Cloudinary storage
 * @param {*} videoScriptData 
 */


const GenerateImage = async (videoScriptData) => {
    setLoading(true);
    let images = [];

    for (const element of videoScriptData) {
        try {
            const response = await axios.post('/api/generate-image', {
                prompt: element?.imagePrompt 
            });

            console.log("Backend Response:", response.data); 
            if (response.data.imageList) {
                images.push(...response.data.imageList); 
            }
        } catch (error) {
            console.error("Error generating image:", error);
        }
    }

    setVideoData(prev => ({
        ...prev,
        imageList: images 
    }));

    console.log('Final Array:', images, videoScript, audioFileUrl, caption);
    
    setImageList(images);
    setLoading(false);
};



useEffect(() => {
    console.log("Updated videoData:", videoData);

    if (Object.keys(videoData).length === 4) {
        SaveVideoData(videoData);
    }
}, [videoData]);




const SaveVideoData= async(videoData)=>{
        setLoading(true);

        const result = await db.insert(VideoData).values({
            script:videoData?.videoScript,
            audioFileUrl:videoData?.audioFileUrl,
            captions:videoData?.captions || {},
            imageList: videoData?.imageList,
            createdBy:user?.primaryEmailAddress?.emailAddress
        }).returning({id:VideoData?.id})

        // await UpdateUserCredits()
        setVideoId(result[0].id)
        setPlayVideo(true);
        console.log(result);
        setLoading(false);
}
/**
 * Use to update users credits
 */

// const UpdateUserCredits= async ()=>{
//     const result = await db.update(Users).set({
//         credits:userDetail?.credits-10
//     }).where(eq(Users?.email,user?.primaryEmailAddress?.emailAddress))
//     console.log(result);
//     setUserDetail(prev=>({
//         ...prev,
//         'credits':userDetail?.credits-10
//     }))

//     // setVideoData(null);
// }



  return (
    <div className='md:px-20'>
      <h2 className='font-bold text-4xl text-primary text-center'>Create New</h2>

      <div className='mt-10 shadow-md p-10'>
        {/* Select Topic */}
        <SelectTopic onUserSelect={onHandleInputChange}/>
        {/* Select Style */}
        <SelectStyle onUserSelect={onHandleInputChange}/>
        {/* Duration */}
        <SelectDuration onUserSelect={onHandleInputChange}/>
        {/* Create Button */}
        
        <Button className='mt-10 w-full' onClick={onCreateClickHandler}>Create Short Video</Button>
      </div>
      <CustomLoading loading={loading}/>
      <PlayerDialog playVideo={playVideo} videoId={videoId}/>
    </div>
  )
}

export default CreateNew
