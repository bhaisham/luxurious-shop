import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatMUR, formatDate } from '@/lib/format';
import { Loader } from '@/components/ui/Loader';

interface Stats {
  productCount: number;
  orderCount: number;
  enquiryCount: number;
  totalRevenue: number;
  recentOrders: Array<{ id: string; order_number: string; customer_name: string; total: number; status: string; created_at: string }>;
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('contact_enquiries').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('total').eq('status', 'confirmed'),
      supabase.from('orders').select('id, order_number, customer_name, total, status, created_at').order('created_at', { ascending: false }).limit(5),
    ]).then(([prodRes, orderRes, enquiryRes, revenueRes, recentRes]) => {
      const revenue = (revenueRes.data ?? []).reduce((sum, o: { total: number }) => sum + Number(o.total), 0);
      setStats({
        productCount: prodRes.count ?? 0,
        orderCount: orderRes.count ?? 0,
        enquiryCount: enquiryRes.count ?? 0,
        totalRevenue: revenue,
        recentOrders: (recentRes.data as Stats['recentOrders']) ?? [],
      });
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader label="Loading dashboard..." />;

  const cards = [
    { label: 'Products', value: stats?.productCount ?? 0, icon: Package, link: '/admin/products', color: 'text-blue-600' },
    { label: 'Orders', value: stats?.orderCount ?? 0, icon: ShoppingCart, link: '/admin/orders', color: 'text-green-600' },
    { label: 'Enquiries', value: stats?.enquiryCount ?? 0, icon: MessageSquare, link: '/admin/enquiries', color: 'text-gold' },
    { label: 'Revenue (confirmed)', value: formatMUR(stats?.totalRevenue ?? 0), icon: TrendingUp, link: '/admin/orders', color: 'text-charcoal' },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-charcoal">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">Welcome back. Here's an overview of your store.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(card => (
          <Link
            key={card.label}
            to={card.link}
            className="border border-gray-100 bg-white p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
            <p className="mt-3 text-2xl font-serif text-charcoal">{card.value}</p>
            <p className="text-xs uppercase tracking-widest text-gray-400">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border border-gray-100 bg-white p-6">
          <h2 className="font-serif text-lg text-charcoal">Recent Orders</h2>
          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="mt-4 space-y-3">
              {stats.recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between border-b border-gray-50 pb-3">
                  <div>
                    <p className="text-sm font-medium text-charcoal">{order.order_number}</p>
                    <p className="text-xs text-gray-400">{order.customer_name} · {formatDate(order.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-charcoal">{formatMUR(Number(order.total))}</p>
                    <span className={`text-xs ${order.status === 'confirmed' ? 'text-green-600' : order.status === 'pending' ? 'text-gold' : 'text-gray-400'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-400">No orders yet.</p>
          )}
          <Link to="/admin/orders" className="mt-4 block text-sm font-medium text-gold hover:underline">
            View all orders →
          </Link>
        </div>

        <div className="border border-gold/30 bg-gold/5 p-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-gold" />
            <h2 className="font-serif text-lg text-charcoal">Getting Started</h2>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-gray-600">
            <li>• Add real products in the <Link to="/admin/products" className="text-gold hover:underline">Products</Link> section to replace demo data.</li>
            <li>• Configure your store details, WhatsApp, and checkout mode in <Link to="/admin/settings" className="text-gold hover:underline">Settings</Link>.</li>
            <li>• Review and confirm your business information, opening hours, and contact details.</li>
            <li>• Confirm shipping, returns, and payment policies before publishing them.</li>
            <li>• Verify the listed phone number and WhatsApp availability with the business owner.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
