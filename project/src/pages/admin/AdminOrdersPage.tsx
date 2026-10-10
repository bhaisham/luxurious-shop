import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatMUR, formatDate } from '@/lib/format';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Input';
import type { Order, OrderItem } from '@/lib/types';

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'completed', 'cancelled'];

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);

  const load = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders((data as Order[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const viewOrder = async (order: Order) => {
    setSelected(order);
    const { data } = await supabase.from('order_items').select('*').eq('order_id', order.id);
    setItems((data as OrderItem[]) ?? []);
  };

  const updateStatus = async (orderId: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', orderId);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    if (selected?.id === orderId) setSelected(prev => prev ? { ...prev, status } : null);
  };

  if (loading) return <Loader label="Loading orders..." />;

  return (
    <div>
      <h1 className="font-serif text-3xl text-charcoal">Orders</h1>
      <p className="mt-1 text-sm text-gray-500">{orders.length} total orders &amp; enquiries</p>

      {orders.length === 0 ? (
        <EmptyState title="No orders yet" description="Orders and product enquiries will appear here." />
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-widest text-gray-400">
                <th className="py-3 pr-4">Order #</th>
                <th className="py-3 pr-4">Customer</th>
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Total</th>
                <th className="py-3 pr-4">Type</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-gray-50">
                  <td className="py-3 pr-4 font-medium text-charcoal">{order.order_number}</td>
                  <td className="py-3 pr-4 text-gray-600">{order.customer_name}</td>
                  <td className="py-3 pr-4 text-gray-600">{formatDate(order.created_at)}</td>
                  <td className="py-3 pr-4 font-medium text-charcoal">{formatMUR(Number(order.total))}</td>
                  <td className="py-3 pr-4">
                    <Badge variant={order.order_type === 'order' ? 'gold' : 'default'}>
                      {order.order_type}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4">
                    <Select
                      value={order.status}
                      onChange={e => updateStatus(order.id, e.target.value)}
                      className="w-auto py-1 text-xs"
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                  </td>
                  <td className="py-3">
                    <button onClick={() => viewOrder(order)} className="text-sm font-medium text-gold hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white p-6 lg:p-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-xl text-charcoal">{selected.order_number}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-charcoal">✕</button>
            </div>

            <div className="space-y-3 text-sm">
              <div><span className="text-gray-400">Customer:</span> <span className="text-charcoal">{selected.customer_name}</span></div>
              <div><span className="text-gray-400">Email:</span> <span className="text-charcoal">{selected.customer_email}</span></div>
              {selected.customer_phone && <div><span className="text-gray-400">Phone:</span> <span className="text-charcoal">{selected.customer_phone}</span></div>}
              {selected.delivery_address && <div><span className="text-gray-400">Address:</span> <span className="text-charcoal">{selected.delivery_address}</span></div>}
              {selected.town && <div><span className="text-gray-400">Town:</span> <span className="text-charcoal">{selected.town}</span></div>}
              {selected.notes && <div><span className="text-gray-400">Notes:</span> <span className="text-charcoal">{selected.notes}</span></div>}
              <div><span className="text-gray-400">Fulfilment:</span> <span className="text-charcoal">{selected.fulfilment_method}</span></div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-charcoal">Items</h3>
              {items.length === 0 ? (
                <p className="text-sm text-gray-400">No items found.</p>
              ) : (
                <div className="space-y-2">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-charcoal">{item.product_name} × {item.quantity}</span>
                      <span className="font-medium text-charcoal">{formatMUR(Number(item.unit_price) * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-100 pt-2 flex justify-between font-medium">
                    <span className="text-charcoal">Total</span>
                    <span className="text-charcoal">{formatMUR(Number(selected.total))}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
