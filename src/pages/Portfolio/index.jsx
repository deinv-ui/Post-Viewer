import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchTopGainers,
  fetchHighDividend,
  fetchStableStocks,
} from "@/utils/api";
import { Bar, Line } from "react-chartjs-2";
import PortfolioChart from "@/components/Portfolio/PortfolioChart.jsx";
import DividendTracker from "@/components/Portfolio/DividendTracker.jsx";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
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
  FiPlus,
  FiCalendar,
  FiBarChart2,
} from "react-icons/fi";
import MainLayout from "@/layouts/MainLayout";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// 🔧 Utility: build chart data
const buildChartData = ({ data, field, type }) => {
  const labels = data.map((s) => s.symbol);
  const dataset = {
    label: field === "dividendYield" ? "Dividend %" : "Price (RM)",
    data: data.map((s) =>
      field === "dividendYield" ? s[field] * 100 : s[field]
    ),
    backgroundColor:
      field === "dividendYield"
        ? "rgba(54, 162, 235, 0.7)"
        : "rgba(34, 197, 94, 0.7)",
    borderColor: "rgba(34,197,94,1)",
    fill: type === "line",
    tension: type === "line" ? 0.3 : 0,
    borderRadius: type === "bar" ? 8 : 0,
  };
  return { labels, datasets: [dataset] };
};

// 📦 Reusable Card
const StockCard = ({ s }) => {
  const positive = s.regularMarketChangePercent > 0;
  return (
    <div className="p-5 rounded-2xl shadow-lg hover:-translate-y-1 hover:shadow-xl transition-transform bg-white">
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
          <FiDollarSign /> {(s.dividendYield * 100).toFixed(2)}% Yield
        </div>
      )}
      {s.beta !== undefined && (
        <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
          <FiShield /> Beta: {s.beta.toFixed(2)}
        </div>
      )}
    </div>
  );
};

// 📦 Reusable Section
const StockSection = ({ title, icon, data, field, type = "bar", search }) => {
  const ChartComponent = type === "bar" ? Bar : Line;
  const chartData = buildChartData({ data, field, type });
  const filtered = data.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">
        {icon} {title}
      </h2>
      <div className="bg-white rounded-2xl shadow p-6">
        <ChartComponent data={chartData} />
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((s) => (
          <StockCard key={s.symbol} s={s} />
        ))}
      </div>
    </section>
  );
};

