import { HfInference } from "@huggingface/inference";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const prompt = body.prompt;
        const numImages = body.numImages || 3;

        if (!prompt) {
            throw new Error("Prompt is missing or undefined");
        }

        const client = new HfInference(process.env.API_TOKEN);
        const model = "stabilityai/stable-diffusion-2";

        let imageList = [];

        for (let i = 0; i < numImages; i++) {
            console.log(`Generating Image ${i + 1}...`);

            const imageBlob = await client.textToImage({
                model: model,
                inputs: prompt,
                parameters: {
                    guidance_scale: 7.5,
                    num_inference_steps: 50
                }
            });

            const imageBuffer = await imageBlob.arrayBuffer();
            const base64Image = Buffer.from(imageBuffer).toString("base64");

            // Upload to Cloudinary
            const cloudinaryUrl = await uploadToCloudinary(base64Image);
            imageList.push(cloudinaryUrl);
        }

        console.log("Generated Images:");

        return NextResponse.json({ imageList });

    } catch (error) {
        console.error("Image Generation Error:", error);
        return NextResponse.json({ error: error.message });
    }
}

// Upload to Cloudinary
const uploadToCloudinary = async (base64Image) => {
    try {
        const cloudinaryApi = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
        const formData = new FormData();

        formData.append("file", `data:image/png;base64,${base64Image}`);
        formData.append("upload_preset", "sohilraza");

        const response = await axios.post(cloudinaryApi, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data.secure_url;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("Failed to upload image to Cloudinary");
    }
};
