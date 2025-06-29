"use client";

import { useState } from "react";
import { useClients } from "@/hooks/queries/useClientsQuery";
import { useAppointments } from "@/hooks/queries/useAppointmentsQuery";
import { useLowStockProducts } from "@/hooks/queries/useStockQuery";
import { usePets } from "@/hooks/queries/usePetsQuery";
import { useServices } from "@/hooks/queries/useServicesQuery";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Users,
  Calendar as CalendarIcon,
  Package,
  ArrowUpDown,
  LayoutList,
  Link,
  Check,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDialog } from "@/contexts/DialogContext";
import { toast } from "sonner";

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [copied, setCopied] = useState(false);

  const { user } = useAuth();
  const { data: clients, isLoading: clientsLoading } = useClients();
  const { data: appointments, isLoading: appointmentsLoading } =
    useAppointments();
  const { data: pets, isLoading: petsLoading } = usePets();
  const { data: services, isLoading: servicesLoading } = useServices();
  const { data: lowStockProducts, isLoading: stockLoading } =
    useLowStockProducts();

  const { openDialog } = useDialog();

  // Filtrar agendamentos futuros
  const upcomingAppointments =
    appointments
      ?.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);
        const today = new Date();
        return appointmentDate >= today;
      })
      .slice(0, 5) || [];

  const isLoading =
    clientsLoading ||
    appointmentsLoading ||
    stockLoading ||
    petsLoading ||
    servicesLoading;

  const handleAppointmentClick = (appointment: any) => {
    openDialog("appointment-details", { appointment });
  };

  const handleNewItem = (type: string) => {
    switch (type) {
      case "client":
        openDialog("client-form", { client: undefined });
        break;
      case "appointment":
        openDialog("appointment-form", { appointment: undefined });
        break;
      case "product":
        openDialog("product-form", { product: undefined });
        break;
      case "movement":
        openDialog("stock-movement-form", { product: undefined });
        break;
      case "service":
        openDialog("service-form", { service: undefined });
        break;
    }
  };

  const handleCopyBookingLink = async () => {
    if (!user?.uid) {
      toast.error("Usuário não identificado");
      return;
    }

    const bookingUrl = `${window.location.origin}/booking/${user.uid}`;

    try {
      await navigator.clipboard.writeText(bookingUrl);
      setCopied(true);
      toast.success("Link de agendamento copiado!");

      // Reset do estado após 2 segundos
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Erro ao copiar link");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap gap-3 justify-between p-4 mb-12">
        <p className="text-text tracking-light text-[32px] font-bold leading-tight min-w-72">
          Bem-vindo{user?.displayName ? `, ${user?.displayName}` : ""}!
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleCopyBookingLink}
            variant="outline"
            className="flex gap-2 items-center px-6 py-3 text-lg font-bold"
          >
            {copied ? (
              <>
                <Check className="!w-6 !h-6 text-green-600" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Link className="!w-6 !h-6" />
                <span>Link de Agendamento</span>
              </>
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex gap-2 items-center px-6 py-3 text-lg font-bold">
                <Plus className="!w-6 !h-6" />
                <span>Novo</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => handleNewItem("movement")}>
                <ArrowUpDown className="mr-2 w-4 h-4" />
                <span>Nova Movimentação</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNewItem("product")}>
                <Package className="mr-2 w-4 h-4" />
                <span>Novo Produto</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNewItem("appointment")}>
                <CalendarIcon className="mr-2 w-4 h-4" />
                <span>Novo Agendamento</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNewItem("client")}>
                <Users className="mr-2 w-4 h-4" />
                <span>Novo Cliente</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNewItem("service")}>
                <LayoutList className="mr-2 w-4 h-4" />
                <span>Novo Serviço</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col gap-6 px-4 pb-6 lg:flex-row">
        {/* Left Column - Info Cards */}
        <div className="flex flex-col gap-6 lg:w-1/3">
          <div>
            <h2 className="text-text text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
              Informações Gerais
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 p-6 bg-white rounded-lg border border-border">
                <p className="text-base font-medium leading-normal text-text">
                  Total de Clientes
                </p>
                <p className="text-3xl font-bold leading-tight text-text tracking-light">
                  {clients?.length || 0}
                </p>
              </div>

              <div className="flex flex-col gap-2 p-6 bg-white rounded-lg border border-border">
                <p className="text-base font-medium leading-normal text-text">
                  Agendamentos Futuros
                </p>
                <p className="text-3xl font-bold leading-tight text-text tracking-light">
                  {upcomingAppointments.length}
                </p>
              </div>

              <div className="flex flex-col gap-2 p-6 bg-white rounded-lg border border-border">
                <p className="text-base font-medium leading-normal text-text">
                  Produtos com Estoque Baixo
                </p>
                <p className="text-3xl font-bold leading-tight text-text tracking-light">
                  {lowStockProducts?.length || 0}
                </p>
              </div>

              <div className="flex flex-col gap-2 p-6 bg-white rounded-lg border border-border">
                <p className="text-base font-medium leading-normal text-text">
                  Total de Pets
                </p>
                <p className="text-3xl font-bold leading-tight text-text tracking-light">
                  {pets?.length || 0}
                </p>
              </div>

              <div className="flex flex-col gap-2 p-6 bg-white rounded-lg border border-border">
                <p className="text-base font-medium leading-normal text-text">
                  Serviços Disponíveis
                </p>
                <p className="text-3xl font-bold leading-tight text-text tracking-light">
                  {services?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Calendar */}
        <div className="flex flex-col gap-4 lg:w-2/3">
          <h2 className="text-text text-[22px] font-bold leading-tight tracking-[-0.015em]">
            Calendário de Agendamentos
          </h2>
          <div className="bg-white rounded-lg border border-border">
            <Calendar
              appointments={appointments || []}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              onAppointmentClick={handleAppointmentClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
