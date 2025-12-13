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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a receipt OCR system for Azerbaijani receipts. Extract ALL information from this receipt image.

CRITICAL RULES:
1. Clean item names: Remove ALL ƏDV codes, quotes, asterisks, and prefixes (like *ƏDV:, *ƏDV dən azad, etc.)
2. Fix OCR quantity errors: 1000→1.00, 2000→2.00, etc. Quantities should be realistic (usually 1.00-10.00)
3. Fix unrealistic prices: If unit_price seems wrong, recalculate from line_total ÷ quantity
4. line_total MUST equal quantity × unit_price exactly
5. Extract the filename from the uploaded file

Return a JSON array where EACH ITEM is a separate object with ALL these fields:
{
  "filename": "the uploaded filename",
  "store_name": "Store name (e.g., GRAND MARKET)",
  "store_address": "Full store address",
  "store_code": "Obyektin kodu / Receipt code",
  "taxpayer_name": "Vergi ödəyicisinin adı / Taxpayer name",
  "tax_id": "VÖEN number",
  "receipt_number": "Satış çeki № / Receipt number",
  "cashier_name": "Kassir / Cashier name",
  "date": "DD.MM.YYYY format",
  "time": "HH:MM:SS format",
  "item_name": "CLEAN item name (NO ƏDV codes or prefixes)",
  "quantity": "Realistic quantity as decimal (e.g., 1.00, 2.00)",
  "unit_price": "Price per unit in AZN (as decimal)",
  "line_total": "quantity × unit_price (must match exactly)",
  "subtotal": "Cami / Total amount before tax",
  "vat_18_percent": "ƏDV 18% amount",
  "total_tax": "Toplam vergi / Total tax",
  "cashless_payment": "Nağdsız / Cashless payment",
  "cash_payment": "Nağd / Cash payment",
  "bonus_payment": "Bonus payment",
  "advance_payment": "Avans (beh) / Advance payment",
  "credit_payment": "Nisya / Credit payment",
  "queue_number": "Növbə arzında vuruluş çek sayı / Queue number",
  "cash_register_model": "NKA-nin modeli / Cash register model",
  "cash_register_serial": "KLR H-POS serial or NCR RealPOS model",
  "fiscal_id": "Fiskal ID",
  "fiscal_registration": "NMQ-nin qeydiyyat nömrəsi / Fiscal registration number",
  "refund_amount": "Geri qaytarılan məbləğ / Refund amount (if any)",
  "refund_date": "Geri qaytarılma tarixi / Refund date (if any)",
  "refund_time": "Geri qaytarılma vaxtı / Refund time (if any)"
}

IMPORTANT: Return a JSON array with one object per item. Same-for-all-items fields (store info, totals, etc.) should be repeated in each object.

Return ONLY valid JSON array, no markdown, no other text.`;

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
      // Look for JSON array first
      const arrayMatch = extractedText.match(/\[[\s\S]*\]/);
      if (arrayMatch) {
        receiptData = JSON.parse(arrayMatch[0]);
      } else {
        // Fallback to object match
        const objectMatch = extractedText.match(/\{[\s\S]*\}/);
        if (objectMatch) {
          receiptData = JSON.parse(objectMatch[0]);
        } else {
          receiptData = JSON.parse(extractedText);
        }
      }

      // Add filename to each item if it's an array
      if (Array.isArray(receiptData)) {
        receiptData = receiptData.map((item: any) => ({
          ...item,
          filename: file.name,
        }));
      } else {
        receiptData.filename = file.name;
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
