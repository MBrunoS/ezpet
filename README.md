# 🐾 EzPet - Sistema de Gestão para Pet Shops

Sistema de gestão simples e eficiente desenvolvido especificamente para pet shops, com foco na simplicidade e usabilidade.

## ✨ Funcionalidades

### 📅 **Agendamento Online**
- Sistema de agendamento público para clientes
- Cadastro de clientes e pets
- Seleção de serviços e horários disponíveis
- Confirmação automática de agendamentos

### 👥 **Gestão de Clientes**
- Cadastro completo de clientes
- Gestão de pets por cliente
- Histórico de agendamentos
- Informações de contato

### 🏥 **Gestão de Serviços**
- Cadastro de serviços oferecidos
- Definição de preços e durações
- Configuração de extras opcionais
- Controle de serviços ativos/inativos

### 📊 **Dashboard Intuitivo**
- Visão geral dos agendamentos
- Estatísticas de clientes e pets
- Calendário mensal interativo
- Acesso rápido às principais funcionalidades

### 📦 **Controle de Estoque**
- Cadastro de produtos
- Controle de movimentações
- Alertas de estoque baixo
- Histórico de entradas e saídas

### ⚙️ **Configurações do Pet Shop**
- Perfil do estabelecimento
- Horários de funcionamento
- Informações de contato
- Configurações personalizadas

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **shadcn/ui** - Componentes UI modernos
- **Lucide React** - Ícones
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

### **Backend & Banco de Dados**
- **Firebase** - Backend as a Service
- **Firestore** - Banco de dados NoSQL
- **Firebase Auth** - Autenticação com Google
- **Firebase Hosting** - Deploy e hospedagem

### **Estado & Queries**
- **TanStack Query** - Gerenciamento de estado e cache
- **React Context** - Estado global da aplicação

### **Outras Ferramentas**
- **date-fns** - Manipulação de datas
- **Sonner** - Notificações toast
- **React Icons** - Biblioteca de ícones

## 🚀 Como Executar o Projeto

### **Pré-requisitos**
- Node.js 18+ 
- pnpm (recomendado) ou npm
- Conta no Firebase

### **1. Clone o repositório**
```bash
git clone https://github.com/seu-usuario/ezpet.git
cd ezpet
```

### **2. Instale as dependências**
```bash
pnpm install
```

### **3. Configure o Firebase**
1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative o Authentication com Google
3. Crie um banco Firestore
5. Configure as regras de segurança do Firestore
4. Copie as credenciais do projeto

### **4. Configure as variáveis de ambiente**
Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

### **5. Execute o projeto**
```bash
pnpm dev
```

O projeto estará disponível em `http://localhost:3000`

## 📱 Como Usar

### **Para Pet Shops (Administradores)**

1. **Primeiro Acesso**
   - Acesse a landing page
   - Clique em "Começar Agora"
   - Faça login com sua conta Google
   - Configure seu perfil do pet shop

2. **Configuração Inicial**
   - Defina horários de funcionamento
   - Cadastre os serviços oferecidos
   - Configure informações de contato

3. **Gestão Diária**
   - Use o dashboard para visão geral
   - Gerencie agendamentos na seção "Agendamentos"
   - Cadastre clientes e pets
   - Controle o estoque de produtos

### **Para Clientes**

1. **Agendamento Online**
   - Acesse o link de agendamento do pet shop
   - Cadastre-se como cliente
   - Adicione seus pets
   - Escolha serviço, data e horário
   - Confirme o agendamento

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🎯 Roadmap

### **Próximas Funcionalidades**
- [ ] Notificações por email/SMS
- [ ] Relatórios avançados
- [ ] Pagamentos online
- [ ] Integração com WhatsApp
- [ ] App mobile nativo

---

**Desenvolvido com ❤️ para pet shops que merecem o melhor!** 