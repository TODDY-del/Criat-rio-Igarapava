# Especificação do Sistema — Criatório Igarapava

---

## 1. Visão Geral

Sistema web para cadastro de pássaros do Criatório Igarapava (Silvio Moreira — Curiós, Canto e Repetição). O cliente preenche os dados de cada pássaro, os dados são salvos em banco de dados na nuvem, e é possível imprimir uma ficha **idêntica** ao modelo original (SVG fornecido).

---

## 2. Stack Tecnológica

| Camada | Tecnologia | Motivo |
|---|---|---|
| Front-end | HTML + CSS + JavaScript (vanilla) | Simples, sem dependências |
| Banco de dados | Firebase Firestore | Nuvem, grátis no início, sem servidor próprio |
| Hospedagem front | Vercel ou Netlify | Grátis, deploy simples |
| Geração da ficha | Canvas API (JavaScript) | Renderiza texto sobre a imagem PNG exportada do SVG original |
| Impressão / Download | `canvas.toBlob()` + `window.print()` | Salva como PNG ou imprime direto |

---

## 3. Estrutura de Páginas

```
/index.html    → Tela principal: lista de pássaros cadastrados + botão adicionar
/cadastro.html → Formulário de cadastro / edição de pássaro
/ficha.html    → Preview da ficha gerada + botão imprimir / baixar como imagem
```

---

## 4. Layout da Tela Principal (`index.html`)

Baseado no esboço fornecido:

- **Fundo**: preto (`#000000`)
- **Barra lateral esquerda** com dois botões circulares:
  - Botão 1 (topo): abre a seção de **Adicionar Pássaro**
  - Botão 2 (baixo): abre a seção de **Lista de Pássaros cadastrados**
- **Área central**: exibe o formulário ou a lista conforme botão selecionado
- **Botão "ADICIONAR PÁSSARO"**: canto inferior direito, fundo preto, borda e texto verde neon

---

## 5. Campos do Formulário

Todos os campos devem ter **fundo branco** e **sem placeholder** (sem nenhum texto dentro dos campos).

| # | Nome do campo | Tipo | Observação |
|---|---|---|---|
| 1 | Nome | Texto | Label "NOME:" visível na ficha |
| 2 | Código do passarinho | Texto/Número | Campo abaixo do nome |
| 3 | Data de nascimento | Data (dd/mm/aaaa) | Canto superior direito da ficha |
| 4 | Sexo | Seleção: `MACHO` / `FÊMEA` | Label "SEXO:" visível na ficha |
| 5 | Nome do pássaro | Texto | Campo em destaque: **borda vermelha se Fêmea, azul se Macho** |
| 6 | Pai do pássaro 5 | Texto | Par genealógico com campo 7 |
| 7 | Mãe do pássaro 5 | Texto | Par genealógico com campo 6 |
| 8 | Pai do pássaro 6 | Texto | Par genealógico com campo 9 |
| 9 | Mãe do pássaro 6 | Texto | Par genealógico com campo 8 |
| 10 | Pai do pássaro 7 | Texto | Par genealógico com campo 11 |
| 11 | Mãe do pássaro 7 | Texto | Par genealógico com campo 10 |
| 12 | Pai do pássaro 8 | Texto | Par genealógico com campo 13 |
| 13 | Mãe do pássaro 8 | Texto | Par genealógico com campo 12 |
| 14 | Pai do pássaro 9 | Texto | Par genealógico com campo 15 |
| 15 | Mãe do pássaro 9 | Texto | Par genealógico com campo 14 |
| 16 | Pai do pássaro 10 | Texto | Par genealógico com campo 17 |
| 17 | Mãe do pássaro 10 | Texto | Par genealógico com campo 16 |
| 18 | Pai do pássaro 11 | Texto | Par genealógico com campo 19 |
| 19 | Mãe do pássaro 11 | Texto | Par genealógico com campo 18 |

> Os campos 6–19 formam a **árvore genealógica** do pássaro (pais de cada ancestral).

---

## 6. Regra de Cor da Borda — Campo 5 (Nome do Pássaro)

A borda do campo 5 muda **em tempo real** conforme o sexo selecionado no campo 4.

No formulário HTML:
```javascript
function atualizarCorBorda() {
  const sexo = document.getElementById('campo4').value;
  const campo5 = document.getElementById('campo5');
  if (sexo === 'FÊMEA') {
    campo5.style.borderColor = '#ED3237'; // vermelho
  } else if (sexo === 'MACHO') {
    campo5.style.borderColor = '#0000FF'; // azul
  }
}
document.getElementById('campo4').addEventListener('change', atualizarCorBorda);
```

A mesma lógica se aplica ao gerar a ficha no Canvas: a borda do retângulo do campo 5 deve usar a cor correta conforme o sexo salvo.

---

## 7. Banco de Dados — Firebase Firestore

### Estrutura da coleção `/passaros/{id}`:

