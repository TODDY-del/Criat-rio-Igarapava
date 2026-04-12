# Criatório Igarapava — Sistema de Cadastro de Pássaros

Sistema web para o Criatório Igarapava (Silvio Moreira — Curiós, Canto e Repetição).  
Permite cadastrar pássaros, montar a árvore genealógica e gerar fichas idênticas ao modelo original para impressão.

---

## 📁 Estrutura do Projeto

```
Projeto Passarinho/
├── index.html          → Lista de pássaros cadastrados
├── cadastro.html       → Formulário de cadastro / edição
├── ficha.html          → Preview da ficha gerada + botão imprimir/baixar
├── css/
│   └── style.css       → Estilos (tema escuro + neon verde)
├── js/
│   ├── firebase-config.js  → Configuração do Firebase
│   ├── cadastro.js         → CRUD no Firestore (+ fallback localStorage)
│   └── ficha.js            → Geração da ficha via Canvas API
└── assets/
    ├── Criatorio_Igarapava_Silvio_Moreira.svg  → Arquivo original da ficha
    └── ficha_fundo.png   ← CRIAR: SVG exportado como PNG alta resolução
```

---

## 🚀 Como Usar (Modo Offline / Teste Local)

O sistema funciona **sem Firebase** usando `localStorage` como fallback:

1. Abra `index.html` em um servidor local (ex: extensão **Live Server** do VS Code)
2. Clique em **"ADICIONAR PÁSSARO"** para cadastrar
3. Preencha os campos e clique em **"SALVAR PÁSSARO"**
4. A ficha é gerada automaticamente usando o SVG original

> ⚠️ **Abrir o arquivo diretamente (duplo clique)** pode bloquear módulos ES (CORS).  
> Use um servidor local como Live Server ou `npx serve .`

---

## 🔥 Configuração do Firebase (Para salvar na nuvem)

1. Acesse [firebase.google.com](https://firebase.google.com) e crie um projeto
2. Ative o **Firestore Database** (modo teste)
3. Copie as credenciais em **Configurações do projeto → Apps**
4. Edite `js/firebase-config.js` com suas credenciais reais:

```javascript
const firebaseConfig = {
  apiKey:            "sua-api-key-aqui",
  authDomain:        "seu-projeto.firebaseapp.com",
  projectId:         "seu-projeto",
  storageBucket:     "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc123"
};
```

---

## 🖨️ Melhoria da Qualidade da Ficha Impressa

Atualmente o sistema usa o SVG como fundo. Para qualidade máxima:

1. Abra `assets/Criatorio_Igarapava_Silvio_Moreira.svg` no **Inkscape** (grátis)
2. Exporte como PNG em **2410 × 1810 px** (ou maior, até 4820 × 3620)
3. Salve como `assets/ficha_fundo.png`
4. Calibre as coordenadas em `js/ficha.js` se necessário

---

## 📋 Checklist da Especificação

- [x] Formulário com 19 campos (campos 1–19)
- [x] Fundo preto + sidebar lateral com botões circulares
- [x] Botão "ADICIONAR PÁSSARO" no canto inferior direito
- [x] Todos os campos com fundo branco e sem placeholder
- [x] Campo 5 com borda vermelha (FÊMEA) ou azul (MACHO) em tempo real
- [x] Máscara de data dd/mm/aaaa no campo 3
- [x] Árvore genealógica (pais de 7 ancestrais — campos 6–19)
- [x] Firebase Firestore + fallback localStorage offline
- [x] Geração da ficha via Canvas API
- [x] Borda colorida do campo 5 na ficha gerada
- [x] Download como PNG
- [x] Impressão em janela separada
- [x] Busca/filtro por nome e código
- [x] Modo de edição de pássaro existente
- [x] Deleção com confirmação
- [ ] Exportar SVG como PNG em alta resolução (`assets/ficha_fundo.png`)
- [ ] Calibrar coordenadas após exportação do PNG
- [ ] Confirmar se o número **265133** é fixo ou varia por pássaro
- [ ] Confirmar se o campo **CTF** é fixo ou varia por pássaro
- [ ] Configurar Firebase com credenciais reais
- [ ] Deploy no [Vercel](https://vercel.com) (arrastar pasta do projeto)

---

## 🌐 Deploy

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub/Google
3. Arraste a pasta `Projeto Passarinho` para a área de upload
4. Compartilhe a URL gerada com o Silvio

---

## ⚙️ Tech Stack

| Camada | Tecnologia |
|---|---|
| Front-end | HTML + CSS + JavaScript (vanilla) |
| Banco de dados | Firebase Firestore |
| Hospedagem | Vercel ou Netlify |
| Ficha | Canvas API |
| Impressão | `canvas.toDataURL()` + `window.print()` |
