import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { messages, roomId } = await req.json();

    console.log("🔥 /api/ai HIT — room:", roomId);

    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ Missing GEMINI_API_KEY");
      return NextResponse.json({ error: "Gemini key missing" }, { status: 500 });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    // Build a prompt from chat history
    const prompt = messages
      .map((m: any) => `${m.sender === "AI" ? "assistant" : "user"}: ${m.text}`)
      .join("\n");

    // Send to Gemini
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash", // ✅ Latest free, fast model
      contents: prompt,
    });

    // ✅ 'text' is a property, not a function
    const reply = result.text || "⚠️ AI returned empty response";

    console.log("🤖 AI Reply:", reply);

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("❌ AI ROUTE ERROR:", error);
    return NextResponse.json(
      { error: error?.message || "AI Request Failed" },
      { status: 500 }
    );
  }
}