```javascript
{
  nome:            string,          // campo 1
  codigo:          string,          // campo 2
  dataNascimento:  string,          // campo 3 — formato dd/mm/aaaa
  sexo:            "MACHO" | "FÊMEA", // campo 4
  nomePassaro:     string,          // campo 5 — nome em destaque

  paiPassaro5:     string,          // campo 6
  maePassaro5:     string,          // campo 7

  paiPassaro6:     string,          // campo 8
  maePassaro6:     string,          // campo 9

  paiPassaro7:     string,          // campo 10
  maePassaro7:     string,          // campo 11

  paiPassaro8:     string,          // campo 12
  maePassaro8:     string,          // campo 13

  paiPassaro9:     string,          // campo 14
  maePassaro9:     string,          // campo 15

  paiPassaro10:    string,          // campo 16
  maePassaro10:    string,          // campo 17

  paiPassaro11:    string,          // campo 18
  maePassaro11:    string,          // campo 19

  criadoEm:        timestamp
}
```

### Configuração Firebase (`js/firebase-config.js`):

```javascript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            "SUA_API_KEY",
  authDomain:        "SEU_PROJETO.firebaseapp.com",
  projectId:         "SEU_PROJETO",
  storageBucket:     "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_ID",
  appId:             "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### Salvar pássaro:

```javascript
import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

async function salvarPassaro(dados) {
  await addDoc(collection(db, "passaros"), {
    ...dados,
    criadoEm: serverTimestamp()
  });
}
```

### Listar todos os pássaros:

```javascript
import { collection, getDocs, orderBy, query } from "firebase/firestore";

