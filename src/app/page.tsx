"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PawPrint,
  Calendar,
  Users,
  BarChart3,
  Package,
  Zap,
  CheckCircle,
  ArrowRight,
  Shield,
  Clock,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const year = new Date().getFullYear();

  useEffect(() => {
    if (user && !loading) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  const features = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Agendamento Online",
      description:
        "Sistema de agendamento público para clientes agendarem diretamente",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Gestão de Clientes",
      description: "Cadastro completo de clientes e seus pets",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Dashboard Intuitivo",
      description: "Visão geral dos agendamentos, clientes e estoque",
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: "Controle de Estoque",
      description: "Gestão de produtos e movimentações",
    },
  ];

  const benefits = [
    "Agendamento online direto pelos clientes",
    "Gestão completa de clientes e pets",
    "Controle de estoque e produtos",
    "Dashboard com visão geral do negócio",
    "Configuração de horários de funcionamento",
    "Interface intuitiva e fácil de usar",
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-32 h-32 rounded-full border-b-2 animate-spin border-primary"></div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b backdrop-blur-sm bg-white/80">
        <div className="container flex justify-between items-center px-4 py-4 mx-auto">
          <div className="flex gap-2 items-center">
            <div className="flex justify-center items-center w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg">
              <PawPrint className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              EzPet
            </span>
          </div>
          <Button className="flex gap-2 items-center" asChild>
            <Link href="/login">
              <Zap className="w-4 h-4" />
              Começar Agora
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-20 mx-auto text-center">
        <h1 className="mb-6 text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 md:text-7xl">
          Transforme seu Pet Shop
        </h1>
        <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600 md:text-2xl">
          Gerencie agendamentos, clientes e estoque de forma simples e
          eficiente. Foque no que realmente importa: cuidar dos pets!
        </p>
        <div className="flex flex-col gap-4 justify-center items-center mb-12 sm:flex-row">
          <Button
            size="lg"
            className="flex gap-2 items-center px-8 py-6 text-lg"
            asChild
          >
            <Link href="/login">
              Começar Gratuitamente
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Ferramentas essenciais para modernizar seu pet shop
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-md transition-shadow duration-300 hover:shadow-lg"
              >
                <CardHeader>
                  <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full">
                    <div className="text-green-600">{feature.icon}</div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-16 justify-center items-center lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-4xl font-bold">
                Por que escolher o EzPet?
              </h2>
              <p className="mb-8 text-xl text-gray-600">
                Sistema desenvolvido especificamente para pet shops, com foco na
                simplicidade.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-600" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <Card className="p-8 border-0 shadow-xl backdrop-blur-sm bg-white/80">
              <div className="flex gap-4 items-center mb-6">
                <div className="flex justify-center items-center w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Segurança Garantida</h3>
                  <p className="text-sm text-gray-600">
                    Seus dados protegidos com autenticação Google
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-center mb-6">
                <div className="flex justify-center items-center w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Horários Flexíveis</h3>
                  <p className="text-sm text-gray-600">
                    Configure seus horários de funcionamento
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="flex justify-center items-center w-12 h-12 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-full">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Custo Operacional</h3>
                  <p className="text-sm text-gray-600">
                    Cobramos apenas pelos custos de operação
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-600">
        <div className="container px-4 mx-auto text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">
            Pronto para transformar seu pet shop?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-green-100">
            Sistema simples e eficiente para modernizar seu pet shop
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="flex gap-2 items-center px-8 py-6 mx-auto text-lg text-green-600 bg-white hover:bg-gray-100 h-fit w-fit"
            asChild
          >
            <Link href="/login">
              Começar Agora - É Grátis!
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-white bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="text-center text-gray-400">
            <p>&copy; {year} EzPet. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
