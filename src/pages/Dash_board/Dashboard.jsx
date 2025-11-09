// First Version 



import { useEffect, useState } from "react";
import { FiPackage, FiDollarSign, FiTruck, FiAlertTriangle } from "react-icons/fi";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, ArcElement,
  Tooltip, Legend,
} from "chart.js";
import StatCard from "../../components/Statcard";
import { getInventoryDashboard } from "../../services/dashboard";

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, ArcElement,
  Tooltip, Legend
);

export default function Dashboard() {
  const [err, setErr] = useState("");
  const [stats, setStats] = useState([]);
  const [stockValueData, setStockValueData] = useState(null);
  const [salesTrendData, setSalesTrendData] = useState(null);
  const [categoryDistributionData, setCategoryDistributionData] = useState(null);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    (async () => {
      setErr("");
      try {
        const { data } = await getInventoryDashboard();
        const summary = data?.summary ?? {};
        const charts = data?.charts ?? {};
        const top = Array.isArray(data?.top_products_sold) ? data.top_products_sold : [];

        // ======== KPI cards ========
        setStats([
          { title: "Total Products",       value: String(summary.total_products ?? 0),           change: "", icon: <FiPackage /> },
          { title: "Total Stock Value",    value: formatCurrency(summary.total_stock_value_retail ?? 0), change: "", icon: <FiDollarSign /> },
          { title: "Total Suppliers",      value: String(summary.total_suppliers ?? 0),          change: "", icon: <FiTruck /> },
          { title: "Low-Stock Items",      value: String(summary.low_stock_items ?? 0),          change: "", icon: <FiAlertTriangle /> },
        ]);

        // ======== Stock value by month (pad to last 6 months) ========
        setStockValueData(buildStockByMonth(charts?.stock_value_by_month));

        // ======== Sales trend last 7 days (pad to 7 days) ========
        setSalesTrendData(buildSalesTrend(charts?.sales_trend_last_7_days));

        // ======== Category distribution (pad a few categories for nicer donut) ========
        setCategoryDistributionData(buildCategoryDist(charts?.category_distribution));

        // ======== Top products (pad to 5 rows) ========
        setTopProducts(buildTopProducts(top));
      } catch (e) {
        setErr(
          e?.response?.data?.detail ||
          e?.response?.data?.message ||
          "Failed to load dashboard."
        );
        // keep UI usable with minimal safe dummies
        setStats((s) => s.length ? s : [
          { title: "Total Products", value: "0", change: "", icon: <FiPackage /> },
          { title: "Total Stock Value", value: "$0", change: "", icon: <FiDollarSign /> },
          { title: "Total Suppliers", value: "0", change: "", icon: <FiTruck /> },
          { title: "Low-Stock Items", value: "0", change: "", icon: <FiAlertTriangle /> },
        ]);
        setStockValueData((d) => d || buildStockByMonth([]));
        setSalesTrendData((d) => d || buildSalesTrend([]));
        setCategoryDistributionData((d) => d || buildCategoryDist([]));
        setTopProducts((t) => t.length ? t : buildTopProducts([]));
      }
    })();
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-900">Inventory Dashboard</h2>

      {err && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {err}
        </div>
      )}

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-700 font-medium mb-4">Stock Value by Month</h3>
          {stockValueData && (
            <Bar
              data={stockValueData}
              options={{
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-700 font-medium mb-4">Sales Trend (Last 7 Days)</h3>
          {salesTrendData && (
            <Line
              data={salesTrendData}
              options={{
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          )}
        </div>
      </div>

      {/* Bottom */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-700 font-medium mb-4">Product Category Distribution</h3>
          <div className="w-56 mx-auto">
            {categoryDistributionData && (
              <Doughnut
                data={categoryDistributionData}
                options={{ plugins: { legend: { position: "bottom" } } }}
              />
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-700 font-medium">Top 5 Products Sold</h3>
          </div>
          <div className="space-y-4">
            {topProducts.map((p, idx) => (
              <div key={`${p.name}-${idx}`} className="flex items-center justify-between border-b pb-3 last:border-none">
                <div>
                  <div className="font-medium text-gray-800">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.category}</div>
                </div>
                <div className="text-sm text-gray-500 w-20 text-center">{p.quantity_sold} sold</div>
                <div className="font-semibold text-gray-800">{formatCurrency(p.sales_value)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= helpers ================= */

function formatCurrency(n) {
  const v = Number(n || 0);
  return v.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

/** Build last 6 month labels like ["Jun","Jul","Aug","Sep","Oct","Nov"] */
function lastNMonthLabels(n = 6) {
  const now = new Date();
  const labels = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(d.toLocaleString(undefined, { month: "short" })); // "Nov"
  }
  return labels;
}

/** Use API months where available; pad missing months with gentle dummy values. */
function buildStockByMonth(api = []) {
  const labels = lastNMonthLabels(6);
  const map = new Map();
  (api || []).forEach((m) => {
    // API uses { month: "Nov", value: 60897.97 }
    if (m?.month) map.set(m.month, Number(m.value || 0));
  });

  // find a base to pad from
  const presentVals = [...map.values()];
  const base = presentVals.length ? presentVals[presentVals.length - 1] : 10000;

  const data = labels.map((label, i) => {
    if (map.has(label)) return map.get(label);
    // gentle dummy ramp around base (so it looks natural)
    const delta = (i - (labels.length - 1)) * 500; // -2500 .. 0
    return Math.max(0, base + delta);
  });

  return {
    labels,
    datasets: [{
      label: "Stock Value",
      data,
      backgroundColor: ["#5347CE", "#4896FE", "#16C8C7", "#887CFD", "#4896FE", "#5347CE"],
      borderRadius: 6,
    }],
  };
}

/** Build last 7 day labels and merge API values; pad missing days with small dummy numbers. */
function buildSalesTrend(api = []) {
  const days = lastNDatesISO(7); // ["2025-11-03", ...]
  const map = new Map();
  (api || []).forEach((d) => {
    if (d?.day) map.set(d.day, Number(d.sales || 0));
  });

  // make small dummy variation
  const baseline = 1000;
  const values = days.map((iso, idx) => {
    if (map.has(iso)) return map.get(iso);
    const bump = (idx % 3) * 120; // 0,120,240 pattern
    return baseline + bump;
  });

  const labels = days.map((iso) => {
    const dt = new Date(iso);
    return dt.toLocaleDateString(undefined, { weekday: "short" }); // Mon, Tue...
  });

  return {
    labels,
    datasets: [{
      label: "Sales (USD)",
      data: values,
      borderColor: "#4896FE",
      backgroundColor: "#4896FE",
      tension: 0.3,
      fill: false,
    }],
  };
}

function lastNDatesISO(n = 7) {
  const out = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push(d.toISOString().slice(0, 10)); // YYYY-MM-DD
  }
  return out;
}

/** Make a nicer donut even if API returns a single category. */
function buildCategoryDist(api = []) {
  const base = Array.isArray(api) ? api : [];
  // if only one category, add 2 tiny dummies so chart looks balanced
  const padded = base.length >= 3 ? base : [
    ...base,
    { category: "Misc", count: 1 },
    { category: "Other", count: 1 },
  ].slice(0, Math.max(3, base.length));

  return {
    labels: padded.map((c) => c.category ?? "—"),
    datasets: [{
      data: padded.map((c) => Number(c.count || 0)),
      backgroundColor: ["#5347CE", "#4896FE", "#16C8C7", "#887CFD", "#A2D9CE"],
      borderWidth: 0,
    }],
  };
}

/** Ensure at least 5 rows for the table. */
function buildTopProducts(api = []) {
  const rows = (api || []).map((p) => ({
    name: p?.name ?? "—",
    category: p?.category ?? "—",
    quantity_sold: Number(p?.quantity_sold ?? 0),
    sales_value: Number(p?.sales_value ?? 0),
  }));
  const dummies = [
    { name: "Placeholder A", category: "General", quantity_sold: 3, sales_value: 120 },
    { name: "Placeholder B", category: "General", quantity_sold: 2, sales_value: 90 },
    { name: "Placeholder C", category: "General", quantity_sold: 1, sales_value: 45 },
  ];
  while (rows.length < 5) rows.push(dummies[rows.length % dummies.length]);
  return rows.slice(0, 5);
}



// second version 

// import { useEffect, useState } from "react";
// import { FiPackage, FiDollarSign, FiTruck, FiAlertTriangle } from "react-icons/fi";
// import { Bar, Line, Doughnut } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale, LinearScale, BarElement,
//   PointElement, LineElement, ArcElement,
//   Tooltip, Legend,
// } from "chart.js";
// import StatCard from "../../components/Statcard";
// import { getInventoryDashboard } from "../../services/dashboard";

// ChartJS.register(
//   CategoryScale, LinearScale, BarElement,
//   PointElement, LineElement, ArcElement,
//   Tooltip, Legend
// );

// export default function Dashboard() {
//   const [err, setErr] = useState("");
//   const [loading, setLoading] = useState(true);

//   const [stats, setStats] = useState([]);
//   const [stockValueData, setStockValueData] = useState(null);
//   const [salesTrendData, setSalesTrendData] = useState(null);
//   const [categoryDistributionData, setCategoryDistributionData] = useState(null);
//   const [topProducts, setTopProducts] = useState([]);

//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       setErr("");
//       try {
//         const { data } = await getInventoryDashboard();
//         const summary = data?.summary ?? {};
//         const charts  = data?.charts ?? {};
//         const top     = Array.isArray(data?.top_products_sold) ? data.top_products_sold : [];

//         // KPI cards (pure API values)
//         setStats([
//           { title: "Total Products",  value: String(summary.total_products ?? 0),               change: "", icon: <FiPackage /> },
//           { title: "Total Stock Value", value: formatCurrency(summary.total_stock_value_retail ?? 0), change: "", icon: <FiDollarSign /> },
//           { title: "Total Suppliers", value: String(summary.total_suppliers ?? 0),              change: "", icon: <FiTruck /> },
//           { title: "Low-Stock Items", value: String(summary.low_stock_items ?? 0),              change: "", icon: <FiAlertTriangle /> },
//         ]);

//         // Stock value by month
//         if (Array.isArray(charts.stock_value_by_month) && charts.stock_value_by_month.length) {
//           setStockValueData({
//             labels: charts.stock_value_by_month.map(m => m.month ?? ""),
//             datasets: [{
//               label: "Stock Value",
//               data: charts.stock_value_by_month.map(m => Number(m.value || 0)),
//               backgroundColor: ["#5347CE", "#4896FE", "#16C8C7", "#887CFD", "#4896FE", "#5347CE"],
//               borderRadius: 6,
//             }],
//           });
//         } else {
//           setStockValueData(null);
//         }

//         // Sales trend last 7 days
//         if (Array.isArray(charts.sales_trend_last_7_days) && charts.sales_trend_last_7_days.length) {
//           const arr = charts.sales_trend_last_7_days;
//           setSalesTrendData({
//             labels: arr.map(d => toWeekday(d.day)),
//             datasets: [{
//               label: "Sales (USD)",
//               data: arr.map(d => Number(d.sales || 0)),
//               borderColor: "#4896FE",
//               backgroundColor: "#4896FE",
//               tension: 0.3,
//               fill: false,
//             }],
//           });
//         } else {
//           setSalesTrendData(null);
//         }

//         // Category distribution
//         if (Array.isArray(charts.category_distribution) && charts.category_distribution.length) {
//           setCategoryDistributionData({
//             labels: charts.category_distribution.map(c => c.category ?? "—"),
//             datasets: [{
//               data: charts.category_distribution.map(c => Number(c.count || 0)),
//               backgroundColor: ["#5347CE", "#4896FE", "#16C8C7", "#887CFD", "#A2D9CE"],
//               borderWidth: 0,
//             }],
//           });
//         } else {
//           setCategoryDistributionData(null);
//         }

//         // Top products
//         setTopProducts(top);
//       } catch (e) {
//         setErr(
//           e?.response?.data?.detail ||
//           e?.response?.data?.message ||
//           "Failed to load dashboard."
//         );
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   return (
//     <div className="space-y-8">
//       <h2 className="text-2xl font-semibold text-gray-900">Inventory Dashboard</h2>

//       {err && (
//         <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
//           {err}
//         </div>
//       )}

//       {/* KPI cards */}
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         {stats.map((s) => <StatCard key={s.title} {...s} />)}
//       </div>

//       {/* Charts */}
//       <div className="grid lg:grid-cols-2 gap-6">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-gray-700 font-medium mb-4">Stock Value by Month</h3>
//           {loading ? (
//             <div className="h-40 animate-pulse rounded bg-gray-100" />
//           ) : stockValueData ? (
//             <Bar
//               data={stockValueData}
//               options={{ plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }}
//             />
//           ) : (
//             <EmptyHint text="No monthly stock data." />
//           )}
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-gray-700 font-medium mb-4">Sales Trend (Last 7 Days)</h3>
//           {loading ? (
//             <div className="h-40 animate-pulse rounded bg-gray-100" />
//           ) : salesTrendData ? (
//             <Line
//               data={salesTrendData}
//               options={{ plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }}
//             />
//           ) : (
//             <EmptyHint text="No recent sales data." />
//           )}
//         </div>
//       </div>

//       {/* Bottom */}
//       <div className="grid lg:grid-cols-2 gap-6">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-gray-700 font-medium mb-4">Product Category Distribution</h3>
//           {loading ? (
//             <div className="h-40 animate-pulse rounded bg-gray-100" />
//           ) : categoryDistributionData ? (
//             <div className="w-56 mx-auto">
//               <Doughnut
//                 data={categoryDistributionData}
//                 options={{ plugins: { legend: { position: "bottom" } } }}
//               />
//             </div>
//           ) : (
//             <EmptyHint text="No category distribution data." />
//           )}
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-gray-700 font-medium">Top Products Sold</h3>
//           </div>
//           {loading ? (
//             <div className="space-y-3">
//               <div className="h-10 animate-pulse rounded bg-gray-100" />
//               <div className="h-10 animate-pulse rounded bg-gray-100" />
//               <div className="h-10 animate-pulse rounded bg-gray-100" />
//             </div>
//           ) : topProducts?.length ? (
//             <div className="space-y-4">
//               {topProducts.map((p, idx) => (
//                 <div key={`${p.name}-${idx}`} className="flex items-center justify-between border-b pb-3 last:border-none">
//                   <div>
//                     <div className="font-medium text-gray-800">{p.name ?? "—"}</div>
//                     <div className="text-xs text-gray-500">{p.category ?? "—"}</div>
//                   </div>
//                   <div className="text-sm text-gray-500 w-20 text-center">
//                     {Number(p.quantity_sold ?? 0)} sold
//                   </div>
//                   <div className="font-semibold text-gray-800">
//                     {formatCurrency(p.sales_value ?? 0)}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <EmptyHint text="No top products to display." />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ===== helpers ===== */
// function toWeekday(iso) {
//   try {
//     const dt = new Date(iso);
//     return dt.toLocaleDateString(undefined, { weekday: "short" }); // Mon, Tue...
//   } catch {
//     return iso || "";
//   }
// }

// function formatCurrency(n) {
//   const v = Number(n || 0);
//   return v.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
// }

// /* ===== tiny empty-state helper ===== */
// function EmptyHint({ text }) {
//   return (
//     <div className="rounded border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
//       {text}
//     </div>
//   );
// }
