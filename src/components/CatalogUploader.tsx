import React, { useState } from 'react';
import { Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { AppProduct } from '../types';

interface CustomUploaderProps {
  onDataExtracted: (products: AppProduct[]) => void;
}

export function CatalogUploader({ onDataExtracted }: CustomUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
       setError("Solo PDF.");
       return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('catalog', file);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error procesando el PDF, intenta nuevamente.");
      }

      const data = await response.json();
      if (data.products && Array.isArray(data.products)) {
        onDataExtracted(data.products);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      } else {
         throw new Error("El formato de respuesta no es válido.");
      }
    } catch (err: any) {
      setError(err.message || "Error al subir.");
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <div className="flex items-center gap-3">
      {error && (
        <div className="flex items-center gap-1.5 text-[#EF4444] bg-red-50 border border-red-100 px-2.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
          <AlertCircle className="w-3 h-3" />
          Error
        </div>
      )}
      
      {success && (
        <div className="flex items-center gap-1.5 text-[#10B981] bg-green-50 border border-green-100 px-2.5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
          <CheckCircle2 className="w-3 h-3" />
          Actualizado
        </div>
      )}

      <label className={`
        relative flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider
        transition-colors cursor-pointer
        ${isUploading 
          ? 'bg-[#F9FAFB] text-[#9CA3AF] cursor-not-allowed border border-[#E5E7EB]' 
          : 'bg-[#1A1A1A] text-white hover:bg-black border border-[#1A1A1A]'}
      `}>
        {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
        <span>{isUploading ? 'Procesando...' : 'Subir PDF'}</span>
        <input 
          type="file" 
          accept=".pdf" 
          className="hidden" 
          onChange={handleFileUpload}
          disabled={isUploading}
        />
      </label>
    </div>
  );
}
