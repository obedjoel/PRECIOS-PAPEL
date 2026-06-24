import React, { useMemo } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, Phone } from 'lucide-react';
import { AppProduct, ProductSelection } from '../types';
import { getPackSheets, parseDetails, generateWhatsAppText } from '../utils';

interface ProductListProps {
  products: AppProduct[];
  searchTerm: string;
  selections: Record<string, ProductSelection>;
  onUpdateSelection: (productId: string, field: 'qty' | 'menudeo', value: number) => void;
  expandedCategories: Set<string>;
  onToggleCategory: (category: string) => void;
}

export function ProductList({
  products,
  searchTerm,
  selections,
  onUpdateSelection,
  expandedCategories,
  onToggleCategory
}: ProductListProps) {
  
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const gMatch = parseDetails(p);
      const searchString = `${p.name} ${p.category} ${gMatch.brand} ${gMatch.size} ${gMatch.grammage}`.toLowerCase();
      return searchString.includes(searchTerm.toLowerCase());
    });
  }, [products, searchTerm]);

  const groupedProducts = useMemo(() => {
    const groups: Record<string, AppProduct[]> = {};
    filteredProducts.forEach(p => {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredProducts]);

  if (groupedProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#9CA3AF] dark:text-[#6b7280]">
        <div className="text-4xl mb-3 opacity-30 dark:opacity-20">📦</div>
        <p className="font-medium text-sm">No hay resultados para esta búsqueda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-2">
      {groupedProducts.map(([category, items]) => {
        const isExpanded = expandedCategories.has(category);
        
        return (
          <div key={category} className="bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-sm border border-black/5 dark:border-white/10 overflow-hidden transition-colors">
            <button
              onClick={() => onToggleCategory(category)}
              className="w-full flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-[#2c2c2e] transition-colors border-b border-gray-100 dark:border-white/5 text-left"
            >
              <span className="font-bold text-[15px] text-gray-900 dark:text-white tracking-tight flex items-center">
                {category}
              </span>
              <span className="text-gray-400 dark:text-gray-500">
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>
            
            <div className={`transition-all duration-300 ease-in-out origin-top ${isExpanded ? 'max-h-[8000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
              <div className="divide-y divide-gray-100 dark:divide-white/5 bg-white dark:bg-[#1c1c1e] transition-colors">
                {items.map(product => {
                  const { brand } = parseDetails(product);
                  const packSheets = getPackSheets(product);
                  const selection = selections[product.id] || { qty: 0, menudeo: 0 };
                  const unitCost = product.unitPrice || (product.price / packSheets);
                  const costPerSheetFallback = product.price / packSheets;
                  
                  const baseCost = selection.qty * unitCost;
                  const actualSubtotal = selection.menudeo > 0 ? selection.menudeo : baseCost;
                  
                  const margin = selection.menudeo - baseCost;
                  const showMargin = selection.menudeo > 0;
                  const marginColor = margin >= 0 ? 'text-[#34c759] dark:text-[#32d74b]' : 'text-[#ff3b30] dark:text-[#ff453a]';
                  const marginText = margin >= 0 ? `Ganancia S/ ${margin.toFixed(2)}` : `Pérdida S/ ${Math.abs(margin).toFixed(2)}`;
                  
                  const showAlert = selection.qty > 0 && 
                    (selection.qty >= packSheets * 0.85 || (selection.menudeo > 0 && selection.menudeo >= product.price * 0.9));

                  return (
                    <div key={product.id} className="p-4 hover:bg-gray-50 dark:hover:bg-[#2c2c2e] transition-colors">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-[15px] leading-tight mb-1">{product.name}</h4>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mb-3">
                            {brand !== '-' ? `${brand} • ` : ''}Pack x {packSheets}
                          </p>
                          
                          <div className="flex items-center gap-3">
                            <div>
                              <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-0.5">Precio Pack</span>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-gray-900 dark:text-white">S/ {product.price.toFixed(2)}</span>
                                {product.unitPrice && (product.price / packSheets) < product.unitPrice && (
                                  <span className="bg-[#34c759]/10 text-[#34c759] dark:bg-[#32d74b]/10 dark:text-[#32d74b] text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide border border-[#34c759]/20 dark:border-[#32d74b]/20">
                                    Mejor opción
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="w-px h-8 bg-gray-200 dark:bg-white/10"></div>
                            <div>
                              <span className="text-[9px] font-semibold text-[#0071e3] dark:text-[#2997ff] uppercase tracking-wider block mb-0.5">
                                {product.unitPrice ? 'Unidad' : 'Hoja (Prop.)'}
                              </span>
                              <span className="text-sm font-semibold text-[#0071e3] dark:text-[#2997ff]">S/ {unitCost.toFixed(3)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-2 md:mt-0 md:w-56 self-start md:self-center">
                          <div className="flex flex-col">
                            <label className="text-[9px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 ml-1">Pliegos</label>
                            <input
                              type="number"
                              min="0"
                              value={selection.qty || ''}
                              onChange={(e) => onUpdateSelection(product.id, 'qty', parseFloat(e.target.value) || 0)}
                              placeholder="0"
                              className="w-full bg-black/5 dark:bg-white/5 border border-transparent rounded-xl px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white text-center focus:bg-white dark:focus:bg-[#1c1c1e] focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 outline-none transition-all"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-[9px] font-semibold text-[#ff3b30] dark:text-[#ff453a] uppercase tracking-wider mb-1 ml-1">Cotizado</label>
                            <input
                              type="number"
                              min="0"
                              value={selection.menudeo || ''}
                              onChange={(e) => onUpdateSelection(product.id, 'menudeo', parseFloat(e.target.value) || 0)}
                              placeholder="S/ 0"
                              className="w-full bg-red-50 dark:bg-[#ff3b30]/10 border border-transparent rounded-xl px-3 py-2 text-sm font-semibold text-[#ff3b30] dark:text-[#ff453a] text-center focus:bg-white dark:focus:bg-[#1c1c1e] focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 outline-none transition-all placeholder:text-[#ff3b30]/50 dark:placeholder:text-[#ff453a]/50"
                            />
                          </div>
                        </div>
                      </div>

                      {selection.qty > 0 || selection.menudeo > 0 ? (
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div className="flex-1 flex justify-between sm:justify-start sm:gap-8">
                              {showMargin && (
                                <div>
                                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Margen vs Costo</p>
                                  <p className={`text-sm font-bold ${marginColor}`}>{marginText}</p>
                                </div>
                              )}
                              <div className="text-right sm:text-left">
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Subtotal</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">S/ {actualSubtotal.toFixed(2)}</p>
                              </div>
                            </div>
                            
                            <a
                              href={`https://wa.me/51958511842?text=${generateWhatsAppText(product, selection)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full sm:w-auto bg-[#34c759] hover:bg-[#2eb350] dark:bg-[#32d74b] dark:hover:bg-[#28c840] text-white px-5 py-2.5 rounded-xl font-semibold flex items-center justify-center transition-all active:scale-95 shadow-sm"
                            >
                              <Phone className="w-4 h-4 mr-2" />
                              <span className="text-[13px]">Hacer Pedido</span>
                            </a>
                          </div>
                          
                          {showAlert && (
                            <div className="mt-2 p-2.5 bg-[#fff8e6] dark:bg-[#2a2110] rounded-xl flex items-start gap-2 border border-[#ffe5b4] dark:border-[#403318]">
                              <AlertCircle className="w-4 h-4 text-[#ff9f0a] dark:text-[#ffd60a] mt-0.5 shrink-0" />
                              <p className="text-[11px] text-[#8a5a19] dark:text-[#e5b366] font-medium leading-tight">
                                Estás muy cerca del costo del pack. <br/>
                                <span className="font-semibold">Mejor compra la resma de {packSheets} por S/ {product.price.toFixed(2)}</span>
                              </p>
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
