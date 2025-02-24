import React, { useEffect, useState, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Player } from "@remotion/player";
import RemotionVideo from './RemotionVideo';
import { Button } from '@/components/ui/button';
import { db } from '@/config/db';
import { VideoData } from '@/config/schema';
import { eq } from 'drizzle-orm';
import { useRouter } from 'next/navigation';

function PlayerDialog({ playVideo, videoId }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [videoData, setVideoData] = useState();
    const [durationInFrame, setDurationInFrame] = useState(100);

    const router = useRouter();

    useEffect(() => {
        if (playVideo) {
            setOpenDialog(true);
            videoId && GetVideoData();
        }
    }, [playVideo]);

    const GetVideoData = async () => {
        const result = await db.select().from(VideoData).where(eq(VideoData.id, videoId));
        console.log(result);
        setVideoData(result[0]);
    };

    // Wrap setDurationInFrame inside useCallback
    const updateDuration = useCallback((frameValue) => {
        setDurationInFrame(Math.round(frameValue));
    }, []);

    return (
        <Dialog open={openDialog}>
            <DialogContent className="bg-white flex flex-col items-center">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold my-5">
                        Your Video is Ready
                    </DialogTitle>
                    <div>
                        <Player
                            component={RemotionVideo}
                            durationInFrames={Math.round(durationInFrame)}
                            compositionWidth={300}
                            compositionHeight={450}
                            fps={30}
                            controls={true}
                            inputProps={{
                                ...videoData,
                                setDurationInFrame: updateDuration, // Using memoized callback
                            }}
                        />
                    </div>
                    <div className='flex gap-10 mt-10'>
                        <Button variant="ghost" onClick={() => { router.replace('/dashboard'); setOpenDialog(false) }}>Cancel</Button>
                        <Button>Export</Button>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}

export default PlayerDialog;
