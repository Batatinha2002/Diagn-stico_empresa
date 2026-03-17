# Configuração do Envio Automático de E-mail

## Resumo da Funcionalidade

Sempre que um usuário finalizar o diagnóstico, o PDF gerado será automaticamente enviado para **eduardokopeski@gmail.com** com:
- Dados do lead (nome, empresa, email, telefone)
- Pontuação geral e por área
- PDF completo do diagnóstico anexado

O usuário continua recebendo o PDF para download normalmente.

---

## Como Configurar

### 1. Criar Conta no Resend

1. Acesse [https://resend.com/](https://resend.com/)
2. Clique em "Sign Up" e crie uma conta gratuita
3. Confirme seu e-mail

**Plano Gratuito:**
- 100 e-mails por dia
- 3.000 e-mails por mês
- Sem custo

---

### 2. Obter a API Key

1. Faça login no [dashboard do Resend](https://resend.com/dashboard)
2. No menu lateral, clique em **"API Keys"**
3. Clique em **"Create API Key"**
4. Dê um nome (ex: "Diagnóstico Winn")
5. Selecione as permissões: **"Sending access"**
6. Clique em **"Create"**
7. **COPIE A CHAVE** (ela só será mostrada uma vez!)

A chave tem este formato: `re_xxxxxxxxxxxxxxxxxxxxxxxxxx`

---

### 3. Configurar no Vercel

#### Opção A: Via Dashboard (Recomendado)

1. Acesse [https://vercel.com/](https://vercel.com/) e faça login
2. Selecione seu projeto do diagnóstico
3. Vá em **"Settings"** (engrenagem no topo)
4. No menu lateral, clique em **"Environment Variables"**
5. Clique em **"Add New"**
6. Preencha:
   - **Name:** `RESEND_API_KEY`
   - **Value:** Cole a chave do Resend (ex: `re_abc123...`)
   - **Environment:** Selecione **Production**, **Preview** e **Development**
7. Clique em **"Save"**

#### Opção B: Via Vercel CLI

```bash
vercel env add RESEND_API_KEY
# Cole sua chave quando solicitado
# Selecione todos os ambientes (Production, Preview, Development)
```

---

### 4. Fazer Redeploy

**IMPORTANTE:** Após adicionar a variável de ambiente, você precisa fazer um novo deploy para as mudanças surtirem efeito.

#### Opção A: Via Git (Recomendado)

```bash
# Faça commit das mudanças
git add .
git commit -m "Adiciona envio automático de e-mail"
git push
```

O Vercel detectará automaticamente e fará o redeploy.

#### Opção B: Via Dashboard

1. Vá em **"Deployments"**
2. Clique nos **três pontos (...)** do último deployment
3. Selecione **"Redeploy"**
4. Confirme

#### Opção C: Via CLI

```bash
vercel --prod
```

---

### 5. Testar

1. Acesse seu site em produção
2. Complete o diagnóstico com dados de teste
3. Finalize e gere o PDF
4. Verifique se o e-mail chegou em **eduardokopeski@gmail.com**

**Dica:** Pode levar alguns segundos para o e-mail chegar. Verifique também a pasta de spam.

---

## Instalar Dependências Localmente (Desenvolvimento)

Se quiser testar localmente antes de fazer deploy:

```bash
cd "gráfico de avaliação winn"
npm install
```

Isso instalará a dependência `resend` adicionada ao `package.json`.

Para rodar localmente, você também precisará criar um arquivo `.env` (baseado no `.env.example`):

```bash
cp .env.example .env
# Edite o .env e adicione sua RESEND_API_KEY
```

---

## Solução de Problemas

### E-mail não está sendo enviado

1. **Verifique a variável de ambiente:**
   - Acesse Vercel Dashboard > Settings > Environment Variables
   - Confirme que `RESEND_API_KEY` está configurada

2. **Verifique os logs do Vercel:**
   - Vá em "Deployments" > Clique no último deploy
   - Clique em "Functions" > "api/send-email"
   - Verifique se há erros nos logs

3. **Verifique a chave do Resend:**
   - Acesse o dashboard do Resend
   - Vá em "API Keys"
   - Verifique se a chave está ativa
   - Se necessário, gere uma nova chave

4. **Refaça o deploy:**
   - Após qualquer mudança nas variáveis de ambiente, sempre faça redeploy

### E-mail vai para spam

- Isso é normal ao usar o domínio padrão do Resend (`onboarding@resend.dev`)
- Para melhorar a entrega, você pode configurar um domínio próprio no Resend (Instruções: [https://resend.com/docs/dashboard/domains/introduction](https://resend.com/docs/dashboard/domains/introduction))

---

## Mudanças Realizadas no Código

### Arquivos Criados:
1. **`api/send-email.js`** - API serverless para envio de e-mail
2. **`.env.example`** - Exemplo de configuração
3. **`CONFIGURACAO-EMAIL.md`** - Este arquivo de documentação

### Arquivos Modificados:
1. **`package.json`** - Adicionada dependência `resend: ^3.2.0`
2. **`script.js`** - Adicionado chamada à API de e-mail após geração do PDF

### Como Funciona:

1. Usuário completa o diagnóstico
2. Sistema gera o PDF (funcionalidade existente)
3. Usuário baixa o PDF normalmente
4. **NOVO:** Em paralelo, o sistema:
   - Converte o PDF para base64
   - Envia para `/api/send-email`
   - API envia e-mail com PDF anexado para eduardokopeski@gmail.com
   - Mostra notificação sutil de sucesso/erro

**Importante:** O download do PDF SEMPRE funciona, mesmo se o envio do e-mail falhar.

---

## Suporte

Em caso de dúvidas:
- Documentação do Resend: [https://resend.com/docs](https://resend.com/docs)
- Documentação do Vercel: [https://vercel.com/docs](https://vercel.com/docs)
