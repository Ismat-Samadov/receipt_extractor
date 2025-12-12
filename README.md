# Receipt Extractor

A Next.js application that extracts structured data from receipt images using Google Gemini AI (100% FREE!).

## Features

- Upload receipt images via drag-and-drop or file browser
- Extract structured data including:
  - Merchant name and address
  - Date and time of purchase
  - Itemized list with quantities and prices
  - Subtotal, tax, and total amounts
  - Payment method
- Export extracted data as JSON
- Responsive design with dark mode support
- Built with Next.js 15, TypeScript, and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A FREE Google Gemini API key (get one at [Google AI Studio](https://aistudio.google.com/app/apikey))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd receipt_extractor
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```

4. Add your FREE Google Gemini API key to `.env.local`:
```
GEMINI_API_KEY=your_actual_api_key_here
```

### Running Locally

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Deploying to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add your environment variable in the Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add `GEMINI_API_KEY` with your API key

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variable:
   - Name: `GEMINI_API_KEY`
   - Value: Your FREE Google Gemini API key
6. Click "Deploy"

## How It Works

1. **Image Upload**: Users upload a receipt image through the web interface
2. **Base64 Encoding**: The image is converted to base64 format
3. **AI Processing**: The image is sent to Google Gemini's vision model (FREE!)
4. **Data Extraction**: The AI model extracts structured data from the receipt
5. **Display Results**: The extracted data is displayed in a formatted view
6. **Export**: Users can export the data as JSON

## API Endpoints

### POST `/api/extract`

Extracts data from a receipt image.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with `file` field containing the image

**Response:**
```json
{
  "merchant_name": "Store Name",
  "date": "2024-01-15",
  "time": "14:30",
  "items": [
    {
      "name": "Item 1",
      "quantity": 2,
      "price": 10.99
    }
  ],
  "subtotal": 21.98,
  "tax": 1.98,
  "total": 23.96,
  "payment_method": "Credit Card",
  "address": "123 Main St, City, State"
}
```

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI/OCR**: Google Gemini 1.5 Flash (FREE with generous limits!)
- **Deployment**: Vercel

## Why Google Gemini?

- **100% FREE**: Generous free tier with up to 1,500 requests per day
- **No Credit Card Required**: Get started immediately
- **High Quality**: Advanced vision AI capabilities
- **Fast**: Optimized for quick responses
- **Reliable**: Backed by Google's infrastructure

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
