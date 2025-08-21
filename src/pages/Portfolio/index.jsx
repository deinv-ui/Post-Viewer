import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTopGainers, fetchHighDividend, fetchStableStocks } from "@/utils/api";
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
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiShield,
  FiSearch,
  FiX,
} from "react-icons/fi";
import MainLayout from "@/layouts/MainLayout";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Portfolio() {
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

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [portfolioName, setPortfolioName] = useState("");
  const [portfolioDesc, setPortfolioDesc] = useState("");

  if (loadingGainers || loadingDividends || loadingStable) {
    return <div className="flex items-center justify-center h-screen text-lg">Loading...</div>;
  }

  const createChartData = (data, field) => ({
    labels: data.map((s) => s.symbol),
    datasets: [
      {
        label: field === "dividendYield" ? "Dividend %" : "Price (RM)",
        data: data.map((s) =>
          field === "dividendYield" ? s[field] * 100 : s[field]
        ),
        backgroundColor:
          field === "dividendYield"
            ? "rgba(54, 162, 235, 0.7)"
            : "rgba(34, 197, 94, 0.7)",
        borderRadius: 8,
      },
    ],
  });

  const StockCard = ({ s }) => {
    const positive = s.regularMarketChangePercent > 0;
    return (
      <div className="p-5 rounded-2xl shadow-lg transition-transform transform hover:-translate-y-1 hover:shadow-xl bg-white text-gray-900">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-lg">
            {s.name} <span className="text-gray-500">({s.symbol})</span>
          </h3>
          {positive ? (
            <FiTrendingUp className="text-green-500 text-xl" />
          ) : (
            <FiTrendingDown className="text-red-500 text-xl" />
          )}
        </div>
        <p className="text-2xl font-semibold">
          RM {s.regularMarketPrice?.toFixed(2)}
        </p>
        <p
          className={`font-medium ${
            positive ? "text-green-600" : "text-red-600"
          }`}
        >
          {s.regularMarketChangePercent?.toFixed(2)}%
        </p>
        {s.dividendYield && (
          <div className="flex items-center gap-2 mt-2 text-blue-600">
            <FiDollarSign className="text-lg" />{" "}
            {(s.dividendYield * 100).toFixed(2)}% Yield
          </div>
        )}
        {s.beta !== undefined && (
          <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
            <FiShield className="text-base" /> Beta: {s.beta.toFixed(2)}
          </div>
        )}
      </div>
    );
  };

  // 🔍 filter stocks based on search
  const filterStocks = (stocks) =>
    stocks.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.symbol.toLowerCase().includes(search.toLowerCase())
    );

  const handleSavePortfolio = () => {
    console.log("New Portfolio:", { portfolioName, portfolioDesc });
    setShowModal(false);
    setPortfolioName("");
    setPortfolioDesc("");
  };

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header with search + button */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Portfolio Overview</h1>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow w-full md:w-96">
            <FiSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search stocks by name or symbol..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none bg-transparent"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700"
          >
            + New Portfolio
          </button>
        </div>

        {/* Top Gainers */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">🚀 Top Gainers</h2>
          <div className="bg-white rounded-2xl shadow p-6">
            <Bar data={createChartData(topGainers, "regularMarketPrice")} />
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filterStocks(topGainers).map((s) => (
              <StockCard key={s.symbol} s={s} />
            ))}
          </div>
        </section>

        {/* High Dividend Stocks */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">💰 High Dividend Stocks</h2>
          <div className="bg-white rounded-2xl shadow p-6">
            <Bar data={createChartData(highDividends, "dividendYield")} />
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filterStocks(highDividends).map((s) => (
              <StockCard key={s.symbol} s={s} />
            ))}
          </div>
        </section>

        {/* Stable Stocks */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">🛡️ Stable Stocks</h2>
          <div className="bg-white rounded-2xl shadow p-6">
            <Bar data={createChartData(stableStocks, "regularMarketPrice")} />
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filterStocks(stableStocks).map((s) => (
              <StockCard key={s.symbol} s={s} />
            ))}
          </div>
        </section>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FiX size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Create New Portfolio</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Portfolio Name
              </label>
              <input
                type="text"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="My Growth Portfolio"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={portfolioDesc}
                onChange={(e) => setPortfolioDesc(e.target.value)}
                className="mt-1 w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Short description..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePortfolio}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
