
import { ElevenLabsClient } from "elevenlabs";
import { NextResponse } from "next/server";
import { cloudinary } from "@/config/FirebaseConfig";
import streamifier from "streamifier";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});
console.log("Loaded API Key:", process.env.ELEVENLABS_API_KEY);

export async function POST(req) {
  try {
    const { text, id } = await req.json();

    // Generate audio as ReadableStream
    const audioStream = await elevenlabs.generate({
      voice: "Sarah",
      text: text,
      model_id: "eleven_multilingual_v2",
    });

    console.log("Audio Response Instance:", audioStream);

    // Convert ReadableStream to Buffer
    const chunks = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

  
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video", // Cloudinary stores audio as "video"
          folder: "ai-short-video-files",
          public_id: `audio_${id}`,
          use_filename: true,
          overwrite: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      // Convert buffer to readable stream and pipe it
      streamifier.createReadStream(audioBuffer).pipe(uploadStream);
    });

    const uploadResponse = await uploadPromise;

    console.log("Cloudinary Upload Response:", uploadResponse);
    return NextResponse.json({ result: uploadResponse.secure_url });
  } catch (error) {
    console.error("Error generating speech:", error);
    return NextResponse.json({ result: "Error", message: error.message }, { status: 500 });
  }
}
