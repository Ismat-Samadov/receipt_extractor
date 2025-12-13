"use client";

interface ReceiptItem {
  filename: string;
  store_name: string;
  store_address: string;
  store_code: string;
  taxpayer_name: string;
  tax_id: string;
  receipt_number: string;
  cashier_name: string;
  date: string;
  time: string;
  item_name: string;
  quantity: string | number;
  unit_price: string | number;
  line_total: string | number;
  subtotal: string | number;
  vat_18_percent: string | number;
  total_tax: string | number;
  cashless_payment: string | number;
  cash_payment: string | number;
  bonus_payment: string | number;
  advance_payment: string | number;
  credit_payment: string | number;
  queue_number: string;
  cash_register_model: string;
  cash_register_serial: string;
  fiscal_id: string;
  fiscal_registration: string;
  refund_amount?: string | number;
  refund_date?: string;
  refund_time?: string;
}

type ReceiptData = ReceiptItem | ReceiptItem[];

interface ReceiptDisplayProps {
  data: ReceiptData;
}

export default function ReceiptDisplay({ data }: ReceiptDisplayProps) {
  const items = Array.isArray(data) ? data : [data];
  const firstItem = items[0];

  const formatCurrency = (value: string | number | undefined) => {
    if (value === undefined || value === null || value === "") return "0.00";
    const numValue = typeof value === "string" ? parseFloat(value.replace(/[^0-9.-]/g, "")) : value;
    return isNaN(numValue) ? "0.00" : numValue.toFixed(2);
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(items, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `receipt-${firstItem.receipt_number || "data"}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const headers = Object.keys(items[0]).join(",");
    const rows = items.map((item) => Object.values(item).join(",")).join("\n");
    const csv = `${headers}\n${rows}`;
    const dataBlob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `receipt-${firstItem.receipt_number || "data"}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Receipt Data Extracted
      </h2>

      <div className="space-y-6">
        {/* Store Info */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Store Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField label="Store Name" value={firstItem.store_name} />
            <InfoField label="Store Address" value={firstItem.store_address} />
            <InfoField label="Store Code" value={firstItem.store_code} />
            <InfoField label="Taxpayer Name" value={firstItem.taxpayer_name} />
            <InfoField label="Tax ID (VÖEN)" value={firstItem.tax_id} />
          </div>
        </div>

        {/* Receipt Info */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Receipt Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoField label="Receipt Number" value={firstItem.receipt_number} />
            <InfoField label="Date" value={firstItem.date} />
            <InfoField label="Time" value={firstItem.time} />
            <InfoField label="Cashier" value={firstItem.cashier_name} />
            <InfoField label="Queue Number" value={firstItem.queue_number} />
          </div>
        </div>

        {/* Items Table */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Items ({items.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Item Name
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Unit Price
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {item.item_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right">
                      {formatCurrency(item.quantity)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right">
                      {formatCurrency(item.unit_price)} AZN
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right font-medium">
                      {formatCurrency(item.line_total)} AZN
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment & Totals */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Payment Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {formatCurrency(firstItem.subtotal)} AZN
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">VAT 18%:</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {formatCurrency(firstItem.vat_18_percent)} AZN
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Tax:</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {formatCurrency(firstItem.total_tax)} AZN
              </span>
            </div>
            <div className="flex justify-between pt-2 mt-2 border-t border-gray-300 dark:border-gray-600">
              <span className="text-gray-600 dark:text-gray-400">Cashless:</span>
              <span className="text-gray-900 dark:text-white">{formatCurrency(firstItem.cashless_payment)} AZN</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Cash:</span>
              <span className="text-gray-900 dark:text-white">{formatCurrency(firstItem.cash_payment)} AZN</span>
            </div>
            {parseFloat(formatCurrency(firstItem.bonus_payment)) > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Bonus:</span>
                <span className="text-gray-900 dark:text-white">{formatCurrency(firstItem.bonus_payment)} AZN</span>
              </div>
            )}
          </div>
        </div>

        {/* System Info */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            System Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField label="Register Model" value={firstItem.cash_register_model} />
            <InfoField label="Register Serial" value={firstItem.cash_register_serial} />
            <InfoField label="Fiscal ID" value={firstItem.fiscal_id} />
            <InfoField label="Fiscal Registration" value={firstItem.fiscal_registration} />
          </div>
        </div>

        {/* Export Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <button
            onClick={exportToJSON}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Export JSON
          </button>
          <button
            onClick={exportToCSV}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </label>
      <p className="text-gray-900 dark:text-white mt-1">
        {value || "N/A"}
      </p>
    </div>
  );
}
