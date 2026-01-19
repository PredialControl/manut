"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { createAsset } from "../_actions/create-asset";
import { useEffect, useMemo } from "react";
import { Location, Floor } from "@prisma/client";
import { ImageUpload } from "../../_components/image-upload";

interface AddAssetDialogProps {
  locations: (Location & { floor: Floor })[];
}

export function AddAssetDialog({ locations }: AddAssetDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const initialState = { message: "", errors: {} };
  const [state, dispatch] = useFormState(createAsset, initialState);

  useEffect(() => {
    if (state.message === "SUCCESS") {
      toast.success("Ativo criado com sucesso!");
      setOpen(false);
      setSelectedImage("");
    } else if (state.message && !state.message.includes("validação")) {
      toast.error(state.message);
    }
  }, [state]);

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const groupedLocations = useMemo(() => {
    if (!locations) return {};
    return locations.reduce((acc, location) => {
      const floorName = location.floor.name;
      if (!acc[floorName]) {
        acc[floorName] = [];
      }
      acc[floorName].push(location);
      return acc;
    }, {} as Record<string, Location[]>);
  }, [locations]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Ativo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Ativo</DialogTitle>
        </DialogHeader>
        <form action={dispatch} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Ativo</Label>
            <Input id="name" name="name" required />
            {state?.errors?.name && <p className="text-sm text-destructive mt-1">{state.errors.name[0]}</p>}
          </div>
          <div>
            <Label htmlFor="locationId">Localização</Label>
            <Select name="locationId" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma localização" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(groupedLocations).map(([floorName, locs]) => (
                  <div key={floorName}>
                    <p className="px-2 py-1.5 text-sm font-semibold">{floorName}</p>
                    {locs.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
            {state?.errors?.locationId && <p className="text-sm text-destructive mt-1">{state.errors.locationId[0]}</p>}
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue="ATIVO">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ATIVO">Ativo</SelectItem>
                <SelectItem value="INATIVO">Inativo</SelectItem>
                <SelectItem value="MANUTENCAO">Em Manutenção</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ImageUpload onImageSelect={handleImageSelect} />

          <div className="flex justify-end">
            <Button type="submit">Salvar Ativo</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 