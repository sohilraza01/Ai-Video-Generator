import React, {useEffect} from 'react'
import { AbsoluteFill, Audio, Img, interpolate, Sequence, useCurrentFrame, useVideoConfig } from 'remotion'

function RemotionVideo({script,imageList,audioFileUrl,captions,setDurationInFrame}) {

    const {fps} = useVideoConfig();
    const frame = useCurrentFrame();
    const getDurationFrame =() =>{
        setDurationInFrame(captions[captions?.length-1]?.end/1000*fps);
        if (!captions || captions.length === 0) return 120;
        return captions[captions?.length-1]?.end/1000*fps;
    }

    const getCurrentCaption = () =>{
        const currentTime=frame/30*1000 //Convert frame number to milliseconds (30fps)
        const currentCaption = captions.find((word)=> currentTime>=word.start && currentTime<= word.end)
        return currentCaption?currentCaption?.text:'';
    }

    useEffect(() => {
        if (captions && captions.length > 0) {
            const lastCaption = captions[captions.length - 1];
            if (lastCaption && typeof lastCaption.end === 'number') {
                setDurationInFrame(Math.round((lastCaption.end / 1000) * 30)); 
            }
        }
    }, [captions, setDurationInFrame]);
    

  return (
    <AbsoluteFill className="bg-black">
        {imageList?.map((item,index)=>
            {
                const startTime  = (index*getDurationFrame())/imageList.length
                const duration = getDurationFrame();
                const scale =(index)=> interpolate(
                    frame,
                    [startTime,startTime+duration/2,startTime+duration], //Zoom in Zoom out
                    index%2==0 ? [1,1.8,1]: [1.8,1,1.8],
                    {extrapolateLeft:'clamp',extrapolateRight:'clamp'}
                )
                return (
            <div key={index}>
                <Sequence
                from={startTime} durationInFrames={getDurationFrame()}
                >
                    <AbsoluteFill style={{justifyContent:"center",alignItems:'center'}}>
                    <Img
                    src={item}
                    style={{
                        width:'100%',
                        height:'100%',
                        objectFit:'cover',
                        transform:`scale(${scale(index)})`
                    }}
                    />
                <AbsoluteFill style={{
                    color:'white',
                    justifyContent:'center',
                    top:undefined,
                    bottom:50,
                    height:150,
                    textAlign:'center',
                    width:'100%'
                }}>
                    <h2 className='text-2xl'>{getCurrentCaption()}</h2>
                    </AbsoluteFill>
                </AbsoluteFill>
                </Sequence>
            </div>
            )})}
        {audioFileUrl && <Audio src={audioFileUrl} />}
    </AbsoluteFill>
  )
}

export default RemotionVideo





