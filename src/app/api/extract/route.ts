import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Check for API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");
    const mimeType = file.type;

    // Initialize Google Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `You are a receipt OCR system. Extract all relevant information from this receipt image and return it as a structured JSON object with the following fields:
- merchant_name: The name of the store/merchant
- date: The date of purchase (format: YYYY-MM-DD)
- time: The time of purchase (format: HH:MM)
- items: An array of items, each with name, quantity, and price
- subtotal: The subtotal amount
- tax: The tax amount
- total: The total amount
- payment_method: The payment method used (if available)
- address: The store address (if available)

Return ONLY valid JSON, no other text.`;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };

    // Generate content with Gemini
    const result = await model.generateContent([prompt, imagePart]);
    const response = result.response;
    const extractedText = response.text();

    if (!extractedText) {
      return NextResponse.json(
        { error: "No content in response" },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let receiptData;
    try {
      // Try to extract JSON from the response (Gemini sometimes wraps in markdown)
      const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        receiptData = JSON.parse(jsonMatch[0]);
      } else {
        receiptData = JSON.parse(extractedText);
      }
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError);
      return NextResponse.json(
        { error: "Failed to parse receipt data", rawText: extractedText },
        { status: 500 }
      );
    }

    return NextResponse.json(receiptData);
  } catch (error) {
    console.error("Error processing receipt:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
