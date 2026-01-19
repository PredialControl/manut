"use client";

import { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Download, FileSpreadsheet } from "lucide-react";

interface ImportCsvDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ImportCsvDialog({ open, onClose }: ImportCsvDialogProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const contractId = searchParams.get('contractId');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !contractId) {
      toast.error("Selecione um arquivo e certifique-se de ter um contrato selecionado");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('contractId', contractId);

      const response = await fetch('/api/construction-items/import', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        if (result.errors && result.errors.length > 0) {
          toast.success(result.message);
          console.warn("Erros durante o import:", result.errors);
        } else {
          toast.success(`${result.count} itens importados com sucesso!`);
        }
        onClose();
        window.location.reload(); // Recarregar para mostrar novos dados
      } else {
        const errorMessage = result.error || "Erro ao importar arquivo";
        if (result.details && result.details.length > 0) {
          console.error("Detalhes dos erros:", result.details);
          toast.error(`${errorMessage}. Verifique o console para detalhes.`);
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      toast.error("Erro ao fazer upload do arquivo");
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const downloadTemplate = () => {
    // Criar template CSV
    const headers = [
      'numero',
      'descricao',
      'status',
      'data_abertura',
      'prazo',
      'retorno'
    ];
    
    const examples = [
      '72246',
      'Fissura no muro do hall de entrada social',
      'EM_ANDAMENTO',
      '2025-05-14',
      '2025-07-22',
      'Atualização 30/06 - Mitre iniciou o tratamento'
    ];

    const csvContent = [
      headers.join(','),
      examples.join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template-itens-construtora.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] w-[95vw] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Itens da Construtora</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Instruções */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Como importar seus dados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0">1</span>
                <span>Baixe o template CSV clicando no botão abaixo</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0">2</span>
                <span>Preencha o arquivo com seus dados seguindo o formato do exemplo</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0">3</span>
                <span>Faça o upload do arquivo preenchido</span>
              </div>
            </CardContent>
          </Card>

          {/* Download Template */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="w-full max-w-md"
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar Template CSV
            </Button>
          </div>

          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <div className="text-center space-y-3">
              <FileSpreadsheet className="h-8 w-8 mx-auto text-gray-400" />
              
              <div>
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-base font-medium">Selecione o arquivo CSV</span>
                  <Input
                    id="file-upload"
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  Suporta arquivos CSV, Excel (.xlsx, .xls)
                </p>
              </div>

              {selectedFile && (
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <p className="text-sm font-medium text-green-800">
                    Arquivo selecionado: {selectedFile.name}
                  </p>
                  <p className="text-xs text-green-600">
                    Tamanho: {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Informações sobre formato */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Formato dos dados</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-1">
              <div><strong>numero:</strong> Número do chamado (obrigatório)</div>
              <div><strong>descricao:</strong> Descrição da pendência (obrigatório)</div>
              <div><strong>status:</strong> EM_ANDAMENTO, FINALIZADO, CONCLUIDO, AGUARDANDO_VISTORIA, IMPROCEDENTE</div>
              <div><strong>data_abertura:</strong> Formato: YYYY-MM-DD (ex: 2025-01-15)</div>
              <div><strong>prazo:</strong> Formato: YYYY-MM-DD (opcional)</div>
              <div><strong>retorno:</strong> Observações e retorno (opcional)</div>
            </CardContent>
          </Card>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={!selectedFile || isUploading}
              className="w-full sm:w-auto"
            >
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Importando...
                </span>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Dados
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 