'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import ProductEditor from '../../../../components/admin/ProductEditor';
import { Loader2 } from 'lucide-react';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<any>(null);

  useEffect(() => {
    async function checkAuthAndFetchData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
        return;
      }

      if (params.id) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', params.id)
          .single();
          
        if (error || !data) {
          router.push('/admin/dashboard');
        } else {
          setProductData(data);
          setLoading(false);
        }
      }
    }
    
    checkAuthAndFetchData();
  }, [router, params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-accent-blue" />
      </div>
    );
  }

  return <ProductEditor initialData={productData} />;
}
