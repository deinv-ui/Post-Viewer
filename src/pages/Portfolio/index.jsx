import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTopGainers, fetchHighDividend, fetchStableStocks } from "@/utils/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import MainLayout from "@/layouts/MainLayout";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Portfolio() {
  // React Query v5 format
  const { data: topGainers = [], isLoading: loadingGainers } = useQuery({
    queryKey: ["topGainers"],
    queryFn: fetchTopGainers,
  });

  const { data: highDividends = [], isLoading: loadingDividends } = useQuery({
    queryKey: ["highDividends"],
    queryFn: fetchHighDividend,
  });

  const { data: stableStocks = [], isLoading: loadingStable } = useQuery({
    queryKey: ["stableStocks"],
    queryFn: fetchStableStocks,
  });

  if (loadingGainers || loadingDividends || loadingStable) return <div>Loading...</div>;

  const createChartData = (data, field) => ({
    labels: data.map((s) => s.symbol),
    datasets: [
      {
        label: field === "dividendYield" ? "Dividend %" : "Price",
        data: data.map((s) => (field === "dividendYield" ? s[field] * 100 : s[field])),
        backgroundColor: field === "dividendYield" ? "rgba(54, 162, 235, 0.5)" : "rgba(255, 99, 132, 0.5)",
      },
    ],
  });

  const renderStockCards = (stocks) =>
    stocks.map((s) => (
      <div
        key={s.symbol}
        className="p-4 rounded-lg shadow-md text-white"
        style={{
          backgroundColor:
            s.regularMarketChangePercent > 0
              ? "#16a34a" // green for positive
              : s.regularMarketChangePercent < 0
              ? "#dc2626" // red for negative
              : "#6b7280", // gray for neutral
        }}
      >
        <h3 className="font-bold">{s.symbol}</h3>
        <p>Price: ${s.regularMarketPrice?.toFixed(2)}</p>
        <p>Change: {s.regularMarketChangePercent?.toFixed(2)}%</p>
        {s.dividendYield && <p>Dividend: {(s.dividendYield * 100).toFixed(2)}%</p>}
      </div>
    ));

  return (
    <MainLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Create New Portfolio
          </button>
        </div>

        {/* Top Gainers */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Top Gainers</h2>
          <Bar data={createChartData(topGainers, "regularMarketPrice")} />
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {renderStockCards(topGainers)}
          </div>
        </section>

        {/* High Dividend Stocks */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">High Dividend Stocks</h2>
          <Bar data={createChartData(highDividends, "dividendYield")} />
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {renderStockCards(highDividends)}
          </div>
        </section>

        {/* Stable Stocks */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Stable Stocks</h2>
          <Bar data={createChartData(stableStocks, "regularMarketPrice")} />
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {renderStockCards(stableStocks)}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
