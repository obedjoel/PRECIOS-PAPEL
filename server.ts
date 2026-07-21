import express from "express";
import path from "path";
import multer from "multer";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Configure multer for memory storage (for processing the uploaded file)
  const upload = multer({ storage: multer.memoryStorage() });

  // Initialize Gemini API
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // API Route to parse the PDF using Gemini
  app.post("/api/extract", upload.single("catalog"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      console.log("Receiving file for extraction:", req.file.originalname, req.file.size);

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  data: req.file.buffer.toString("base64"),
                  mimeType: req.file.mimetype,
                },
              },
              {
                text: `Actúa como un ingeniero industrial experto en logística y compras de imprenta.
He proporcionado un catálogo PDF con varias páginas de productos de papel y precios de Castillo Paper.
INSTRUCCIÓN CRÍTICA DE COBERTURA:
1. DEBES extraer ABSOLUTAMENTE TODOS los productos listados en cada fila de todas las tablas de todas las páginas del PDF. No omitas ningún ítem, no agrupes filas similares, no simplifiques la lista y no resumas. Cada fila individual de papel, gramaje, marca y precio es de vital importancia y se debe incluir.
2. Mapea la categoría (category) de cada producto a uno de estos valores estandarizados de manera exacta:
   - "1. COUCHÉS" (para Couches)
   - "2. AUTOCOPIATIVOS" (para Autocopiativos)
   - "3. BOND" (para Bond, Fotocopia)
   - "4. PERIÓDICOS" (para Periodicos)
   - "5. CARTULINAS" (para Cartulinas, Clupac)
   - "6. CARTONES Y FOLCOTE" (para Folcote, Graphics, Duplex, Liner, Antigrasa)
   - "7. ADHESIVOS" (para Adhesivos, Ritrama, Star, JAC, Vinil PVC, LP80-*)
3. Para cada producto extrae con precisión:
   - id: Genera un identificador único consecutivo, ej: "p_1", "p_2", "p_3", etc.
   - category: La categoría estandarizada de la lista anterior.
   - name: La descripción completa del producto tal como figura en el PDF (conserva marcas, gramajes, colores, dimensiones y comentarios si los hay).
   - unit: La unidad de venta de la columna 'Unidad' o similar (ej. RSM/100, Millar, Rsmx500, Rsmx125, Rsmx250).
   - price: El precio total principal como un número flotante (ej. 176.90).
   - unitPrice: El precio unitario de la columna 'Unid S/.' (ej. 1.1, 2, 2.4, 2.3, 2.9, 3.3). Si no tiene precio por unidad especificado en esa columna o similar, pon null.
   - grammage: El gramaje (ej. "150g", "180 Gr.", "200g", "40GR"). Si no se puede deducir del nombre, pon null.
   - size: La dimensión del pliego (ej. "70x100cm", "61x86cm", "A4", "oficio"). Si no se puede deducir, pon null.
   - brand: La marca comercial (ej. "FEDRIGONI", "CHAMBRILL", "PAPER ONE", "ZENIT", "ARCLAD", "RITRAMA"). Si no figura, pon null.

Devuelve un JSON array estructurado que contiene absolutamente todos los ítems de todas las tablas del PDF sin excepción.`,
              },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            description: "List of products extracted from the catalog.",
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "Generate a unique id like p_1, p_2" },
                category: { type: Type.STRING, description: "Category of the product, e.g., CARTULINAS, BOND, COUCHES" },
                name: { type: Type.STRING, description: "Product description or name" },
                unit: { type: Type.STRING, description: "Unit of measurement, e.g., RSM/100, Millar, Rsmx500" },
                price: { type: Type.NUMBER, description: "Main total price in local currency" },
                unitPrice: { type: Type.NUMBER, description: "Unitary price if specified, otherwise null", nullable: true },
                grammage: { type: Type.STRING, description: "Grammage (e.g., 150g)", nullable: true },
                size: { type: Type.STRING, description: "Size (e.g., 61x86cm)", nullable: true },
                brand: { type: Type.STRING, description: "Brand (e.g., CHAMBRILL)", nullable: true },
              },
              required: ["id", "category", "name", "unit", "price"],
            },
          },
        },
      });

      const extractedText = response.text;
      if (!extractedText) {
        throw new Error("Empty response from AI model.");
      }

      const products = JSON.parse(extractedText);
      res.json({ products });
    } catch (error) {
      console.error("Error extracting PDF:", error);
      res.status(500).json({ error: "Failed to extract prices from PDF catalog" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
