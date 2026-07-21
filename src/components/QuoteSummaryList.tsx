import React, { useState } from 'react';
import { Copy, Trash2, Send, Check, ShoppingBag, Plus, Minus, X } from 'lucide-react';
import { AppProduct, ProductSelection } from '../types';
import { getPackSheets, parseDetails } from '../utils';

interface QuoteSummaryListProps {
  catalog: AppProduct[];
  selections: Record<string, ProductSelection>;
  onUpdateSelection: (productId: string, field: 'qty' | 'menudeo', value: number) => void;
  onClearAll: () => void;
}

export function QuoteSummaryList({
  catalog,
  selections,
  onUpdateSelection,
  onClearAll
}: QuoteSummaryListProps) {
  const [copied, setCopied] = useState(false);

  // Filter out items in the selection
  const quotedItems = React.useMemo(() => {
    const list: {
      product: AppProduct;
      selection: ProductSelection;
      subtotal: number;
      unitCost: number;
      packSheets: number;
    }[] = [];

    (Object.entries(selections) as [string, ProductSelection][]).forEach(([productId, sel]) => {
      if (sel.qty > 0 || sel.menudeo > 0) {
        const product = catalog.find(p => p.id === productId);
        if (product) {
          const packSheets = getPackSheets(product);
          const unitCost = product.unitPrice || (product.price / packSheets);
          const subtotal = sel.menudeo > 0 ? sel.menudeo : sel.qty * unitCost;
          list.push({
            product,
            selection: sel,
            subtotal,
            unitCost,
            packSheets
          });
        }
      }
    });
    return list;
  }, [selections, catalog]);

  const totalCost = React.useMemo(() => {
    return quotedItems.reduce((acc, item) => acc + item.subtotal, 0);
  }, [quotedItems]);

  const generateWhatsAppMessage = () => {
    const hour = new Date().getHours();
    let greeting = "Buenos días";
    if (hour >= 18) greeting = "Buenas noches";
    else if (hour >= 12) greeting = "Buenas tardes";

    let text = `${greeting}, necesito el siguiente pedido:\n\n`;

    quotedItems.forEach((item) => {
      const { grammage, size } = parseDetails(item.product);
      const isMenudeo = item.selection.menudeo > 0;
      
      const qty = isMenudeo ? `menudeo` : `${item.selection.qty} pliegos`;
      
      let tipoPapel = item.product.category.replace(/^\d+\.\s*/, '').toLowerCase(); 
      let name = item.product.name.toLowerCase();

      if (name.includes('couche')) tipoPapel = 'couché';
      else if (name.includes('bond')) tipoPapel = 'bond';
      else if (name.includes('autocopiativo')) {
         if (name.includes('cb')) tipoPapel = 'autocopiativo CB';
         else if (name.includes('cfb')) tipoPapel = 'autocopiativo CFB';
         else if (name.includes('cf')) tipoPapel = 'autocopiativo CF';
         else tipoPapel = 'autocopiativo';
      }
      else if (name.includes('periodico') || name.includes('periódico')) tipoPapel = 'periódico';
      else if (name.includes('adhesivo')) tipoPapel = 'adhesivo';
      else if (name.includes('cartulina')) {
          if (name.includes('hilo')) tipoPapel = 'cartulina hilo';
          else if (name.includes('opalina')) tipoPapel = 'cartulina opalina';
          else if (name.includes('escolar')) tipoPapel = 'cartulina escolar';
          else tipoPapel = 'cartulina';
      }
      else if (name.includes('folcote')) tipoPapel = 'folcote';
      else if (name.includes('duplex')) tipoPapel = 'dúplex';
      else if (name.includes('liner') || name.includes('folcraft')) tipoPapel = 'liner';
      else if (name.includes('clupac')) tipoPapel = 'clupac';
      else tipoPapel = 'papel ' + tipoPapel;

      let itemLine = `- ${qty} de ${tipoPapel}`;
      if (grammage && grammage !== '-') itemLine += ` de ${grammage}`;
      if (size && size !== '-') itemLine += ` tamaño ${size}`;
      
      text += `${itemLine}\n`;
    });

    return text;
  };

  const handleCopyText = async () => {
    const text = generateWhatsAppMessage();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar', err);
    }
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(generateWhatsAppMessage());
    window.open(`https://wa.me/51958511842?text=${text}`, '_blank');
  };

  if (quotedItems.length === 0) {
    return (
      <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-sm border border-black/5 dark:border-white/10 p-6 text-center transition-colors">
        <div className="inline-flex p-3 bg-gray-50 dark:bg-white/5 rounded-full text-gray-400 dark:text-gray-500 mb-3">
          <ShoppingBag className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Sin materiales cotizados</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-normal">
          Modifica los pliegos o escribe un precio de cotización en la lista de abajo para armar tu pedido detallado.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-sm border border-black/5 dark:border-white/10 overflow-hidden transition-colors">
      <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <h3 className="font-bold text-[15px] text-gray-900 dark:text-white tracking-tight">
            Lista de Pedido Cotizado
          </h3>
          <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {quotedItems.length} {quotedItems.length === 1 ? 'ítem' : 'ítems'}
          </span>
        </div>
        <button
          onClick={onClearAll}
          className="text-xs font-semibold text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          title="Borrar todo el pedido"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Limpiar todo</span>
        </button>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-white/5 max-h-[360px] overflow-y-auto">
        {quotedItems.map(({ product, selection, subtotal, unitCost, packSheets }) => {
          const { brand, size, grammage } = parseDetails(product);
          const isMenudeo = selection.menudeo > 0;

          return (
            <div key={product.id} className="p-4 hover:bg-gray-50/50 dark:hover:bg-[#2c2c2e]/30 transition-colors flex justify-between items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide truncate max-w-[120px]">
                    {product.category.replace(/^\d+\.\s*/, '')}
                  </span>
                  {brand !== '-' && (
                    <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 truncate">
                      {brand}
                    </span>
                  )}
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white text-xs leading-normal truncate" title={product.name}>
                  {product.name}
                </h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                  {size !== '-' ? `Medida: ${size}` : ''}
                  {size !== '-' && grammage !== '-' ? ' • ' : ''}
                  {grammage !== '-' ? `Gramaje: ${grammage}` : ''}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                {/* Interactive adjustment control in the list */}
                <div className="flex items-center bg-gray-100 dark:bg-white/10 rounded-xl p-1 gap-1">
                  {isMenudeo ? (
                    <div className="flex items-center gap-1 px-2 py-0.5">
                      <span className="text-[10px] font-bold text-red-500 dark:text-red-400">Cotización Libre</span>
                      <button
                        onClick={() => onUpdateSelection(product.id, 'menudeo', 0)}
                        className="text-gray-400 hover:text-red-500 p-0.5 rounded transition-colors"
                        title="Eliminar cotización libre"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => onUpdateSelection(product.id, 'qty', Math.max(0, selection.qty - 1))}
                        className="p-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 rounded-lg transition-colors"
                        disabled={selection.qty <= 0}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-gray-900 dark:text-white min-w-[28px] text-center">
                        {selection.qty}
                      </span>
                      <button
                        onClick={() => onUpdateSelection(product.id, 'qty', selection.qty + 1)}
                        className="p-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>

                <div className="text-right min-w-[70px]">
                  <span className="text-xs font-bold text-gray-900 dark:text-white block">
                    S/ {subtotal.toFixed(2)}
                  </span>
                  {!isMenudeo && (
                    <span className="text-[9px] text-gray-400 dark:text-gray-500 block">
                      S/ {unitCost.toFixed(3)} c/u
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    onUpdateSelection(product.id, 'qty', 0);
                    onUpdateSelection(product.id, 'menudeo', 0);
                  }}
                  className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  title="Quitar de la lista"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest block">
              Monto Total Estimado
            </span>
            <span className="text-xl font-black text-[#0071e3] dark:text-[#2997ff]">
              S/ {totalCost.toFixed(2)}
            </span>
          </div>
          <div className="text-right text-[10px] text-gray-500 dark:text-gray-400 font-medium">
            Sujeto a stock disponible
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={handleCopyText}
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 border transition-colors ${
              copied
                ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400'
                : 'bg-white dark:bg-[#1c1c1e] hover:bg-gray-50 dark:hover:bg-[#2c2c2e] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>¡Copiado al Portapapeles!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Texto Detallado</span>
              </>
            )}
          </button>

          <button
            onClick={handleSendWhatsApp}
            className="w-full bg-[#34c759] hover:bg-[#2eb350] dark:bg-[#32d74b] dark:hover:bg-[#28c840] text-white py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Enviar Pedido (WhatsApp)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
