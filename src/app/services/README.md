# Página de Serviços

Esta página permite gerenciar os serviços oferecidos pelo pet shop, incluindo nome, preço, duração e extras opcionais.

## Funcionalidades

- **Listagem de Serviços**: Visualize todos os serviços cadastrados em uma tabela organizada
- **Criação de Serviços**: Adicione novos serviços com informações completas
- **Edição de Serviços**: Modifique informações de serviços existentes
- **Exclusão de Serviços**: Remova serviços que não são mais oferecidos
- **Gerenciamento de Extras**: Adicione, edite e remova extras para cada serviço
- **Status Ativo/Inativo**: Controle quais serviços aparecem nos agendamentos

## Campos dos Serviços

- **Nome**: Nome do serviço (ex: "Banho e Tosa")
- **Preço**: Valor em reais do serviço base
- **Duração**: Tempo em minutos que o serviço leva para ser executado
- **Descrição**: Descrição detalhada do serviço (opcional)
- **Extras**: Lista de opções adicionais com preços extras
- **Status**: Se o serviço está ativo ou inativo

## Extras dos Serviços

Cada serviço pode ter múltiplos extras que representam variações ou adições:

- **Nome do Extra**: Nome da opção adicional (ex: "Tosa Bebê", "Hidratação")
- **Preço Adicional**: Valor extra cobrado pelo extra
- **Descrição**: Descrição detalhada do extra (opcional)

### Exemplos de Extras:
- **Banho e Tosa**: "Tosa Higiênica", "Hidratação", "Perfumação"
- **Tosa**: "Tosa Bebê", "Tosa Especial", "Escovação"
- **Banho**: "Hidratação", "Perfumação", "Secagem Especial"

## Integração com Agendamentos

Os serviços criados aqui são utilizados na página de agendamentos para:

- Selecionar o tipo de serviço a ser agendado
- Escolher extras adicionais
- Calcular automaticamente o preço total (serviço + extras)
- Determinar a duração do serviço para verificar disponibilidade de horários
- Mostrar informações detalhadas do serviço e extras no formulário

## Validações

- Nome é obrigatório
- Preço deve ser maior ou igual a zero
- Duração deve estar entre 15 minutos e 8 horas
- Extras devem ter nome e preço válidos
- Serviços inativos não aparecem nos agendamentos 