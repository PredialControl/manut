"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { executeCorrectiveCall } from "../_actions/execute-corrective-call";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ExecuteCorrectiveDialogProps {
  open: boolean;
  onClose: () => void;
  correctiveCall: {
    id: string;
    description: string;
    omcNumber: string;
  };
}

export function ExecuteCorrectiveDialog({ open, onClose, correctiveCall }: ExecuteCorrectiveDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    
    try {
      const result = await executeCorrectiveCall(formData);
      
      if (result.success) {
        toast.success("Corretiva executada com sucesso!");
        onClose();
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao executar corretiva");
      }
    } catch (error) {
      toast.error("Erro ao executar corretiva");
      console.error("Erro ao executar corretiva:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-2">
            Executar Corretiva
          </DialogTitle>
          <p className="text-center text-muted-foreground text-sm">
            Confirme a execução da corretiva {correctiveCall.omcNumber}
          </p>
        </DialogHeader>
        
        <form action={handleSubmit} className="space-y-6">
          <input type="hidden" name="id" value={correctiveCall.id} />
          
          {/* Descrição da corretiva */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Descrição da Corretiva</Label>
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">{correctiveCall.description}</p>
            </div>
          </div>

          {/* Data de execução */}
          <div className="space-y-2">
            <Label htmlFor="executedAt" className="text-sm font-semibold">
              Data de Execução
            </Label>
            <Input
              id="executedAt"
              name="executedAt"
              type="datetime-local"
              defaultValue={new Date().toISOString().slice(0, 16)}
              className="border-2 focus:border-primary transition-colors"
            />
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observations" className="text-sm font-semibold">
              Observações (opcional)
            </Label>
            <Textarea
              id="observations"
              name="observations"
              placeholder="Descreva as observações da execução..."
              rows={4}
              className="resize-none border-2 focus:border-primary transition-colors"
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="px-8 py-2 border-2 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="px-8 py-2 bg-green-600 hover:bg-green-700 transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Executando...
                </div>
              ) : (
                "Executar Corretiva"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 