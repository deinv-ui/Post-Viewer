import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function PortfolioChart() {
  // Mock holdings (replace later with DB/API data)
  const myHoldings = [
    { symbol: "AAPL", name: "Apple", qty: 10, avgCost: 150, price: 165 },
    { symbol: "MSFT", name: "Microsoft", qty: 5, avgCost: 280, price: 300 },
    { symbol: "TSLA", name: "Tesla", qty: 8, avgCost: 700, price: 680 },
  ];

  // Calculate totals
  const totalValue = myHoldings.reduce((acc, h) => acc + h.qty * h.price, 0);
  const totalCost = myHoldings.reduce((acc, h) => acc + h.qty * h.avgCost, 0);
  const totalPL = totalValue - totalCost;
  const totalPLPercent = (totalPL / totalCost) * 100;

  // Chart data
  const chartData = {
    labels: myHoldings.map((h) => h.symbol),
    datasets: [
      {
        label: "Current Value",
        data: myHoldings.map((h) => h.qty * h.price),
        backgroundColor: "rgba(34,197,94,0.7)",
        borderRadius: 8,
      },
      {
        label: "Invested",
        data: myHoldings.map((h) => h.qty * h.avgCost),
        backgroundColor: "rgba(54,162,235,0.7)",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">📊 My Portfolio</h2>

      {/* Summary cards */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-gray-500">Total Value</p>
            <p className="text-2xl font-bold">RM {totalValue.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-500">P&amp;L</p>
            <p
              className={`text-2xl font-bold ${
                totalPL >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {totalPL >= 0 ? "+" : ""}RM {totalPL.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Return %</p>
            <p
              className={`text-2xl font-bold ${
                totalPLPercent >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {totalPLPercent.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Portfolio chart */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <Bar data={chartData} />
      </div>

      {/* Holdings table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-2xl shadow">
          <thead>
            <tr className="text-left border-b">
              <th className="p-4">Stock</th>
              <th className="p-4">Qty</th>
              <th className="p-4">Avg Cost</th>
              <th className="p-4">Current Price</th>
              <th className="p-4">P&amp;L</th>
            </tr>
          </thead>
          <tbody>
            {myHoldings.map((h) => {
              const pl = h.qty * (h.price - h.avgCost);
              const plColor = pl >= 0 ? "text-green-600" : "text-red-600";
              return (
                <tr key={h.symbol} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-semibold">
                    {h.name} ({h.symbol})
                  </td>
                  <td className="p-4">{h.qty}</td>
                  <td className="p-4">RM {h.avgCost.toFixed(2)}</td>
                  <td className="p-4">RM {h.price.toFixed(2)}</td>
                  <td className={`p-4 ${plColor}`}>
                    {pl >= 0 ? "+" : ""}RM {pl.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
