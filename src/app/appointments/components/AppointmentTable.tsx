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
import { Edit, Trash2, Calendar, Clock, Users, PawPrint } from "lucide-react";
import { Appointment } from "../../../types";

interface AppointmentTableProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointment: Appointment) => void;
}

export function AppointmentTable({
  appointments,
  onEdit,
  onDelete,
}: AppointmentTableProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="default">Agendado</Badge>;
      case "completed":
        return <Badge variant="secondary">Concluído</Badge>;
      case "canceled":
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (appointments.length === 0) {
    return (
      <div className="py-8 text-center">
        <Calendar className="mx-auto mb-4 w-12 h-12 text-gray-400" />
        <p className="text-gray-500">Nenhum agendamento encontrado</p>
        <p className="text-sm text-gray-400">
          Clique em "Novo Agendamento" para começar
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Pet</TableHead>
            <TableHead>Serviço</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Horário</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Observações</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <AppointmentTableRow
              key={appointment.id}
              appointment={appointment}
              onEdit={onEdit}
              onDelete={onDelete}
              formatDate={formatDate}
              formatTime={formatTime}
              getStatusBadge={getStatusBadge}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface AppointmentTableRowProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointment: Appointment) => void;
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
  getStatusBadge: (status: Appointment["status"]) => React.ReactNode;
}

function AppointmentTableRow({
  appointment,
  onEdit,
  onDelete,
  formatDate,
  formatTime,
  getStatusBadge,
}: AppointmentTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex gap-2 items-center">
          <Users className="w-4 h-4 text-blue-600" />
          <div>
            <div className="font-medium">{appointment.clientName}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-2 items-center">
          <PawPrint className="w-4 h-4 text-green-600" />
          <span className="font-medium">{appointment.petName}</span>
        </div>
      </TableCell>
      <TableCell>
        <span className="font-medium">{appointment.serviceName}</span>
      </TableCell>
      <TableCell>
        <div className="flex gap-1 items-center">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>{formatDate(appointment.date)}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-1 items-center">
          <Clock className="w-4 h-4 text-gray-500" />
          <span>{formatTime(appointment.date)}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="font-medium text-green-600">
            R$ {appointment.price.toFixed(2)}
          </div>
          {appointment.selectedExtras &&
            appointment.selectedExtras.length > 0 && (
              <div className="text-xs text-gray-500">
                <div>Extras:</div>
                {appointment.selectedExtras.map((extra) => (
                  <div key={extra.id} className="flex justify-between">
                    <span>{extra.name}</span>
                    <span>R$ {extra.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
        </div>
      </TableCell>
      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
      <TableCell>
        {appointment.observations ? (
          <div className="max-w-xs text-sm text-gray-600 truncate">
            {appointment.observations}
          </div>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex gap-2 justify-end items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(appointment)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(appointment)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
