"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCorrectiveCall } from "../_actions/create-corrective-call";
import { getContractStructure } from "../_actions/get-contract-structure";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AddCorrectiveDialogProps {
  open: boolean;
  onClose: () => void;
  contractId: string;
  especialidade?: string;
}

interface Floor {
  id: string;
  name: string;
  buildingName: string;
}

interface Location {
  id: string;
  name: string;
  floorName: string;
  buildingName: string;
}

interface Asset {
  id: string;
  name: string;
  tag?: string | null;
  locationName: string;
  floorName: string;
  buildingName: string;
}

const priorities = [
  { value: "ALTA", label: "Alta" },
  { value: "MEDIA", label: "Média" },
  { value: "BAIXA", label: "Baixa" },
];

function getEspecialidadeLabel(especialidade: string): string {
  const labels: Record<string, string> = {
    "CIVIL": "Civil",
    "ELETRICA": "Elétrica",
    "HIDRAULICA": "Hidráulica",
    "AR_CONDICIONADO": "Ar Condicionado",
    "MECANICA": "Mecânica",
    "AQUECIMENTO": "Aquecimento",
    "LIMPEZA": "Limpeza",
    "JARDINAGEM": "Jardinagem",
  };
  return labels[especialidade] || especialidade;
}

export function AddCorrectiveDialog({ open, onClose, contractId, especialidade }: AddCorrectiveDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [customLocation, setCustomLocation] = useState<string>("");
  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const router = useRouter();

  // Carregar dados do contrato quando o diálogo abrir
  useEffect(() => {
    if (open && contractId) {
      loadContractData();
    }
  }, [open, contractId]);

  const loadContractData = async () => {
    setIsLoadingData(true);
    try {
      const result = await getContractStructure(contractId);
      if (result.success && result.data) {
        setFloors(result.data.floors);
        setLocations(result.data.locations);
        setAssets(result.data.assets);
      } else {
        toast.error("Erro ao carregar dados do contrato");
      }
    } catch (error) {
      toast.error("Erro ao carregar dados do contrato");
    } finally {
      setIsLoadingData(false);
    }
  };

  // Preencher localidade automaticamente quando andar for selecionado
  const handleFloorChange = (floorName: string) => {
    setSelectedFloor(floorName);
    // Limpar localidade se não for compatível com o andar selecionado
    const location = locations.find(loc => loc.id === selectedLocation);
    if (location && location.floorName !== floorName) {
      setSelectedLocation("");
      setCustomLocation("");
    }
    // Limpar ativo se não for compatível com o andar selecionado
    const asset = assets.find(asset => asset.id === selectedAsset);
    if (asset && asset.floorName !== floorName) {
      setSelectedAsset("");
    }
  };

  // Preencher andar automaticamente quando localidade for selecionada
  const handleLocationChange = (locationId: string) => {
    setSelectedLocation(locationId);
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
      setSelectedFloor(location.floorName);
      setCustomLocation(location.name);
    }
    // Limpar ativo se não for compatível com a localidade selecionada
    const asset = assets.find(asset => asset.id === selectedAsset);
    if (asset && asset.locationName !== location?.name) {
      setSelectedAsset("");
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    
    try {
      // Adicionar dados selecionados ao formData
      if (selectedFloor) formData.append("floor", selectedFloor);
      if (selectedLocation) formData.append("locationId", selectedLocation);
      if (customLocation) formData.append("location", customLocation);
      if (selectedAsset) formData.append("assetId", selectedAsset);

      const result = await createCorrectiveCall(formData);
      
      if (result.success) {
        toast.success("Corretiva criada com sucesso!");
        onClose();
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao criar corretiva");
      }
    } catch (error) {
      toast.error("Erro ao criar corretiva");
      console.error("Erro ao criar corretiva:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[98vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-2">
            Nova Corretiva - {especialidade ? getEspecialidadeLabel(especialidade) : "Selecionar Especialidade"}
          </DialogTitle>
          <p className="text-center text-muted-foreground text-sm">
            Preencha os detalhes do chamado de manutenção corretiva
          </p>
        </DialogHeader>
        
        <form action={handleSubmit} className="space-y-6">
          <input type="hidden" name="contractId" value={contractId} />
          {especialidade && <input type="hidden" name="especialidade" value={especialidade} />}
          
          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Descrição do Problema
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Descreva detalhadamente o problema ou necessidade..."
              rows={4}
              className="resize-none border-2 focus:border-primary transition-colors"
            />
          </div>

          {/* Grid de campos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Prioridade */}
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                Prioridade
              </Label>
              <Select name="priority" defaultValue="MEDIA">
                <SelectTrigger className="w-full border-2 focus:border-primary transition-colors">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Andar */}
            <div className="space-y-2">
              <Label htmlFor="floor" className="text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Andar
              </Label>
              <Select 
                value={selectedFloor} 
                onValueChange={handleFloorChange}
              >
                <SelectTrigger className="w-full border-2 focus:border-primary transition-colors">
                  <SelectValue placeholder={isLoadingData ? "Carregando..." : "Selecione"} />
                </SelectTrigger>
                <SelectContent>
                  {floors.map((floor) => (
                    <SelectItem key={floor.id} value={floor.name}>
                      {floor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ativo */}
            <div className="space-y-2">
              <Label htmlFor="assetId" className="text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Ativo
              </Label>
              <Select 
                value={selectedAsset} 
                onValueChange={setSelectedAsset}
              >
                <SelectTrigger className="w-full border-2 focus:border-primary transition-colors">
                  <SelectValue placeholder={isLoadingData ? "Carregando..." : "Selecione (opcional)"} />
                </SelectTrigger>
                <SelectContent>
                  {assets
                    .filter(asset => {
                      // Se nenhum andar selecionado, mostrar todos
                      if (!selectedFloor) return true;
                      // Filtrar por andar
                      if (asset.floorName !== selectedFloor) return false;
                      // Se localidade selecionada, filtrar por localidade também
                      if (selectedLocation) {
                        const location = locations.find(loc => loc.id === selectedLocation);
                        return asset.locationName === location?.name;
                      }
                      return true;
                    })
                    .map((asset) => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.tag || asset.name} - {asset.locationName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Localidade */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-semibold flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Localidade
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select 
                value={selectedLocation} 
                onValueChange={handleLocationChange}
              >
                <SelectTrigger className="w-full border-2 focus:border-primary transition-colors">
                  <SelectValue placeholder={isLoadingData ? "Carregando..." : "Selecione da árvore"} />
                </SelectTrigger>
                <SelectContent>
                  {locations
                    .filter(loc => !selectedFloor || loc.floorName === selectedFloor)
                    .map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              
              <Input
                placeholder="Ou digite um local específico..."
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                className="border-2 focus:border-primary transition-colors"
              />
            </div>
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
              className="px-8 py-2 bg-primary hover:bg-primary/90 transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Criando...
                </div>
              ) : (
                "Criar Corretiva"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 