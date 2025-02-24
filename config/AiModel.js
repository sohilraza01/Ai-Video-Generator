const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  

   export  const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "write a script to generate 30 seconds video on topic : interesting historical story along with AI image prompt in Realistic format for each scene and give me result in JSON format with imagePrompt and Content Text as field\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, I can help you create a script for a 30-second video about an interesting historical story, formatted in JSON with image prompts and corresponding text.  I'll choose the story of the Great Molasses Flood of 1919 in Boston. I will focus on breaking it into short scenes suitable for a short video.\n\n```json\n[\n  {\n    \"imagePrompt\": \"A bustling Boston street scene, winter 1919. Horse-drawn carriages and early automobiles mingle. Snow is lightly falling.  Realistic painting, detailed, early 20th-century atmosphere.\",\n    \"contentText\": \"Boston, January 1919. A city gripped by a bitter cold.\"\n  },\n  {\n    \"imagePrompt\": \"A massive, rusty molasses tank looms over a residential neighborhood in Boston. Dark molasses stains the side.  Realistic photograph, slightly distorted perspective to emphasize size.\",\n    \"contentText\": \"A colossal tank of molasses held millions of gallons near the North End.\"\n  },\n  {\n    \"imagePrompt\": \"The molasses tank is bursting open with a roar.  A wave of dark, thick molasses is surging outwards, destroying buildings and cars. Dramatic and chaotic scene.  Realistic painting, high dynamic range.\",\n    \"contentText\": \"Suddenly, the tank exploded.  A wave of molasses surged through the streets.\"\n  },\n  {\n    \"imagePrompt\": \"People are struggling to escape the molasses flood, some are being swept away. Buildings are collapsing.  A dark and desperate scene. Realistic photograph, focus on human emotion.\",\n    \"contentText\": \"Buildings crumbled. People were swept away by the sticky tide.\"\n  },\n  {\n    \"imagePrompt\": \"Aftermath of the flood.  Molasses covers everything.  Rescue workers are searching for survivors.  Somber, realistic painting, muted colors.\",\n    \"contentText\": \"The aftermath was a scene of utter devastation.\"\n  },\n  {\n    \"imagePrompt\": \"Close-up of a newspaper headline: \\\"Molasses Flood Kills 21\\\".  Realistic photograph, vintage newspaper texture.\",\n    \"contentText\": \"Twenty-one lives were lost in the disaster.\"\n  },\n  {\n    \"imagePrompt\": \"Modern-day Boston street scene. A small plaque commemorates the Great Molasses Flood. Subtle, understated. Realistic photograph.\",\n    \"contentText\": \"A reminder of the day Boston was drowned in molasses.\"\n  }\n]\n```\n\n**Explanation and Considerations:**\n\n*   **JSON Format:** The data is structured as a JSON array. Each object in the array represents a scene in the video. Each scene has two keys: `imagePrompt` and `contentText`.\n*   **Image Prompts:** The `imagePrompt` fields provide detailed descriptions that AI image generators can use to create visuals for each scene. I have tried to include details about setting, time period, composition, and artistic style to guide the AI.  \"Realistic\" is a key term.\n*   **Content Text:** The `contentText` fields provide the narration or text that will appear on screen during each scene. The text is concise to fit a short video format.\n*   **Story Choice:** The Great Molasses Flood is a relatively short and visually interesting historical event, suitable for a 30-second treatment.\n*   **Video Length:**  Each scene will need to be on screen for roughly 4-5 seconds to fit the 30-second timeframe. Adjust the length and number of scenes according to your needs.\n*   **Music and Sound Effects:**  Remember to add appropriate music and sound effects to enhance the video's impact.\n\n**How to Use This:**\n\n1.  **Copy the JSON data** into a file (e.g., `molasses_video.json`).\n2.  **Use an AI Image Generator:**  Feed each `imagePrompt` to an AI image generation tool (like Midjourney, DALL-E 2, Stable Diffusion, etc.).\n3.  **Assemble the Video:** Combine the generated images with the corresponding text in a video editing program (e.g., Adobe Premiere Pro, Final Cut Pro, DaVinci Resolve, or even simpler online video editors).\n4.  **Add Music and Sound:** Add music and appropriate sound effects (e.g., explosion sound for the tank bursting, crowd sounds, flowing molasses).\n5.  **Adjust Timing:** Fine-tune the timing of each scene to fit the 30-second limit.\n6.  **Consider Animations:** For more dynamism, you could add subtle animations to the images (e.g., zooming, panning, or subtle effects to simulate the flow of molasses).\n\n**Important Notes for Generating AI Images:**\n\n*   Experiment with different AI image generators to see which produces the best results for your desired style.\n*   You may need to refine the image prompts based on the specific capabilities of the AI tool you are using.\n*   Be prepared to generate multiple variations of each image until you get the desired result.\n*   Pay attention to the resolution and aspect ratio of the generated images to ensure they are suitable for video use.\n* The phrase \"Realistic photography\" or \"realistic painting\" will help guide the AI towards a photorealistic style, but you might need to experiment with other keywords.\n\nI hope this is helpful.  Let me know if you have any other questions.\n"},
          ],
        },
      ],
    });
  
 