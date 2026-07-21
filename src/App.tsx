import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { initialCatalog } from './data';
import { AppProduct, ProductSelection } from './types';
import { ProductList } from './components/ProductList';
import { QuoteSummaryList } from './components/QuoteSummaryList';
import { Search, Copy, Trash2, Upload, FileText } from 'lucide-react';
import { getPackSheets } from './utils';

function App() {
  const [catalog, setCatalog] = useState<AppProduct[]>(initialCatalog);
  const [selections, setSelections] = useState<Record<string, ProductSelection>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [isExtracting, setIsExtracting] = useState(false);

  // Load from local storage
  useEffect(() => {
    const savedCatalog = localStorage.getItem('oneEstudioCatalog');
    if (savedCatalog) {
      try {
        setCatalog(JSON.parse(savedCatalog));
      } catch (e) {
        console.error("Could not parse saved catalog", e);
      }
    }

    const saved = localStorage.getItem('oneEstudioSelection');
    if (saved) {
      try {
        setSelections(JSON.parse(saved));
      } catch (e) {
        console.error("Could not parse saved selections", e);
      }
    } else {
        // Expand the first category by default if nothing is selected or saved
        if (initialCatalog.length > 0) {
            setExpandedCategories(new Set([initialCatalog[0].category]));
        }
    }
  }, []);

  // Save to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('oneEstudioSelection', JSON.stringify(selections));
  }, [selections]);

  useEffect(() => {
    localStorage.setItem('oneEstudioCatalog', JSON.stringify(catalog));
  }, [catalog]);

  const { totalCost, totalItems } = useMemo(() => {
    let cost = 0;
    let items = 0;
    (Object.entries(selections) as [string, ProductSelection][]).forEach(([productId, sel]) => {
      if (sel.qty > 0 || sel.menudeo > 0) {
        items++;
        if (sel.menudeo > 0) {
          cost += sel.menudeo;
        } else if (sel.qty > 0) {
          const product = catalog.find(p => p.id === productId);
          if (product) {
            const packSheets = getPackSheets(product);
            const unitCost = product.unitPrice || (product.price / packSheets);
            cost += sel.qty * unitCost;
          }
        }
      }
    });
    return { totalCost: cost, totalItems: items };
  }, [selections, catalog]);

  const handleUpdateSelection = useCallback((productId: string, field: 'qty' | 'menudeo', value: number) => {
    setSelections(prev => {
      const next = { ...prev };
      if (!next[productId]) {
        next[productId] = { qty: 0, menudeo: 0 };
      }
      next[productId] = { ...next[productId], [field]: value };
      
      // If quantity is 0 and menudeo is 0, we can remove it. But actually they just zero qty
      if (next[productId].qty <= 0 && next[productId].menudeo <= 0) {
        delete next[productId];
      }
      return next;
    });
  }, []);

  const handleReset = () => {
    if (window.confirm("¿Seguro que deseas borrar toda la cotización?")) {
      setSelections({});
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsExtracting(true);
      const formData = new FormData();
      formData.append('catalog', file);

      const response = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al procesar el PDF');
      }

      const data = await response.json();
      if (data.products && Array.isArray(data.products)) {
        setCatalog(data.products);
        setSelections({});
        alert('Catálogo actualizado exitosamente. Las cuentas han sido reiniciadas.');
      }
    } catch (error) {
      console.error(error);
      alert('Hubo un error al procesar el archivo. Por favor intenta de nuevo.');
    } finally {
      setIsExtracting(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleToggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  const quickFilter = (term: string) => {
    setSearchTerm(term);
    const groups = new Set<string>();
    catalog.forEach(p => {
      if (
        p.name.toLowerCase().includes(term.toLowerCase()) ||
        p.category.toLowerCase().includes(term.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(term.toLowerCase()))
      ) {
        groups.add(p.category);
      }
    });
    setExpandedCategories(groups);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] font-sans pb-32 transition-colors duration-200">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-black/5 dark:border-white/10 transition-colors duration-200">
        <div className="max-w-3xl mx-auto p-4 pt-5">
          <div className="flex justify-between items-end mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white">
                  ONE <span className="text-[#0071e3] dark:text-[#2997ff]">Estudio</span>
                </h1>
              </div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">Castillo</p>
            </div>
            <div className="text-right flex items-center gap-3">
              <label 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer transition-colors ${isExtracting ? 'bg-blue-50 dark:bg-blue-500/10' : 'bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20'}`}
                title="Subir PDF de precios"
              >
                {isExtracting ? (
                  <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                ) : (
                  <Upload className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                )}
                <span className={`text-[11px] font-semibold hidden sm:inline ${isExtracting ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  {isExtracting ? 'Procesando...' : 'Subir PDF'}
                </span>
                <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} disabled={isExtracting} />
              </label>
            </div>
          </div>
          
          <div className="relative group mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar material o medida..."
              value={searchTerm}
              onChange={(e) => {
                const val = e.target.value;
                setSearchTerm(val);
                if (val.trim() !== '') {
                  const groups = new Set<string>();
                  catalog.forEach(p => {
                    const searchString = `${p.name} ${p.category} ${p.brand || ''}`.toLowerCase();
                    if (searchString.includes(val.toLowerCase())) {
                      groups.add(p.category);
                    }
                  });
                  setExpandedCategories(groups);
                } else if (val.trim() === '' && initialCatalog.length > 0) {
                  setExpandedCategories(new Set([initialCatalog[0].category]));
                }
              }}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/[0.04] dark:bg-white/[0.08] border border-transparent text-[15px] font-medium outline-none placeholder-gray-500 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-[#1c1c1e] focus:border-[#0071e3] transition-all"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
            {['69x89', '150g', '300g', 'Autocopiativo', 'Adhesivos'].map(term => (
              <button
                key={term}
                onClick={() => quickFilter(term)}
                className="bg-gray-100 dark:bg-white/10 text-[11px] font-semibold text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/20 transition-colors whitespace-nowrap"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-4">
        <QuoteSummaryList
          catalog={catalog}
          selections={selections}
          onUpdateSelection={handleUpdateSelection}
          onClearAll={handleReset}
        />

        <ProductList
          products={catalog}
          searchTerm={searchTerm}
          selections={selections}
          onUpdateSelection={handleUpdateSelection}
          expandedCategories={expandedCategories}
          onToggleCategory={handleToggleCategory}
        />
        
        <div className="mt-8 pt-6 border-t border-gray-200/80 dark:border-white/10 flex flex-col items-center transition-colors">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Cuentas Castillo Paper
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#1c1c1e] rounded-lg border border-gray-200 dark:border-white/10 shadow-sm transition-colors">
              <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase">BCP</span>
              <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300 tracking-tight">215-1966201-0-32</span>
              <button
                onClick={() => navigator.clipboard.writeText('2151966201032')}
                className="text-gray-400 hover:text-[#0071e3] dark:hover:text-[#2997ff] p-1 transition-colors"
                title="Copiar BCP"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#1c1c1e] rounded-lg border border-gray-200 dark:border-white/10 shadow-sm transition-colors">
              <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase">Caja AQP</span>
              <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300 tracking-tight">00159999702100001001</span>
              <button
                onClick={() => navigator.clipboard.writeText('00159999702100001001')}
                className="text-gray-400 hover:text-[#0071e3] dark:hover:text-[#2997ff] p-1 transition-colors"
                title="Copiar Caja AQP"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 z-40 bg-white/85 dark:bg-black/85 backdrop-blur-xl border-t border-black/5 dark:border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] transition-colors duration-200" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
        <div className="max-w-3xl mx-auto flex justify-between items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-0.5">Total Cotización ({totalItems} items)</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">S/ {totalCost.toFixed(2)}</span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl transition-colors font-semibold shadow-sm shrink-0"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-[13px] uppercase tracking-wider hidden sm:inline">Limpiar Consultas</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
