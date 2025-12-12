"use client";

import { useState } from "react";
import ReceiptUploader from "@/components/ReceiptUploader";
import ReceiptDisplay from "@/components/ReceiptDisplay";

export default function Home() {
  const [receiptData, setReceiptData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    setReceiptData(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to extract receipt data");
      }

      const data = await response.json();
      setReceiptData(data);
    } catch (error) {
      console.error("Error extracting receipt:", error);
      alert("Failed to extract receipt data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-900 dark:text-white">
            Receipt Extractor
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12">
            Upload a receipt image to extract data using AI
          </p>

          <div className="grid gap-8">
            <ReceiptUploader onUpload={handleUpload} isLoading={isLoading} />
            {receiptData && <ReceiptDisplay data={receiptData} />}
          </div>
        </div>
      </main>
    </div>
  );
}
