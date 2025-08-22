import React from "react";

const DividendTracker = ({ dividends }) => {
  return (
    <div className="p-4 rounded-2xl shadow-md bg-white">
      <h2 className="text-xl font-bold mb-3">Dividend Tracker</h2>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Company</th>
            <th className="p-2">Ex-Date</th>
            <th className="p-2">Pay Date</th>
            <th className="p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {dividends.map((d, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              <td className="p-2">{d.company}</td>
              <td className="p-2">{d.exDate}</td>
              <td className="p-2">{d.payDate}</td>
              <td className="p-2 font-medium text-green-600">{d.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DividendTracker;
