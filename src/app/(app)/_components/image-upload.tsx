"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void;
  currentImage?: string;
}

export function ImageUpload({ onImageSelect, currentImage }: ImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(currentImage || null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
        setPreviewUrl(result);
        onImageSelect(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    onImageSelect("");
  };

  const predefinedImages = [
    { name: "Living One", url: "/living-one-building.svg" },
    { name: "Edifício Padrão", url: "/placeholder-building.svg" },
    { name: "Sem Imagem", url: "" }
  ];

  return (
    <div className="space-y-3">
      <Label>Imagem do Contrato</Label>
      
      {/* Imagens pré-definidas */}
      <div className="grid grid-cols-3 gap-2">
        {predefinedImages.map((img) => (
          <Button
            key={img.name}
            type="button"
            variant={selectedImage === img.url ? "default" : "outline"}
            className="h-16 flex flex-col items-center justify-center text-xs"
            onClick={() => {
              setSelectedImage(img.url);
              setPreviewUrl(img.url);
              onImageSelect(img.url);
            }}
          >
            {img.url ? (
              <img 
                src={img.url} 
                alt={img.name}
                className="w-6 h-6 object-contain mb-1"
              />
            ) : (
              <div className="w-6 h-6 bg-gray-200 rounded mb-1 flex items-center justify-center">
                <X className="w-3 h-3 text-gray-500" />
              </div>
            )}
            {img.name}
          </Button>
        ))}
      </div>

      {/* Upload personalizado compacto */}
      <div className="flex items-center space-x-2">
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          <Upload className="mr-1 h-3 w-3" />
          Upload
        </Button>
        {selectedImage && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemoveImage}
          >
            <X className="mr-1 h-3 w-3" />
            Remover
          </Button>
        )}
      </div>

      {/* Preview compacto */}
      {previewUrl && (
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-600">Preview:</span>
          <div className="w-12 h-12 border rounded overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* Campo hidden para o formulário */}
      <input
        type="hidden"
        name="imageUrl"
        value={selectedImage || ""}
      />
    </div>
  );
} 