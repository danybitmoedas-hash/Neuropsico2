# Apoio à Intervenção — MVP

App simples: cola-se um texto clínico anonimizado e a IA (Gemini) sugere hipóteses de
plano de intervenção, organizadas por área. Feito para validar a ideia sem custo antes
de investir em app mobile.

## Rodar localmente

1. Instale as dependências:
   ```
   npm install
   ```
2. Pegue uma chave gratuita do Gemini em https://aistudio.google.com/apikey
3. Copie `.env.example` para `.env.local` e cole sua chave:
   ```
   cp .env.example .env.local
   ```
4. Rode:
   ```
   npm run dev
   ```
5. Abra http://localhost:3000

## Publicar no Vercel (grátis)

1. Crie um repositório no GitHub e suba esta pasta.
2. Em https://vercel.com, clique em "Add New Project" e importe o repositório.
3. Em "Environment Variables", adicione `GEMINI_API_KEY` com sua chave.
4. Deploy. O Vercel te dá uma URL pública (ex: `seu-app.vercel.app`) para compartilhar
   com os primeiros profissionais que forem testar.

## Limites do free tier do Gemini

O tier gratuito tem limite de requisições por dia — suficiente para validar a ideia
com um grupo pequeno de testers. Se a validação for bem, aí sim vale considerar um
plano pago ou migrar para a Anthropic API.

## Próximos passos depois da validação

- Adicionar histórico de sugestões (precisa de banco de dados — sai do free tier)
- Migrar para app mobile (Expo/React Native), reaproveitando esta mesma API
- Refinar o prompt do modelo com exemplos reais de bons planos de intervenção
