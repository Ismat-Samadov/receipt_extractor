"use client";

interface ReceiptItem {
  name: string;
  quantity?: number;
  price: string | number;
}

interface ReceiptData {
  merchant_name?: string;
  date?: string;
  time?: string;
  items?: ReceiptItem[];
  subtotal?: string | number;
  tax?: string | number;
  total?: string | number;
  payment_method?: string;
  address?: string;
}

interface ReceiptDisplayProps {
  data: ReceiptData;
}

export default function ReceiptDisplay({ data }: ReceiptDisplayProps) {
  const formatCurrency = (value: string | number | undefined) => {
    if (value === undefined || value === null) return "N/A";
    const numValue = typeof value === "string" ? parseFloat(value.replace(/[^0-9.-]/g, "")) : value;
    return isNaN(numValue) ? value : `$${numValue.toFixed(2)}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Extracted Receipt Data
      </h2>

      <div className="space-y-6">
        {/* Merchant Info */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Merchant Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Merchant Name
              </label>
              <p className="text-gray-900 dark:text-white mt-1">
                {data.merchant_name || "N/A"}
              </p>
            </div>
            {data.address && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Address
                </label>
                <p className="text-gray-900 dark:text-white mt-1">{data.address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Transaction Info */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Transaction Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Date
              </label>
              <p className="text-gray-900 dark:text-white mt-1">{data.date || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Time
              </label>
              <p className="text-gray-900 dark:text-white mt-1">{data.time || "N/A"}</p>
            </div>
            {data.payment_method && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Payment Method
                </label>
                <p className="text-gray-900 dark:text-white mt-1">{data.payment_method}</p>
              </div>
            )}
          </div>
        </div>

        {/* Items */}
        {data.items && data.items.length > 0 && (
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Items
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {data.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {item.quantity || 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right">
                        {formatCurrency(item.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Totals */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {formatCurrency(data.subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Tax:</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {formatCurrency(data.tax)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Total:
              </span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(data.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="pt-4">
          <button
            onClick={() => {
              const dataStr = JSON.stringify(data, null, 2);
              const dataBlob = new Blob([dataStr], { type: "application/json" });
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `receipt-${data.date || "data"}.json`;
              link.click();
              URL.revokeObjectURL(url);
            }}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Export as JSON
          </button>
        </div>
      </div>
    </div>
  );
}
