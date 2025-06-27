# Página de Serviços

Esta página permite gerenciar os serviços oferecidos pelo pet shop, incluindo nome, preço e duração.

## Funcionalidades

- **Listagem de Serviços**: Visualize todos os serviços cadastrados em uma tabela organizada
- **Criação de Serviços**: Adicione novos serviços com informações completas
- **Edição de Serviços**: Modifique informações de serviços existentes
- **Exclusão de Serviços**: Remova serviços que não são mais oferecidos
- **Status Ativo/Inativo**: Controle quais serviços aparecem nos agendamentos

## Campos dos Serviços

- **Nome**: Nome do serviço (ex: "Banho e Tosa")
- **Preço**: Valor em reais do serviço
- **Duração**: Tempo em minutos que o serviço leva para ser executado
- **Descrição**: Descrição detalhada do serviço (opcional)
- **Status**: Se o serviço está ativo ou inativo

## Integração com Agendamentos

Os serviços criados aqui são utilizados na página de agendamentos para:

- Selecionar o tipo de serviço a ser agendado
- Calcular automaticamente o preço do agendamento
- Determinar a duração do serviço para verificar disponibilidade de horários
- Mostrar informações detalhadas do serviço no formulário

## Validações

- Nome é obrigatório
- Preço deve ser maior ou igual a zero
- Duração deve estar entre 15 minutos e 8 horas
- Serviços inativos não aparecem nos agendamentos 