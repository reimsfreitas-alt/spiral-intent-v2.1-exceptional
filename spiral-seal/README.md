# Spiral Seal

**O Envelope Digital que Prova a Entrega.**
O Spiral Seal transforma a entrega de um arquivo em um evento verificável. Ele registra a experiência de acesso e prepara a emissão de uma evidência de entrega (Proof of Delivery).

## O que é este repositório

Esta é a **Landing Page MVP** e o protótipo comercial da ferramenta. O objetivo desta versão é vender a primeira unidade e validar a compreensão do mercado antes de conectar infraestruturas complexas.

## Como rodar localmente

Não requer build, dependências ou servidores.

1. Baixe os arquivos.
2. Abra `index.html` diretamente em um navegador.

## Estado da Tecnologia (Transparência do MVP)

Esta versão é uma vitrine comercial com uma demonstração interativa. A diferença entre interface real e simulação é deliberadamente explícita.

* **REAL (frontend):** interface, proposta de valor, fluxo UX, estrutura visual do Proof of Delivery e CTAs comerciais.
* **DEMO (simulado no navegador):** hash exibido, registro do evento, timestamp e sequência de abertura do selo.
* **NÃO IMPLEMENTADO:** armazenamento de arquivo no servidor, link único persistido, registro de acesso em banco, recibo criptograficamente assinado e mecanismo de burn-after-read.

Uma implementação de produção exigirá backend, persistência, controle de acesso, armazenamento e mecanismo criptográfico apropriados.

## Deployment

O MVP está isolado na branch `spiral-seal-v1-emergency` do repositório `reimsfreitas-alt/spiral-intent-v2.1-exceptional`, preservando a produção do Spiral Intent.

A página fica em `spiral-seal/index.html` e é compatível com hospedagem estática na Vercel.
