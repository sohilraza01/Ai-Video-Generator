import { AssemblyAI } from 'assemblyai';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { audioFileUrl } = await req.json();

        const client = new AssemblyAI({
            apiKey: process.env.CAPTION_API,
        });

        const transcript = await client.transcripts.transcribe({
            audio: audioFileUrl,
        });

        console.log("Full Transcript Response:", transcript); // Debugging

        if (!transcript || !transcript.words) {
            return NextResponse.json({ error: "No captions generated" }, { status: 400 });
        }

        return NextResponse.json({ result: transcript.words });
    } catch (error) {
        console.error("Caption Generation Error:", error);
        return NextResponse.json({ error: error.message || "Error generating captions" }, { status: 500 });
    }
}