async function listarPassaros() {
  const q = query(collection(db, "passaros"), orderBy("criadoEm", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
```

---

## 8. Geração da Ficha Impressa (Canvas API)

### Pré-requisito:

Exportar o arquivo `Criatorio_Igarapava_Silvio_Moreira.svg` como PNG em alta resolução.
- Resolução recomendada: **2410 × 1810 px** (2x) ou mais para boa qualidade de impressão
- Salvar em: `assets/ficha_fundo.png`
- O PNG deve ter os retângulos dos campos **completamente brancos e vazios** — os dados serão escritos pelo Canvas por cima

### Lógica de geração (`js/ficha.js`):

```javascript
async function gerarFicha(dados) {
  const canvas = document.getElementById('fichaCanvas');
  const ctx    = canvas.getContext('2d');
  const img    = new Image();
  img.src      = 'assets/ficha_fundo.png';

  img.onload = () => {
    canvas.width  = img.width;
    canvas.height = img.height;

    // Fator de escala proporcional ao SVG original (12050 × 9050)
    const escX = canvas.width  / 12050;
    const escY = canvas.height / 9050;

    ctx.drawImage(img, 0, 0);
    ctx.fillStyle    = '#7B4831'; // marrom original da ficha
    ctx.textBaseline = 'middle';

    function escrever(texto, svgX, svgY, tamanho = 28, negrito = false) {
      ctx.font = `${negrito ? 'bold' : 'normal'} ${tamanho * escY}px Arial`;
      ctx.fillText(String(texto || ''), svgX * escX, svgY * escY);
    }

    // ── Campos principais ──────────────────────────────────────────────────
    escrever(dados.nome,            420,  1950, 28, true); // campo 1
    escrever(dados.codigo,          420,  2810, 28, true); // campo 2
    escrever(dados.dataNascimento,  6500, 1950, 28, true); // campo 3
    escrever(dados.sexo,            6500, 2810, 28, true); // campo 4

    // ── Campo 5 — Nome do pássaro (destaque) ───────────────────────────────
    // Borda colorida conforme sexo
    const corBorda = dados.sexo === 'FÊMEA' ? '#ED3237' : '#0000FF';
    ctx.strokeStyle = corBorda;
    ctx.lineWidth   = 50 * escX;
    ctx.strokeRect(188 * escX, 5783 * escY, 4485 * escX, 912 * escY);
    // Texto em destaque (fonte maior)
    ctx.fillStyle = '#7B4831';
    escrever(dados.nomePassaro, 350, 6250, 72, true);

    // ── Campos genealógicos ────────────────────────────────────────────────
    // Pais do pássaro 5 (campos 6 e 7)
    escrever(dados.paiPassaro5,  420,  4700, 28, true);
    escrever(dados.maePassaro5,  420,  7350, 28, true);

    // Pais do pássaro 6 (campos 8 e 9)
    escrever(dados.paiPassaro6,  2500, 4700, 28, true);
    escrever(dados.maePassaro6,  2500, 5400, 28, true);

    // Pais do pássaro 7 (campos 10 e 11)
    escrever(dados.paiPassaro7,  2500, 6750, 28, true);
    escrever(dados.maePassaro7,  2500, 8100, 28, true);

    // Pais do pássaro 8 (campos 12 e 13)
    escrever(dados.paiPassaro8,  8850, 3750, 24, true);
    escrever(dados.maePassaro8,  8850, 4435, 24, true);

    // Pais do pássaro 9 (campos 14 e 15)
    escrever(dados.paiPassaro9,  8850, 5115, 24, true);
    escrever(dados.maePassaro9,  8850, 5794, 24, true);

    // Pais do pássaro 10 (campos 16 e 17)
    escrever(dados.paiPassaro10, 8850, 6448, 24, true);
    escrever(dados.maePassaro10, 8850, 7129, 24, true);

    // Pais do pássaro 11 (campos 18 e 19)
    escrever(dados.paiPassaro11, 8850, 7817, 24, true);
    escrever(dados.maePassaro11, 8850, 8488, 24, true);
  };
}

// ── Baixar como imagem ─────────────────────────────────────────────────────
function baixarFicha(nomePassaro) {
  const canvas = document.getElementById('fichaCanvas');
  const link   = document.createElement('a');
  link.download = `ficha_${nomePassaro}.png`;
  link.href     = canvas.toDataURL('image/png');
  link.click();
}

// ── Imprimir ───────────────────────────────────────────────────────────────
function imprimirFicha() {
  const canvas = document.getElementById('fichaCanvas');
  const dataUrl = canvas.toDataURL('image/png');
  const win = window.open('');
  win.document.write(`
    <html><body style="margin:0">
      <img src="${dataUrl}" style="width:100%;display:block"/>
    </body></html>
  `);
  win.focus();
  win.print();
  win.close();
}
```

> **Nota:** As coordenadas SVG acima são estimativas baseadas na análise do arquivo SVG.  
> Após exportar o PNG, abra-o em qualquer editor de imagem, clique em cada campo e anote as coordenadas reais em pixels. Depois calcule: `svgX = pixelX / escX` e ajuste no código.

---

## 9. Fluxo Completo do Usuário

```
1. Usuário abre o site
2. Clica no botão lateral "Adicionar Pássaro"
3. Preenche o formulário — campos 1 a 19, todos brancos e sem placeholder
4. Campo 5 já muda a borda em tempo real conforme o sexo selecionado no campo 4
5. Clica em "Salvar" → dados salvos no Firebase Firestore
6. Sistema redireciona para /ficha.html com o ID do pássaro
7. Canvas carrega a ficha_fundo.png e escreve os dados por cima
8. A borda do campo 5 na ficha impressa tem a cor correta (vermelho/azul)
9. Usuário clica em "Baixar como imagem" ou "Imprimir"
10. Ficha final fica idêntica ao modelo original
```

---

## 10. Estilo Visual do Site

```css
:root {
  --cor-fundo:        #000000;
  --cor-destaque:     #00FF00; /* verde neon — botões e bordas do site */
  --cor-borda-painel: #FFFFFF; /* bordas brancas do painel central */
  --cor-ficha-texto:  #7B4831; /* marrom dos textos da ficha original */
  --cor-femea:        #ED3237; /* vermelho — campo 5 quando Fêmea */
  --cor-macho:        #0000FF; /* azul — campo 5 quando Macho */
}

/* Inputs sem placeholder visível, fundo branco */
input, select {
  background-color: #FFFFFF;
  color: #000000;
  border: 2px solid #7B4831;
  border-radius: 4px;
}

input::placeholder {
  color: transparent;
}
```

---

## 11. Estrutura de Arquivos do Projeto

```
/projeto
  index.html
  cadastro.html
  ficha.html
  /css
    style.css
  /js
    firebase-config.js
    cadastro.js          ← salvar / listar no Firestore
    ficha.js             ← gerar ficha no Canvas, baixar, imprimir
  /assets
    ficha_fundo.png      ← SVG exportado como PNG em alta resolução
    Criatorio_Igarapava_Silvio_Moreira.svg
```

---

## 12. Passo a Passo de Configuração

1. Criar conta em [firebase.google.com](https://firebase.google.com)
2. Criar novo projeto → ativar **Firestore Database** (modo teste para começar)
3. Copiar as credenciais do projeto para `js/firebase-config.js`
4. Exportar o SVG como PNG em alta resolução e salvar em `assets/ficha_fundo.png`
5. Calibrar as coordenadas dos campos em `js/ficha.js` conforme o PNG exportado
6. Fazer o deploy no [vercel.com](https://vercel.com) arrastando a pasta do projeto
7. Compartilhar a URL gerada com o cliente

---

## 13. Checklist Final

- [ ] Exportar SVG como PNG em alta resolução (`assets/ficha_fundo.png`)
- [ ] Calibrar coordenadas dos 19 campos no Canvas após exportação
- [ ] Testar cor da borda do campo 5 no formulário (tempo real) e na ficha gerada
- [ ] Confirmar se o número **265133** é fixo em todas as fichas ou varia por pássaro
- [ ] Confirmar se o campo **CTF** é fixo ou varia por pássaro
- [ ] Testar impressão e comparar resultado com o modelo original
- [ ] Definir se o site precisa de login/senha ou é aberto
- [ ] Deploy no Vercel e teste de acesso pelo cliente
