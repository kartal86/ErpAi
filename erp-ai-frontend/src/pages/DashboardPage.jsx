import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';

const revenueData = [
  { name: '1 Haz', total: 1200 },
  { name: '5 Haz', total: 3000 },
  { name: '10 Haz', total: 2000 },
  { name: '15 Haz', total: 4500 },
  { name: '20 Haz', total: 3800 },
  { name: '25 Haz', total: 5200 },
  { name: '30 Haz', total: 6000 },
];

const productData = [
  { name: 'Enterprise Lisans', sales: 400 },
  { name: 'Pro Lisans', sales: 300 },
  { name: 'Danışmanlık', sales: 200 },
  { name: 'Özel Geliştirme', sales: 278 },
  { name: 'Eğitim', sales: 189 },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'Acme Corp', amount: '$1,200', status: 'Tamamlandı', date: '2026-06-14' },
  { id: 'ORD-002', customer: 'Globex Inc', amount: '$3,450', status: 'Bekliyor', date: '2026-06-14' },
  { id: 'ORD-003', customer: 'Soylent Corp', amount: '$850', status: 'İşleniyor', date: '2026-06-13' },
  { id: 'ORD-004', customer: 'Initech', amount: '$2,100', status: 'Tamamlandı', date: '2026-06-12' },
];

const KpiCard = ({ title, value, change, isPositive }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
    <span className="text-sm font-medium text-slate-500 mb-2">{title}</span>
    <div className="flex items-end justify-between">
      <span className="text-2xl font-bold tabular-nums text-slate-800">{value}</span>
      <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
        {isPositive ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
        {change}
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    'Tamamlandı': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Bekliyor': 'bg-amber-50 text-amber-700 border-amber-200',
    'İşleniyor': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };
  return (
    <span className={`px-2.5 py-1 text-xs font-medium border rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Özeti</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Toplam Müşteri" value="1,248" change="%12" isPositive={true} />
        <KpiCard title="Aylık Sipariş" value="482" change="%4.1" isPositive={false} />
        <KpiCard title="Aylık Gelir" value="$84,230" change="%23" isPositive={true} />
        <KpiCard title="Bekleyen Tahsilat" value="$12,400" change="%8" isPositive={false} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-4">30 Günlük Gelir Trendi</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
                />
                <Area type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-4">En Çok Satan Ürünler</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} width={100} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                <Bar dataKey="sales" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-base font-semibold text-slate-900">Son Siparişler</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Sipariş No</th>
                <th className="px-6 py-3">Müşteri</th>
                <th className="px-6 py-3">Tutar</th>
                <th className="px-6 py-3">Tarih</th>
                <th className="px-6 py-3">Durum</th>
                <th className="px-6 py-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{order.id}</td>
                  <td className="px-6 py-4 text-slate-600">{order.customer}</td>
                  <td className="px-6 py-4 font-medium tabular-nums text-slate-900">{order.amount}</td>
                  <td className="px-6 py-4 text-slate-500">{order.date}</td>
                  <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}