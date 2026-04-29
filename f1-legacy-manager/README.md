# F1 Legacy Manager (MVP)

Simulador de gestão de automobilismo com dados fictícios e editáveis.

## Instalação
```bash
npm install
```

## Rodar
```bash
npm run dev
```

## Build
```bash
npm run build
```

## Estrutura
- `src/data`: banco de dados local editável
- `src/types`: tipagens
- `src/engine`: lógica de simulação
- `src/store`: estado global + save/load localStorage
- `src/app`: interface principal
- `src/utils`, `src/components`, `src/pages`: reservados para expansão

## Funcionalidades implementadas
- Menu inicial (novo jogo, continuar, banco de dados, configurações)
- Criação de carreira (ano 2006-2026, equipe, realidade, caos, dificuldade)
- Dashboard da equipe (equipe, orçamento, reputação, moral, motor, pontos)
- Tela de pilotos e atributos básicos via tabela
- Tela de carro com atributos técnicos
- Desenvolvimento de peças com custo/risco/ganho
- Calendário com 8 pistas fictícias
- Simulação de corrida com eventos (safety car, erro, volta rápida, chuva inicial)
- Classificação de pilotos e construtores
- Mercado básico (renovação/hire/fire/promote via ações)
- Encerramento de temporada e avanço de ano com evolução/regressão
- Persistência em `localStorage`

## Limitações do MVP
- UI única em dashboard (sem roteamento completo por telas dedicadas)
- Estratégia durante corrida simplificada em preset pré-corrida
- Mercado com ações básicas e sem negociação aprofundada
- Dados iniciais gerados de forma fictícia simplificada

## Próximas ideias
- Dividir páginas por rota
- Motor de corrida volta a volta com comandos em tempo real
- Academia de pilotos completa
- Editor de base de dados in-game
- Migração opcional para backend
