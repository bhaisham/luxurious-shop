import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/format';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Input';
import type { ContactEnquiry } from '@/lib/types';

export function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from('contact_enquiries').select('*').order('created_at', { ascending: false });
    setEnquiries(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('contact_enquiries').update({ status }).eq('id', id);
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  };

  if (loading) return <Loader label="Loading enquiries..." />;

  return (
    <div>
      <h1 className="font-serif text-3xl text-charcoal">Contact Enquiries</h1>
      <p className="mt-1 text-sm text-gray-500">{enquiries.length} total enquiries</p>

      {enquiries.length === 0 ? (
        <EmptyState title="No enquiries yet" description="Contact form submissions will appear here." />
      ) : (
        <div className="mt-6 space-y-4">
          {enquiries.map(enq => (
            <div key={enq.id} className="border border-gray-100 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-charcoal">{enq.name}</p>
                  <p className="text-xs text-gray-400">{enq.email}{enq.phone ? ` · ${enq.phone}` : ''}</p>
                  <p className="mt-1 text-xs text-gray-400">{formatDate(enq.created_at)}</p>
                </div>
                <Select
                  value={enq.status}
                  onChange={e => updateStatus(enq.id, e.target.value)}
                  className="w-auto py-1 text-xs"
                >
                  <option value="new">new</option>
                  <option value="read">read</option>
                  <option value="responded">responded</option>
                  <option value="archived">archived</option>
                </Select>
              </div>
              {enq.subject && <p className="mt-3 text-sm font-medium text-charcoal">{enq.subject}</p>}
              <p className="mt-2 text-sm text-gray-600">{enq.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
