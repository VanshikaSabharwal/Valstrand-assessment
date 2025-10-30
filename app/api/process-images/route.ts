// app/api/process-images/route.ts
import Groq from "groq-sdk"
import sharp from "sharp"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const results: any[] = []

    // Get all image files from form data
    const imageEntries = Array.from(formData.entries()).filter(([key]) => key.startsWith("image_"))

    for (const [, file] of imageEntries) {
      if (!(file instanceof File)) continue

      // Convert file to buffer
      const buffer = await file.arrayBuffer()
      const imageBuffer = Buffer.from(buffer)

      // Resize/compress image with Sharp
      const processedBuffer = await sharp(imageBuffer)
        .resize(1200, 800, { fit: "cover", position: "center" })
        .jpeg({ quality: 80 })
        .toBuffer()

      // Convert image to Base64
      const base64Image = processedBuffer.toString("base64")
      const imageDataUrl = `data:image/jpeg;base64,${base64Image}`

      // 🧠 Generate real estate description using GROQ
// 🧠 Generate real estate description using GROQ
const descriptionCompletion = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [
    {
      role: "user",
      content: `Write a professional 2–3 sentence real estate description for a property.
Details: modern apartment with glass balcony, greenery, and good lighting.`,
    },
  ],
});

      const description = descriptionCompletion.choices[0]?.message?.content ?? "No description generated."

      // ✨ Generate social media content using GROQ
      const socialCompletion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: `Create an engaging Twitter/Instagram style caption (under 280 characters) for this property description:\n"${description}". Include emojis and a short call-to-action.`,
          },
        ],
      })

      const socialContent = socialCompletion.choices[0]?.message?.content ?? "No social content generated."

      results.push({
        image: imageDataUrl,
        description,
        socialContent,
      })
    }

    return Response.json({ results })
  } catch (error) {
    console.error("Error processing images:", error)
    return Response.json({ error: "Failed to process images" }, { status: 500 })
  }
}