export default function Portfolio() {
  // inside Portfolio component
  const [portfolios, setPortfolios] = useState([]);

  const [holdings, setHoldings] = useState([
    { stock: "", qty: "", purchasePrice: "" },
  ]);

  const addHolding = () => {
    setHoldings([...holdings, { stock: "", qty: "", purchasePrice: "" }]);
  };

  const updateHolding = (index, field, value) => {
    const newHoldings = [...holdings];
    newHoldings[index][field] = value;
    setHoldings(newHoldings);
  };

  const removeHolding = (index) => {
    setHoldings(holdings.filter((_, i) => i !== index));
  };

  // queries
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

  // state
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [portfolioName, setPortfolioName] = useState("");
  const [portfolioDesc, setPortfolioDesc] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newQty, setNewQty] = useState("");
  const [newPrice, setNewPrice] = useState("");

  // dummy dividends
  const dividendData = [
    {
      company: "MAYBANK",
      amount: 40.0,
      exDate: "2025-03-10",
      payDate: "2025-03-25",
    },
    {
      company: "TENAGA",
      amount: 25.5,
      exDate: "2025-04-05",
      payDate: "2025-04-20",
    },
    {
      company: "PETDAG",
      amount: 50.0,
      exDate: "2025-05-01",
      payDate: "2025-05-15",
    },
  ];
  const totalDividends = dividendData.reduce((sum, d) => sum + d.amount, 0);
  const dividendChartData = buildChartData({
    data: dividendData,
    field: "amount",
    type: "line",
  });
  const [portfolioData] = useState([
    { date: "2025-01-01", value: 10000 },
    { date: "2025-02-01", value: 12000 },
    { date: "2025-03-01", value: 11500 },
    { date: "2025-04-01", value: 14000 },
  ]);
  // dummy holdings
  const myHoldings = [
    { symbol: "MAYBANK", name: "Maybank", qty: 100, avgCost: 8.5, price: 9.2 },
    {
      symbol: "TENAGA",
      name: "Tenaga Nasional",
      qty: 50,
      avgCost: 9.0,
      price: 10.1,
    },
    {
      symbol: "PETDAG",
      name: "Petronas Dagangan",
      qty: 30,
      avgCost: 20.0,
      price: 22.5,
    },
  ];
  const totalValue = myHoldings.reduce((sum, h) => sum + h.qty * h.price, 0);
  const totalCost = myHoldings.reduce((sum, h) => sum + h.qty * h.avgCost, 0);
  const totalPL = totalValue - totalCost;
  const totalPLPercent = (totalPL / totalCost) * 100;

  if (loadingGainers || loadingDividends || loadingStable) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Loading...
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
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

        {/* Portfolio Summary */}
        <section className="mb-12">
          <PortfolioChart data={portfolioData} />
        </section>
        <section className="mb-12">
          {/* Dividend Tracker */}
          <DividendTracker dividends={dividendData} />
        </section>
        {/* My Portfolios */}
        {portfolios.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">My Portfolios</h2>
            <div className="space-y-4">
              {portfolios.map((p) => (
                <div key={p.id} className="p-4 rounded-xl shadow bg-white">
                  <h3 className="text-lg font-bold">{p.name}</h3>
                  <p className="text-gray-600 mb-3">{p.desc}</p>

                  <table className="w-full text-sm border">
                    <thead>
                      <tr className="bg-gray-100 text-left">
                        <th className="px-2 py-1">Stock</th>
                        <th className="px-2 py-1">Qty</th>
                        <th className="px-2 py-1">Purchase Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.holdings.map((h, i) => (
                        <tr key={i} className="border-t">
                          <td className="px-2 py-1">{h.stock}</td>
                          <td className="px-2 py-1">{h.qty}</td>
                          <td className="px-2 py-1">RM {h.purchasePrice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Market Sections */}
        <StockSection
          title="Top Gainers"
          icon="🚀"
          data={topGainers}
          field="regularMarketPrice"
          type="bar"
          search={search}
        />
        <StockSection
          title="High Dividend Stocks"
          icon="💰"
          data={highDividends}
          field="dividendYield"
          type="bar"
          search={search}
        />
        <StockSection
          title="Stable Stocks"
          icon="🛡️"
          data={stableStocks}
          field="regularMarketPrice"
          type="bar"
          search={search}
        />
      </div>

      {/* Modal */}
  {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md relative 
                    max-h-[90vh] flex flex-col">
      
      {/* Close button */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <FiX size={20} />
      </button>

      <h2 className="text-xl font-bold mb-4">Create New Portfolio</h2>

      {/* Scrollable content */}
      <div className="overflow-y-auto pr-2 space-y-6 flex-1">
        {/* Portfolio Name */}
        <div>
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

        {/* Description */}
        <div>
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

        {/* Stock Section */}
        <h3 className="text-lg font-semibold">📥 Initial Holdings</h3>
        <div className="space-y-4">
          {holdings.map((h, idx) => (
            <div
              key={idx}
              className="p-4 border rounded-xl relative bg-white shadow-sm hover:shadow-md transition"
            >
              {/* Remove button */}
              {holdings.length > 1 && (
                <button
                  onClick={() =>
                    setHoldings(holdings.filter((_, i) => i !== idx))
                  }
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                >
                  <FiX size={18} />
                </button>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Stock Symbol */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Symbol
                  </label>
                  <input
                    type="text"
                    value={h.stock}
                    onChange={(e) => {
                      const newHoldings = [...holdings];
                      newHoldings[idx].stock = e.target.value;
                      setHoldings(newHoldings);
                    }}
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="MAYBANK"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={h.qty}
                    onChange={(e) => {
                      const newHoldings = [...holdings];
                      newHoldings[idx].qty = e.target.value;
                      setHoldings(newHoldings);
                    }}
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="100"
                  />
                </div>

                {/* Purchase Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purchase Price (RM)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={h.purchasePrice}
                    onChange={(e) => {
                      const newHoldings = [...holdings];
                      newHoldings[idx].purchasePrice = e.target.value;
                      setHoldings(newHoldings);
                    }}
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="8.50"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add stock button */}
          <button
            onClick={() =>
              setHoldings([
                ...holdings,
                { stock: "", qty: "", purchasePrice: "" },
              ])
            }
            className="flex items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 font-medium hover:bg-green-200 transition"
          >
            <FiPlus /> Add Another Stock
          </button>
        </div>
      </div>

      {/* Actions (stick to bottom) */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            const newPortfolio = {
              id: Date.now(),
              name: portfolioName,
              desc: portfolioDesc,
              holdings,
            };
            setPortfolios([...portfolios, newPortfolio]);
            setShowModal(false);
            setPortfolioName("");
            setPortfolioDesc("");
            setHoldings([{ stock: "", qty: "", purchasePrice: "" }]);
          }}
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
