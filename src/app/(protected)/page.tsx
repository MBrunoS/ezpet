"use client";

import { useClients } from "@/hooks/queries/useClientsQuery";
import { useAppointments } from "@/hooks/queries/useAppointmentsQuery";
import { useLowStockProducts } from "@/hooks/queries/useStockQuery";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: clients, isLoading: clientsLoading } = useClients();
  const { data: appointments, isLoading: appointmentsLoading } =
    useAppointments();
  const { data: lowStockProducts, isLoading: stockLoading } =
    useLowStockProducts();

  // Filtrar agendamentos futuros
  const upcomingAppointments =
    appointments
      ?.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        const today = new Date();
        return appointmentDate >= today;
      })
      .slice(0, 5) || [];

  const isLoading = clientsLoading || appointmentsLoading || stockLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Dashboard Header */}
      <div className="flex flex-wrap gap-3 justify-between p-4">
        <p className="text-text tracking-light text-[32px] font-bold leading-tight min-w-72">
          Dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-wrap gap-4 p-4">
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-border">
          <p className="text-base font-medium leading-normal text-text">
            Total de Clientes
          </p>
          <p className="text-2xl font-bold leading-tight text-text tracking-light">
            {clients?.length || 0}
          </p>
        </div>
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-border">
          <p className="text-base font-medium leading-normal text-text">
            Agendamentos Futuros
          </p>
          <p className="text-2xl font-bold leading-tight text-text tracking-light">
            {upcomingAppointments.length}
          </p>
        </div>
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-border">
          <p className="text-base font-medium leading-normal text-text">
            Produtos com Estoque Baixo
          </p>
          <p className="text-2xl font-bold leading-tight text-text tracking-light">
            {lowStockProducts?.length || 0}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-text text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Ações Rápidas
      </h2>
      <div className="flex justify-stretch">
        <div className="flex flex-wrap flex-1 gap-3 justify-start px-4 py-3">
          <Button>
            <span className="truncate">Cadastrar Cliente</span>
          </Button>
          <Button>
            <span className="truncate">Novo Agendamento</span>
          </Button>
        </div>
      </div>

      {/* Upcoming Schedules Table */}
      <h2 className="text-text text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Próximos Agendamentos
      </h2>
      <div className="px-4 py-3">
        <div className="flex overflow-hidden rounded-lg border border-border bg-background">
          {upcomingAppointments.length === 0 ? (
            <div className="flex-1 p-8 text-center text-text-secondary">
              <p>Nenhum agendamento futuro</p>
            </div>
          ) : (
            <table className="flex-1">
              <thead>
                <tr className="bg-background">
                  <th className="px-4 py-3 text-left text-text w-[400px] text-sm font-medium leading-normal">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left text-text w-[400px] text-sm font-medium leading-normal">
                    Pet
                  </th>
                  <th className="px-4 py-3 text-left text-text w-[400px] text-sm font-medium leading-normal">
                    Serviço
                  </th>
                  <th className="px-4 py-3 text-left text-text w-[400px] text-sm font-medium leading-normal">
                    Data
                  </th>
                  <th className="px-4 py-3 text-left text-text w-[400px] text-sm font-medium leading-normal">
                    Horário
                  </th>
                </tr>
              </thead>
              <tbody>
                {upcomingAppointments.map((appointment) => (
                  <tr key={appointment.id} className="border-t border-t-border">
                    <td className="h-[72px] px-4 py-2 w-[400px] text-text text-sm font-normal leading-normal">
                      {appointment.clientName || "Cliente não encontrado"}
                    </td>
                    <td className="h-[72px] px-4 py-2 w-[400px] text-text-secondary text-sm font-normal leading-normal">
                      {appointment.petName || "Pet não encontrado"}
                    </td>
                    <td className="h-[72px] px-4 py-2 w-[400px] text-text-secondary text-sm font-normal leading-normal">
                      {appointment.serviceName || "Serviço não encontrado"}
                    </td>
                    <td className="h-[72px] px-4 py-2 w-[400px] text-text-secondary text-sm font-normal leading-normal">
                      {format(new Date(appointment.date), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </td>
                    <td className="h-[72px] px-4 py-2 w-[400px] text-text-secondary text-sm font-normal leading-normal">
                      {format(new Date(appointment.date), "HH:mm", {
                        locale: ptBR,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Finance Overview */}
      <h2 className="text-text text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Visão Geral Financeira
      </h2>
      <div className="flex flex-wrap gap-4 p-4">
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-border">
          <p className="text-base font-medium leading-normal text-text">
            Receita Total
          </p>
          <p className="text-2xl font-bold leading-tight text-text tracking-light">
            R$ 15.000
          </p>
        </div>
        <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-border">
          <p className="text-base font-medium leading-normal text-text">
            Despesas
          </p>
          <p className="text-2xl font-bold leading-tight text-text tracking-light">
            R$ 3.000
          </p>
        </div>
      </div>
    </div>
  );
}
