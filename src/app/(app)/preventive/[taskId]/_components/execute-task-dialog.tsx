"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock, CheckCircle, Play } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Input } from "@/components/ui/input";

interface ExecuteTaskDialogProps {
  task: {
    id: string;
    ompNumber: string;
    description: string;
    assetName: string;
    assetTag: string;
    checklist?: string | null;
  };
  onExecute: (executionData: {
    taskId: string;
    description: string;
    checklistResults: string;
    startTime: Date;
    endTime: Date;
  }) => Promise<void>;
}

export function ExecuteTaskDialog({ task, onExecute }: ExecuteTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const [description, setDescription] = useState("");
  const [checklistResults, setChecklistResults] = useState<Record<string, boolean>>({});

  const router = useRouter();

  // Parse checklist se existir
  const checklistItems = task.checklist ? JSON.parse(task.checklist) : [];

  const handleStartExecution = () => {
    setStartTime(new Date());
    setIsOpen(true);
  };

  const handleChecklistChange = (itemIndex: number, checked: boolean) => {
    setChecklistResults(prev => ({
      ...prev,
      [itemIndex]: checked
    }));
  };

  const handleCompleteExecution = async () => {
    setIsExecuting(true);
    
    try {
      const checklistResultsString = JSON.stringify(
        checklistItems.map((item: any, index: number) => ({
          item: item.item,
          completed: checklistResults[index] || false
        }))
      );

      await onExecute({
        taskId: task.id,
        description: description || "Execução de manutenção preventiva",
        checklistResults: checklistResultsString,
        startTime,
        endTime: new Date()
      });

       // Fechar modal automaticamente após sucesso
       setIsOpen(false);

       // Revalidar dados sem recarregar a página
       router.refresh();

       // Mostrar mensagem de sucesso no console
       console.log('Tarefa executada com sucesso');
     } catch (error) {
       console.error("Erro ao executar tarefa:", error);
     } finally {
       setIsExecuting(false);
     }
  };

  const allChecklistCompleted = checklistItems.length > 0 
    ? checklistItems.every((_: any, index: number) => checklistResults[index])
    : true;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={handleStartExecution} className="w-full md:w-auto">
          <Play className="h-4 w-4 mr-2" />
          Executar Tarefa
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Executar Tarefa Preventiva
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
                     {/* Informações da tarefa */}
           <Card>
             <CardHeader>
               <CardTitle className="text-lg">{task.ompNumber}</CardTitle>
             </CardHeader>
             <CardContent className="space-y-2">
               <p className="text-sm text-muted-foreground">{task.description}</p>
               <div className="flex items-center gap-2">
                 <User className="h-4 w-4 text-muted-foreground" />
                 <span className="text-sm font-medium">{task.assetName} ({task.assetTag})</span>
               </div>
               <div className="flex items-center gap-2 mt-2 p-2 bg-blue-50 rounded-lg">
                 <User className="h-4 w-4 text-blue-600" />
                 <span className="text-sm text-blue-800">
                   <strong>Executando:</strong> Usuário do Sistema
                 </span>
               </div>
             </CardContent>
           </Card>

                     {/* Horários */}
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Clock className="h-5 w-5" />
                 Horários de Execução
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="text-sm font-medium mb-2 block">Início da Execução</label>
                   <div className="space-y-2">
                     <Input
                       type="date"
                       value={format(startTime, "yyyy-MM-dd")}
                       onChange={(e) => {
                         const newDate = new Date(e.target.value);
                         newDate.setHours(startTime.getHours(), startTime.getMinutes());
                         setStartTime(newDate);
                       }}
                       className="w-full"
                     />
                     <Input
                       type="time"
                       value={format(startTime, "HH:mm")}
                       onChange={(e) => {
                         const [hours, minutes] = e.target.value.split(':');
                         const newTime = new Date(startTime);
                         newTime.setHours(parseInt(hours), parseInt(minutes));
                         setStartTime(newTime);
                       }}
                       className="w-full"
                     />
                   </div>
                 </div>
                 <div>
                   <label className="text-sm font-medium mb-2 block">Fim da Execução</label>
                   <div className="space-y-2">
                     <Input
                       type="date"
                       value={format(endTime, "yyyy-MM-dd")}
                       onChange={(e) => {
                         const newDate = new Date(e.target.value);
                         newDate.setHours(endTime.getHours(), endTime.getMinutes());
                         setEndTime(newDate);
                       }}
                       className="w-full"
                     />
                     <Input
                       type="time"
                       value={format(endTime, "HH:mm")}
                       onChange={(e) => {
                         const [hours, minutes] = e.target.value.split(':');
                         const newTime = new Date(endTime);
                         newTime.setHours(parseInt(hours), parseInt(minutes));
                         setEndTime(newTime);
                       }}
                       className="w-full"
                     />
                   </div>
                 </div>
               </div>
               <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                 <p className="text-sm text-blue-800">
                   <strong>Duração:</strong> {Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))} minutos
                 </p>
               </div>
             </CardContent>
           </Card>

          {/* Checklist */}
          {checklistItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Checklist de Verificação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {checklistItems.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <input
                        type="checkbox"
                        id={`checklist-${index}`}
                        checked={checklistResults[index] || false}
                        onChange={(e) => handleChecklistChange(index, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label 
                        htmlFor={`checklist-${index}`}
                        className="text-sm flex-1 cursor-pointer"
                      >
                        {item.item}
                      </label>
                      {checklistResults[index] && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Concluído
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    {checklistItems.filter((_: any, index: number) => checklistResults[index]).length} de {checklistItems.length} itens concluídos
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Observações */}
          <Card>
            <CardHeader>
              <CardTitle>Observações da Execução</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva os trabalhos realizados, observações, problemas encontrados..."
                className="w-full h-24 p-3 border rounded-lg resize-none text-sm"
              />
            </CardContent>
          </Card>

          {/* Botões de ação */}
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isExecuting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCompleteExecution}
              disabled={isExecuting || !allChecklistCompleted}
              className="bg-green-600 hover:bg-green-700"
            >
              {isExecuting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Concluindo...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Concluir Execução
                </>
              )}
            </Button>
          </div>
                 </div>
       </DialogContent>
     </Dialog>
   );
} 