import React, { useState } from 'react';
import { Search, Code, BarChart2, Table as TableIcon, Sparkles, ChevronDown, ChevronRight, CornerDownLeft } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { queryDatabase } from "../services/api";


const SUGGESTED_QUERIES = [
  "Geçen ayki en karlı 5 ürünü listele",
  "Son 30 günde iptal edilen siparişlerin toplam tutarı nedir?",
  "Bölgelere göre müşteri dağılımını göster",
  "Stok miktarı 10'un altına düşen ürünler"
];

const MOCK_DATA = [
  { name: 'Enterprise Lisans', kar: 45000 },
  { name: 'Pro Lisans', kar: 28000 },
  { name: 'Özel Geliştirme', kar: 18000 },
  { name: 'Danışmanlık', kar: 15000 },
  { name: 'Eğitim', kar: 8000 }
];



export default function AiReportingPage() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [showSql, setShowSql] = useState(false);
  const [viewType, setViewType] = useState('chart');
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const chartData = result?.results || [];
  const numericKey = chartData.length > 0 
    ? Object.keys(chartData[0]).find(k => typeof chartData[0][k] === 'number')
    : null;
  const labelKey = chartData.length > 0
    ? Object.keys(chartData[0]).find(k => typeof chartData[0][k] === 'string')
    : null;

  const handleSearch = async (e) => {
        e.preventDefault();

        if (!query.trim()) return;

        try {
            setIsSearching(true);
            setError("");
            setHasResult(false);

            const response = await queryDatabase(query);

            console.log(response);

            setResult(response);
            setHasResult(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSearching(false);
        }
    };

  // ✅ Gerçek API çağrısı
    const handleSuggestClick = async (q) => {
        setQuery(q);
        try {
            setIsSearching(true);
            setError("");
            setHasResult(false);
            const response = await queryDatabase(q);
            setResult(response);
            setHasResult(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSearching(false);
        }
    }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
        
        {/* Search Header */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Yapay Zeka ile Veri Analizi</h1>
          <p className="text-slate-500 mb-6">Veritabanınızı doğal dille sorgulayın, anında görselleştirilmiş raporlar alın.</p>
          
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Sparkles className="h-5 w-5 text-indigo-500" />
            </div>
            <input
              type="text"
              className="w-full bg-white border border-slate-200 text-slate-900 text-lg rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 block w-full pl-12 pr-12 py-4 shadow-sm transition-all"
              placeholder="Veritabanınızı doğal dille sorgulayın... (Örn: Geçen ayki en karlı 5 ürünü listele)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 right-3 flex items-center">
              <button 
                type="submit" 
                disabled={isSearching || !query}
                className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <CornerDownLeft size={18} />
              </button>
            </div>
          </form>
        </div>

        {/* Loading Skeleton */}
        {isSearching && (
          <div className="animate-pulse flex flex-col gap-4 mt-4">
            <div className="h-12 bg-slate-200 rounded-lg w-full"></div>
            <div className="h-64 bg-slate-200 rounded-lg w-full"></div>
            <div className="h-24 bg-slate-200 rounded-lg w-full"></div>
          </div>
        )}

        {/* Results Area */}
        {hasResult && !isSearching && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* SQL Toggle */}
            <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
              <button 
                onClick={() => setShowSql(!showSql)}
                className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Code size={16} className="text-indigo-600" />
                  Üretilen SQL Sorgusu
                </div>
                {showSql ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              
              {showSql && (
                <div className="p-4 bg-slate-900 text-slate-300 font-mono text-sm overflow-x-auto">
                  <pre>
                    <span className="text-pink-400">SELECT</span> p.product_name, <span className="text-pink-400">SUM</span>(oi.profit) <span className="text-pink-400">AS</span> total_profit{'\n'}
                    <span className="text-pink-400">FROM</span> order_items oi{'\n'}
                    <span className="text-pink-400">JOIN</span> products p <span className="text-pink-400">ON</span> oi.product_id = p.id{'\n'}
                    <span className="text-pink-400">JOIN</span> orders o <span className="text-pink-400">ON</span> oi.order_id = o.id{'\n'}
                    <span className="text-pink-400">WHERE</span> o.created_at &gt;= <span className="text-amber-300">CURRENT_DATE</span> - <span className="text-indigo-300">INTERVAL</span> <span className="text-emerald-300">'1 month'</span>{'\n'}
                    <span className="text-pink-400">GROUP BY</span> p.id{'\n'}
                    <span className="text-pink-400">ORDER BY</span> total_profit <span className="text-pink-400">DESC</span>{'\n'}
                    <span className="text-pink-400">LIMIT</span> <span className="text-emerald-300">5</span>;
                  </pre>
                </div>
              )}
            </div>

            {/* Visualizer Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-slate-800">Sorgu Sonuçları</h3>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button 
                    onClick={() => setViewType('chart')}
                    className={`p-1.5 rounded-md text-sm font-medium transition-colors ${viewType === 'chart' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <BarChart2 size={16} />
                  </button>
                  <button 
                    onClick={() => setViewType('table')}
                    className={`p-1.5 rounded-md text-sm font-medium transition-colors ${viewType === 'table' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <TableIcon size={16} />
                  </button>
                </div>
              </div>

              {viewType === 'chart' ? (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey={labelKey} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `$${value/1000}k`} />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Kar']}
                      />
                      <Bar dataKey={numericKey} fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={50} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    {/* Tablo header — dinamik */}
                    <thead>
                    <tr>
                        {chartData.length > 0 && Object.keys(chartData[0]).map(col => (
                        <th key={col} className="px-4 py-3">{col}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {chartData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        {Object.values(row).map((val, i) => (
                            <td key={i} className="px-4 py-3 text-slate-700">{val}</td>
                        ))}
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* AI Callout */}
            {/* AI Callout */}
            {result?.insight && (
            <div className="bg-slate-100 border-l-4 border-indigo-600 rounded-r-xl p-4 flex gap-3 items-start shadow-sm mt-2">
                <Sparkles className="text-indigo-600 shrink-0 mt-0.5" size={20} />
                <div>
                <h4 className="font-semibold text-slate-900 mb-1">Yapay Zeka Analizi</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{result.insight}</p>
                </div>
            </div>
            )}

          </div>
        )}
      </div>

      {/* Side Panel: Suggested Queries */}
      <div className="w-full lg:w-72 shrink-0">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm sticky top-0">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Search size={16} className="text-slate-400" />
            Önerilen Sorgular
          </h3>
          <div className="space-y-2">
            {SUGGESTED_QUERIES.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestClick(q)}
                className="w-full text-left text-sm text-slate-600 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 p-3 rounded-lg border border-transparent hover:border-indigo-100 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}