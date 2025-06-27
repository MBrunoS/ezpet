"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Edit, Trash2, Settings, DollarSign, Clock } from "lucide-react";
import { Service } from "../../../types";

interface ServiceTableProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
}

export function ServiceTable({
  services,
  onEdit,
  onDelete,
}: ServiceTableProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default">Ativo</Badge>
    ) : (
      <Badge variant="secondary">Inativo</Badge>
    );
  };

  if (services.length === 0) {
    return (
      <div className="py-8 text-center">
        <Settings className="mx-auto mb-4 w-12 h-12 text-gray-400" />
        <p className="text-gray-500">Nenhum serviço encontrado</p>
        <p className="text-sm text-gray-400">
          Clique em "Novo Serviço" para começar
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Serviço</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Duração</TableHead>
            <TableHead>Extras</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <ServiceTableRow
              key={service.id}
              service={service}
              onEdit={onEdit}
              onDelete={onDelete}
              formatPrice={formatPrice}
              formatDuration={formatDuration}
              getStatusBadge={getStatusBadge}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface ServiceTableRowProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  formatPrice: (price: number) => string;
  formatDuration: (duration: number) => string;
  getStatusBadge: (isActive: boolean) => React.ReactNode;
}

function ServiceTableRow({
  service,
  onEdit,
  onDelete,
  formatPrice,
  formatDuration,
  getStatusBadge,
}: ServiceTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium">{service.name}</div>
          {service.description && (
            <div className="text-sm text-gray-500 truncate max-w-xs">
              {service.description}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-1 items-center">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="font-medium">{formatPrice(service.price)}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-1 items-center">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>{formatDuration(service.duration)}</span>
        </div>
      </TableCell>
      <TableCell>
        {service.extras && service.extras.length > 0 ? (
          <div className="space-y-1">
            {service.extras.slice(0, 2).map((extra) => (
              <Badge key={extra.id} variant="outline" className="text-xs">
                {extra.name} (+{formatPrice(extra.price)})
              </Badge>
            ))}
            {service.extras.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{service.extras.length - 2} mais
              </Badge>
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-500">Nenhum extra</span>
        )}
      </TableCell>
      <TableCell>{getStatusBadge(service.isActive)}</TableCell>
      <TableCell className="text-right">
        <div className="flex gap-2 justify-end items-center">
          <Button variant="outline" size="sm" onClick={() => onEdit(service)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(service)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
