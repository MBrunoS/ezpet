"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Pet } from "@/types";

interface PetsSectionProps {
  pets: Pet[];
  onAddPet: () => void;
  onEditPet: (pet: Pet) => void;
  onRemovePet: (pet: Pet) => void;
}

export function PetsSection({
  pets,
  onAddPet,
  onEditPet,
  onRemovePet,
}: PetsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Pets ({pets.length})</h3>
        <Button
          type="button"
          onClick={onAddPet}
          className="flex gap-2 items-center"
        >
          <Plus className="w-4 h-4" />
          Adicionar Pet
        </Button>
      </div>

      {pets.length === 0 && (
        <div className="py-8 text-center text-gray-500">
          Nenhum pet cadastrado. Clique em "Adicionar Pet" para começar.
        </div>
      )}

      {/* Lista de Pets */}
      {pets.length > 0 && (
        <div className="space-y-3">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="flex justify-between items-center p-3 bg-white rounded-lg border"
            >
              <div>
                <div className="font-medium">{pet.name}</div>
                <div className="text-sm text-gray-600">
                  {pet.species} • {pet.breed} • {pet.age} anos • {pet.weight}kg
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onEditPet(pet)}
                >
                  Editar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onRemovePet(pet)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remover
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
