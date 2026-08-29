# Spiral Seal — MVP

Primeira implementação visual do conceito de entrega controlada de arquivos.

## Estado atual

Este MVP é uma demonstração estática/interativa. O fluxo do botão simula a abertura do selo e gera um pequeno arquivo local de demonstração para tornar a interação real no navegador.

Não há, nesta versão:

- armazenamento real de arquivos;
- link de uso único persistido no servidor;
- recibo criptográfico de produção;
- blockchain;
- validação jurídica do evento.

Esses componentes exigem backend, persistência e infraestrutura de segurança próprios.

## Deploy

O projeto foi isolado na branch `spiral-seal-v1-emergency` do repositório `reimsfreitas-alt/spiral-intent-v2.1-exceptional` para não alterar a produção do Spiral Intent.

A página está em `spiral-seal/index.html` e pode ser servida como site estático.