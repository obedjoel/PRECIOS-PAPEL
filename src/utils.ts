import { AppProduct, ProductSelection } from './types';

export function getPackSheets(product: AppProduct): number {
  const unit = product.unit.toLowerCase();
  if (unit.includes('millar') || unit.includes('milar')) return 1000;
  if (unit.includes('500')) return 500;
  if (unit.includes('450')) return 450;
  if (unit.includes('250')) return 250;
  if (unit.includes('125')) return 125;
  if (unit.includes('100')) return 100;
  return 100; // fallback
}

export function parseDetails(p: AppProduct) {
  let { grammage, size, brand } = p;
  if (!grammage) {
    const m = p.name.match(/\b\d+(?:\.\d+)?\s*(?:gr|g|grs|pts)\b/i);
    if (m) grammage = m[0].toLowerCase();
  }
  if (!size) {
    const m = p.name.match(/(?:\b\d+(?:\.\d+)?\s*[x*]\s*\d+(?:\.\d+)?\s*(?:cm|c)?\b)|\ba-?[34]\b|\boficio\b|\bof\b/i);
    if (m) {
      size = m[0].toLowerCase();
      if (size === 'of') size = 'oficio';
      else if (size.match(/\d+[\s]*[x*][\s]*\d+$/i)) size += 'cm';
      else if (size.match(/\d+[\s]*[x*][\s]*\d+c$/i)) size += 'm';
    }
  }
  if (!brand) {
    const brands = ['CHAMBRILL', 'FEDRIGONI', 'PAPER ONE', 'CHEMING', 'HIKOTE', 'PRISMA', 'PAPERPLUS', 'SUMBRITE', 'SNOW EAGLE', 'STAR GLOSS', 'ZENIT'];
    for (const b of brands) {
      if (p.name.toUpperCase().includes(b)) {
        brand = b;
        break;
      }
    }
  }
  return { grammage: grammage || '-', size: size || '-', brand: brand || '-' };
}

export function generateWhatsAppText(product: AppProduct, selection: ProductSelection) {
  const { grammage, size } = parseDetails(product);
  
  const hour = new Date().getHours();
  let greeting = "Buenos días";
  if (hour >= 18) greeting = "Buenas noches";
  else if (hour >= 12) greeting = "Buenas tardes";

  const qty = selection.qty > 0 ? `${selection.qty} pliegos` : `S/ ${selection.menudeo}`;
  
  let tipoPapel = product.category.replace(/^\d+\.\s*/, '').toLowerCase(); 
  let name = product.name.toLowerCase();

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
  
  let text = `${greeting}, necesito ${qty} de ${tipoPapel}`;
  if (grammage && grammage !== '-') text += ` de ${grammage}`;
  if (size && size !== '-') text += ` tamaño ${size}`;
  
  return encodeURIComponent(text);
}
