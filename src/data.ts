import { AppProduct } from './types';

// Initial pre-loaded catalog extracted from the bi-weekly Castillo Paper catalog PDF
export const initialCatalog: AppProduct[] = [
  // CARTULINAS
  { id: "c1", category: "5. CARTULINAS", name: "Cartulina Escolar 150gr 50x65cm ROSADO/BLANCO/VERDE/AMARILLO", unit: "RSM/100", price: 34.00, unitPrice: 0.60 },
  { id: "c2", category: "5. CARTULINAS", name: "Cartulina Escolar 150g 70x100cm BRISTOL CEL/VERD/AMA", unit: "RSM/100", price: 79.00, unitPrice: 1.10 },
  { id: "c3", category: "5. CARTULINAS", name: "Cartulina Opalina crema 180 Gr. 70x100 cm FEDRIGONI SPLENDORGEL", unit: "Rsmx100", price: 177.50, unitPrice: 2.00 },
  { id: "c4", category: "5. CARTULINAS", name: "Cartulina Opalina Blca 220 Gr. 70x100 cm READY SPLENDORGEL", unit: "Rsmx100", price: 217.80, unitPrice: 2.40 },
  { id: "c5", category: "5. CARTULINAS", name: "Cartulina Opalina Blca 180 Gr. 70x100 cm FEDRIGONI SPLENDORGEL", unit: "Rsmx100", price: 169.80, unitPrice: 2.00 },
  { id: "c6", category: "5. CARTULINAS", name: "Cartulina Hilo Blca 180 Gr. 70x100 cm.", unit: "Rsmx100", price: 201.00, unitPrice: 2.30 },
  { id: "c7", category: "5. CARTULINAS", name: "Cartulina Hilo crema 180 Gr. 70x100 cm.", unit: "Rsmx100", price: 201.00, unitPrice: 2.30 },
  { id: "c8", category: "5. CARTULINAS", name: "Cartulina Hilo Blca 220 Gr. 70x100 cm.", unit: "Rsmx100", price: 256.50, unitPrice: 2.90 },
  { id: "c9", category: "5. CARTULINAS", name: "Cartulina Hilo crema 220 Gr. 70x100 cm.", unit: "Rsmx100", price: 256.50, unitPrice: 2.90 },
  { id: "c10", category: "5. CARTULINAS", name: "Clupac 83/90gr 1.21*1.55cm", unit: "Rsmx250", price: 283.00, unitPrice: 1.80 },

  // BOND
  { id: "b1", category: "4. FOTOCOPIA Y PERIODICOS", name: "Fotocopia 75gr. A-4 EXCELLENT", unit: "Millar", price: 23.70, unitPrice: null },
  { id: "b2", category: "4. FOTOCOPIA Y PERIODICOS", name: "Papel Fotocopia 75g OF REPORT/ CHAMEX", unit: "Millar", price: 32.80, unitPrice: null },
  { id: "b3", category: "4. FOTOCOPIA Y PERIODICOS", name: "Fotocopia 75gr. A-4 REPORT/", unit: "Millar", price: 24.70, unitPrice: null },
  { id: "b4", category: "4. FOTOCOPIA Y PERIODICOS", name: "Papel Fotocopia 75g A-3 REPORT /", unit: "Millar", price: 52.00, unitPrice: null },
  { id: "b5", category: "4. FOTOCOPIA Y PERIODICOS", name: "Bond 56gr oficio", unit: "Millar", price: 27.80, unitPrice: null },
  { id: "b6", category: "3. BOND", name: "Bond 56g 69x89cm", unit: "RSMx500", price: 106.50, unitPrice: null },
  { id: "b7", category: "3. BOND", name: "Papel bond 70g 61x86cm CHAMBRILL", unit: "Rsmx500", price: 98.00, unitPrice: null },
  { id: "b8", category: "3. BOND", name: "Bond 75gr 61X86cm CHEMING /HIKOTE/ PAPERONE LASER", unit: "Rsmx500", price: 99.80, unitPrice: null },
  { id: "b9", category: "3. BOND", name: "Bond 75gr 61X86cm CHAMBRILL", unit: "Rsmx500", price: 109.50, unitPrice: null },
  { id: "b10", category: "3. BOND", name: "Bond 75gr 69x89cm PRISMA/ CHEMING", unit: "Rsm/500", price: 116.50, unitPrice: null },
  { id: "b11", category: "3. BOND", name: "Bond 75gr 69x89cm CHAMBRILL", unit: "Rsm/500", price: 128.50, unitPrice: null },
  { id: "b12", category: "3. BOND", name: "Bond 75gr 72x102 CHAMBRILL", unit: "Rsmx500", price: 156.00, unitPrice: null },
  { id: "b13", category: "3. BOND", name: "Bond 75gr 72x102 PAPER ONE/ CHEMING", unit: "Rsmx500", price: 142.90, unitPrice: null },
  { id: "b14", category: "3. BOND", name: "Bond 90gr 61x86cm CHAMBRILL", unit: "Rsmx500", price: 136.00, unitPrice: null },
  { id: "b15", category: "3. BOND", name: "Bond 90gr 69x89cm CHAMBRILL", unit: "Rsmx500", price: 156.80, unitPrice: null },
  { id: "b16", category: "3. BOND", name: "Bond 90g 72x102cm PAPER ONE", unit: "Rsmx500", price: 173.80, unitPrice: null },
  { id: "b17", category: "3. BOND", name: "Papel bond 120grs 61x86cm CHAMBRILL", unit: "Rsmx500", price: 188.00, unitPrice: null },
  { id: "b18", category: "3. BOND", name: "Bond 120gr 69x89cm CHAMBRILL", unit: "Rsmx500", price: 215.90, unitPrice: null },
  { id: "b19", category: "3. BOND", name: "Papel bond 120grs 72x102cm CHAMBRILL", unit: "Rsmx500", price: 261.00, unitPrice: null },
  { id: "b20", category: "3. BOND", name: "Bond 120gr 61x86cm PAPERPLUS", unit: "Rsmx500", price: 180.00, unitPrice: null },
  { id: "b21", category: "3. BOND", name: "Bond 120gr 69x89cm PAPER ONE", unit: "Rsmx500", price: 210.00, unitPrice: null },
  { id: "b22", category: "3. BOND", name: "Bond 120gr 72X102cm PAPER ONE", unit: "Rsmx500", price: 248.00, unitPrice: null },
  { id: "b23", category: "3. BOND", name: "Bond 150gr 70x100cm CHAMBRILL", unit: "RSM/250", price: 175.00, unitPrice: null },

  // PERIODICOS
  { id: "pe1", category: "4. FOTOCOPIA Y PERIODICOS", name: "Periodico Natural 48.8GR OFICIO", unit: "Millar", price: 16.20, unitPrice: null },
  { id: "pe2", category: "4. FOTOCOPIA Y PERIODICOS", name: "Periodico Natural 48.8GR a-4", unit: "millar", price: 14.90, unitPrice: null },
  { id: "pe3", category: "4. FOTOCOPIA Y PERIODICOS", name: "Periodico Natural 45GR a-4", unit: "millar", price: 14.50, unitPrice: null },
  { id: "pe4", category: "4. FOTOCOPIA Y PERIODICOS", name: "Periodico AMARILLO/VERDE/ROSADO/MELON/CELESTE 48.8 OF", unit: "Millar", price: 21.80, unitPrice: null },
  { id: "pe5", category: "4. FOTOCOPIA Y PERIODICOS", name: "Periodico Natural 61x86cm", unit: "Rsmx500", price: 57.90, unitPrice: null },
  { id: "pe6", category: "4. FOTOCOPIA Y PERIODICOS", name: "Periodico Natural 69x89CM", unit: "Rsmx500", price: 68.80, unitPrice: null },

  // COUCHES
  { id: "co1", category: "1. COUCHÉS", name: "Couche 90g 61x86cm HICOTE/SUMBRITE", unit: "Rsmx500", price: 120.50, unitPrice: null },
  { id: "co2", category: "1. COUCHÉS", name: "Couche 90g 69x89cm Brill CHEMING", unit: "Rsmx500", price: 141.00, unitPrice: null },
  { id: "co3", category: "1. COUCHÉS", name: "Couche 90g 72x102cm Brill HICOTE /SUMBRITE", unit: "Rsmx500", price: 175.50, unitPrice: null },
  { id: "co4", category: "1. COUCHÉS", name: "Couche 115g 61x86c Brill SNOW EAGLE/STAR GLOSS / hicote", unit: "Rsmx500", price: 142.80, unitPrice: null },
  { id: "co5", category: "1. COUCHÉS", name: "Couche 115g 69x89cm Brill /SUN BRITE/ cheming", unit: "Rsmx500", price: 175.00, unitPrice: null },
  { id: "co6", category: "1. COUCHÉS", name: "Couche 115g 72x102cm Brill/CHEMING", unit: "Rsmx500", price: 210.00, unitPrice: null },
  { id: "co7", category: "1. COUCHÉS", name: "Couche 150g 61x86cm Brill/", unit: "Rsmx250", price: 99.50, unitPrice: null },
  { id: "co8", category: "1. COUCHÉS", name: "Couche 150g 69x89cm Brill/", unit: "Rsmx250", price: 116.50, unitPrice: null },
  { id: "co9", category: "1. COUCHÉS", name: "Couche 150g 72x102cm Brill", unit: "Rsmx250", price: 140.80, unitPrice: null },
  { id: "co10", category: "1. COUCHÉS", name: "Couche 200g 61x86cm Brill / Cheming/ hicote", unit: "Rsmx125", price: 69.00, unitPrice: null },
  { id: "co11", category: "1. COUCHÉS", name: "Couche 200g 69x89cm Brill SUN BRITE", unit: "Rsmx125", price: 82.50, unitPrice: null },
  { id: "co12", category: "1. COUCHÉS", name: "Couche 200g 72x102cm Brill/SUN BRITE/ CHEMING", unit: "Rsmx125", price: 95.80, unitPrice: null },
  { id: "co13", category: "1. COUCHÉS", name: "Couche 250g 61x86cm Brill / hicote / bohui", unit: "Rsmx100", price: 69.00, unitPrice: null },
  { id: "co14", category: "1. COUCHÉS", name: "Couche 250g 69x89cm BriLL SUN BRITE", unit: "Rsmx100", price: 82.50, unitPrice: null },
  { id: "co15", category: "1. COUCHÉS", name: "Couche 250g 72x12cm Brill CHEMING/ SUN BRITE", unit: "Rsmx100", price: 94.80, unitPrice: null },
  { id: "co16", category: "1. COUCHÉS", name: "Couche 300g 61x86cm BRILL HICOTE", unit: "Rsmx100", price: 82.90, unitPrice: null },
  { id: "co17", category: "1. COUCHÉS", name: "Couche 300g 69x89cm Brill HICOTE /SUN BRITE", unit: "Rsmx100", price: 94.90, unitPrice: null },
  { id: "co18", category: "1. COUCHÉS", name: "Couche 300g 72x12cm MATE HICOTE", unit: "Rsmx100", price: 114.70, unitPrice: null },
  { id: "co19", category: "1. COUCHÉS", name: "Couche brill 300gr 72x102 Hicote", unit: "Rsmx100", price: 114.70, unitPrice: null },
  { id: "co20", category: "1. COUCHÉS", name: "Couche 350g 72x102cm Brill", unit: "Rsm/100", price: 138.00, unitPrice: null },

  // CARTONES
  { id: "ca1", category: "6. CARTONES Y FOLCOTE", name: "Folcote Finlandes R/B C-12 70x100cm SERVIFOLD 205GR", unit: "RSM/100", price: 63.80, unitPrice: null },
  { id: "ca2", category: "6. CARTONES Y FOLCOTE", name: "FOLCOTE Finlandes R/B C-13.5 230 grs 70x100 LIAN SHENG", unit: "Rsmx100", price: 75.00, unitPrice: null },
  { id: "ca3", category: "6. CARTONES Y FOLCOTE", name: "FOLCOTE Finlandes R/B C-15 250 grs 70x100cm LIAN SHENG", unit: "Rsmx100", price: 86.50, unitPrice: null },
  { id: "ca4", category: "6. CARTONES Y FOLCOTE", name: "Folcote Finlandes R/B 215g C-12 70x100cm ZENIT", unit: "Rsmx100", price: 70.50, unitPrice: null },
  { id: "ca5", category: "6. CARTONES Y FOLCOTE", name: "Graphics R/B 235gr C-14 70x100cm ZENIT", unit: "Rsmx100", price: 81.00, unitPrice: null },
  { id: "ca6", category: "6. CARTONES Y FOLCOTE", name: "GRAPHICS R/B 270gr C-16 70x100cm ZENIT", unit: "Rsmx100", price: 89.80, unitPrice: null },
  { id: "ca7", category: "6. CARTONES Y FOLCOTE", name: "GRAPHICS R/B 295gr C-18 70x100cm ZENIT", unit: "Rsmx100", price: 99.50, unitPrice: null },

  // DUPLEX
  { id: "d1", category: "6. CARTONES Y FOLCOTE", name: "Duplex C-14 R/C 230gr. 70x100 Gracia", unit: "Rsmx100", price: 87.50, unitPrice: null },

  // LINER / NUEVO INGRESO
  { id: "l1", category: "6. CARTONES Y FOLCOTE", name: "FOLCRAFT LINER 135GR 70 x100cm", unit: "RSM/100", price: 59.00, unitPrice: null },
  { id: "l2", category: "6. CARTONES Y FOLCOTE", name: "LINER 170GR/161GR 70X100CM", unit: "RSM/100", price: 68.00, unitPrice: null },
  { id: "l3", category: "6. CARTONES Y FOLCOTE", name: "LINER 200grs 70x100cm", unit: "RSM/100", price: 76.50, unitPrice: null },
  { id: "l4", category: "6. CARTONES Y FOLCOTE", name: "ANTIGRASA 40GR 70X50CM", unit: "RSM/450", price: 73.35, unitPrice: null },

  // AUTOCOPIATIVO
  { id: "a1", category: "2. AUTOCOPIATIVOS", name: "Papel Autocopiativo CB A-4 55gr. (IMPRESIÓN 2000)", unit: "Millar", price: 35.30, unitPrice: null },
  { id: "a2", category: "2. AUTOCOPIATIVOS", name: "Papel Autocopiativo CFB A-4 50gr. (MULTICOPY)", unit: "Millar", price: 36.00, unitPrice: null },
  { id: "a3", category: "2. AUTOCOPIATIVOS", name: "Papel Autocopiativo CF A-4 55gr.", unit: "Millar", price: 34.50, unitPrice: null },
  { id: "a4", category: "2. AUTOCOPIATIVOS", name: "Papel Autocopiativo CB OF 55gr.", unit: "Millar", price: 41.00, unitPrice: null },
  { id: "a5", category: "2. AUTOCOPIATIVOS", name: "Papel Autocopiativo CFB OF 50gr.", unit: "Millar", price: 41.50, unitPrice: null },
  { id: "a6", category: "2. AUTOCOPIATIVOS", name: "Papel Autocopiativo CF OF 55gr.", unit: "Millar", price: 40.30, unitPrice: null },
  { id: "a7", category: "2. AUTOCOPIATIVOS", name: "Papel Autocopiativo 55gr. CB 61x86cm", unit: "Rsmx500", price: 133.00, unitPrice: null },
  { id: "a8", category: "2. AUTOCOPIATIVOS", name: "Papel Autocopiativo 50gr. CFB 61x86cm", unit: "Rsmx500", price: 136.00, unitPrice: null },
  { id: "a9", category: "2. AUTOCOPIATIVOS", name: "Papel Autocopiativo 55gr. CF 61x86cm", unit: "Rsmx500", price: 130.00, unitPrice: null },
  { id: "a10", category: "2. AUTOCOPIATIVOS", name: "Papel Autocopiativo 55gr. CB 69x89cm", unit: "Rsmx500", price: 156.00, unitPrice: null },
  { id: "a11", category: "2. AUTOCOPIATIVOS", name: "Papel Autocopiativo 50gr. CFB 69x89cm", unit: "Rsmx500", price: 158.00, unitPrice: null },
  { id: "a12", category: "2. AUTOCOPIATIVOS", name: "Papel Autocopiativo 55gr. CF 69x89cm", unit: "Rsmx500", price: 153.00, unitPrice: null },

  // ADHESIVOS
  { id: "ad1", category: "7. ADHESIVOS", name: "LP80-P4-K80-H1 70X100 ARCLAD", unit: "Rsmx100", price: 290.50, unitPrice: 3.30 },
  { id: "ad2", category: "7. ADHESIVOS", name: "LP80-P3H-K80-H1 70X100 ARCLAD", unit: "Rsmx100", price: 185.50, unitPrice: 2.50 },
  { id: "ad3", category: "7. ADHESIVOS", name: "LP80-PXH-K80-H1 70X100 ARCLAD", unit: "Rsmx100", price: 139.80, unitPrice: 2.00 },
  { id: "ad4", category: "7. ADHESIVOS", name: "LP80-P6H-K80-H1 70X100 ARCLAD", unit: "Rsmx100", price: 220.00, unitPrice: 2.50 },
  { id: "ad5", category: "7. ADHESIVOS", name: "AUTOADHESIVO RITRAMA PERMANENTE 70X100CM MULTIPOPSITO", unit: "Rsmx100", price: 181.50, unitPrice: 2.30 },
  { id: "ad6", category: "7. ADHESIVOS", name: "AUTOADHESIVO STAR 70X100CM", unit: "Rsmx100", price: 139.80, unitPrice: 2.00 },
  { id: "ad7", category: "7. ADHESIVOS", name: "AUTOADHESIVO SEGURIDAD RITRAMA 70X100CM SUPERTACK", unit: "Rsm/100", price: 222.50, unitPrice: 2.50 },
  { id: "ad8", category: "7. ADHESIVOS", name: "JAC SCRIPT #22 AE -BOND ADHESIVO 70X100CM", unit: "Rsmx100", price: 197.50, unitPrice: 2.50 },
  { id: "ad9", category: "7. ADHESIVOS", name: "Vinil PVC FASSON Transparente/Blanco", unit: "Rsmx100", price: 440.00, unitPrice: 5.00 },
];
