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
                text: `Actúa como un ingeniero industrial experto en logística y compras.
He proporcionado un catálogo PDF con varias páginas de productos de papel y precios.
INSTRUCCIÓN CRÍTICA: DEBES extraer ABSOLUTAMENTE TODOS los productos de TODAS las páginas. No omitas ni agrupes nada. Extrae toda la información técnica.
Para cada producto extrae con precisión:
- category: (basado en los encabezados como CARTULINAS, BOND, PERIODICOS, COUCHES 2026, CARTONES, DUPLEX, AUTOCOPIATIVO, ADHESIVOS, etc.)
- name: La descripción completa del producto.
- grammage: El gramaje (ej. 150g, 180 Gr., 75gr, 12pts). Si no tiene, omítelo o déjalo nulo.
- size: La medida o formato (ej. 61x86cm, 72x102cm, A4, oficio). Si no tiene, omítelo o déjalo nulo.
- brand: La marca (ej. FEDRIGONI, CHAMBRILL, PAPER ONE, ZENIT, etc). Si no se especifica explícitamente, pero es conocida, inclúyela. Si no, nulo.
- unit: La unidad de venta (ej. RSM/100, Millar, Rsmx500).
- price: El precio total principal (como número).
- unitPrice: El precio unitario si está especificado, nulo si no.

Devuelve un JSON array estructurado con todos los ítems.`,
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
