// ============================================================
// FICHA.JS — Geração da ficha impressa via Canvas API
// Coordenadas calibradas para SVG viewBox 12050 × 9050
// ============================================================

// ── Coordenadas dos campos (em unidades SVG 12050×9050) ────
// Cada entrada: [svgX, svgY, fontSize, bold]
const CAMPO_COORDS = {
  nome:           [420,  2100, 28, true],
  codigo:         [420,  2960, 28, true],
  dataNascimento: [6500, 2100, 28, true],
  sexo:           [6500, 2960, 28, true],
  nomePassaro:    [370,  6300, 68, true],  // Campo 5 — destaque

  paiPassaro5:    [2450, 4780, 24, true],  // Campo 6 (pai 5)
  maePassaro5:    [2450, 7440, 24, true],  // Campo 7 (mãe 5)

  paiPassaro6:    [5680, 4000, 20, true],  // Campo 8 (pai 6)
  maePassaro6:    [5680, 5380, 20, true],  // Campo 9 (mãe 6)

  paiPassaro7:    [5680, 6740, 20, true],  // Campo 10 (pai 7)
  maePassaro7:    [5680, 8020, 20, true],  // Campo 11 (mãe 7)

  paiPassaro8:    [8850, 3750, 16, true],  // Campo 12 (pai 8)
  maePassaro8:    [8850, 4440, 16, true],  // Campo 13 (mãe 8)

  paiPassaro9:    [8850, 5120, 16, true],  // Campo 14 (pai 9)
  maePassaro9:    [8850, 5800, 16, true],  // Campo 15 (mãe 9)

  paiPassaro10:   [8850, 6450, 16, true],  // Campo 16 (pai 10)
  maePassaro10:   [8850, 7130, 16, true],  // Campo 17 (mãe 10)

  paiPassaro11:   [8850, 7820, 16, true],  // Campo 18 (pai 11)
  maePassaro11:   [8850, 8490, 16, true],  // Campo 19 (mãe 11)
};

// ── Borda do campo 5 (retângulo de destaque) ──────────────
const CAMPO5_RECT = { x: 188, y: 5783, w: 4485, h: 912 };

// ── Carregar imagem como Promise ──────────────────────────
function carregarImagem(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = () => reject(new Error('Falha ao carregar: ' + src));
    img.src = src;
  });
}

// ── Carregar SVG via fetch → Blob URL (evita canvas taint) ─
async function svgParaBlobUrl(url) {
  console.log('[ficha] Buscando SVG:', url);
  const resp = await fetch(url);
  if (!resp.ok) throw new Error('SVG não encontrado: ' + url);
  let texto = await resp.text();
  // Substituir dimensões em mm por px para resolução adequada no canvas
  texto = texto.replace('width="120.5mm"', 'width="2410"');
  texto = texto.replace('height="90.5mm"', 'height="1810"');
  const blob = new Blob([texto], { type: 'image/svg+xml' });
  return URL.createObjectURL(blob);
}

// ── Renderizar dados no canvas ────────────────────────────
function renderizarDados(ctx, dados, canvas) {
  const escX = canvas.width  / 12050;
  const escY = canvas.height / 9050;

  ctx.textBaseline = 'middle';

  function escrever(texto, svgX, svgY, tamanho = 28, negrito = false) {
    if (!texto) return;
    ctx.font      = `${negrito ? 'bold' : 'normal'} ${(tamanho * escY).toFixed(1)}px Arial, sans-serif`;
    ctx.fillStyle = '#7B4831';
    ctx.fillText(String(texto), svgX * escX, svgY * escY);
  }

  // ── Campos principais ──────────────────────────────────
  escrever(dados.nome,            ...CAMPO_COORDS.nome);
  escrever(dados.codigo,          ...CAMPO_COORDS.codigo);
  escrever(dados.dataNascimento,  ...CAMPO_COORDS.dataNascimento);
  escrever(dados.sexo,            ...CAMPO_COORDS.sexo);

  // ── Campo 5 — Nome do pássaro com borda colorida ──────
  const corBorda = dados.sexo === 'FÊMEA' ? '#ED3237' : '#0055FF';
  ctx.save();
  ctx.strokeStyle = corBorda;
  ctx.lineWidth   = 50 * escX;
  ctx.strokeRect(
    CAMPO5_RECT.x * escX,
    CAMPO5_RECT.y * escY,
    CAMPO5_RECT.w * escX,
    CAMPO5_RECT.h * escY
  );
  ctx.restore();
  escrever(dados.nomePassaro, ...CAMPO_COORDS.nomePassaro);

  // ── Campos genealógicos ────────────────────────────────
  escrever(dados.paiPassaro5,  ...CAMPO_COORDS.paiPassaro5);
  escrever(dados.maePassaro5,  ...CAMPO_COORDS.maePassaro5);
  escrever(dados.paiPassaro6,  ...CAMPO_COORDS.paiPassaro6);
  escrever(dados.maePassaro6,  ...CAMPO_COORDS.maePassaro6);
  escrever(dados.paiPassaro7,  ...CAMPO_COORDS.paiPassaro7);
  escrever(dados.maePassaro7,  ...CAMPO_COORDS.maePassaro7);
  escrever(dados.paiPassaro8,  ...CAMPO_COORDS.paiPassaro8);
  escrever(dados.maePassaro8,  ...CAMPO_COORDS.maePassaro8);
  escrever(dados.paiPassaro9,  ...CAMPO_COORDS.paiPassaro9);
  escrever(dados.maePassaro9,  ...CAMPO_COORDS.maePassaro9);
  escrever(dados.paiPassaro10, ...CAMPO_COORDS.paiPassaro10);
  escrever(dados.maePassaro10, ...CAMPO_COORDS.maePassaro10);
  escrever(dados.paiPassaro11, ...CAMPO_COORDS.paiPassaro11);
  escrever(dados.maePassaro11, ...CAMPO_COORDS.maePassaro11);
}

// ── Gerar ficha no canvas ─────────────────────────────────
export async function gerarFicha(dados, canvasId = 'fichaCanvas') {
  const canvas = document.getElementById(canvasId);
  const ctx    = canvas.getContext('2d');
  let usouSvg  = false;

  try {
    let img;

    // 1. Carrega PNG oficial da ficha
    try {
      img = await carregarImagem('assets/ficha_original.png');
      console.log('[ficha] PNG carregado:', img.width, 'x', img.height);
      canvas.width  = img.width  || 2410;
      canvas.height = img.height || 1810;
    } catch (pngErr) {
      // 2. Fallback: SVG via Blob URL (evita canvas taint)
      console.log('[ficha] PNG não encontrado, usando SVG fallback');
      usouSvg = true;
      const blobUrl = await svgParaBlobUrl('assets/Criatorio_Igarapava_Silvio_Moreira.svg');
      img = await carregarImagem(blobUrl);
      console.log('[ficha] SVG carregado via Blob:', img.width, 'x', img.height);
      URL.revokeObjectURL(blobUrl);
      canvas.width  = 2410;
      canvas.height = 1810;
    }

    console.log('[ficha] Canvas:', canvas.width, 'x', canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    renderizarDados(ctx, dados, canvas);
    console.log('[ficha] Ficha renderizada com sucesso');

    return { width: canvas.width, height: canvas.height, usouSvg };
  } catch (err) {
    console.error('[ficha] ERRO ao gerar ficha:', err);
    throw err;
  }
}

// ── Baixar ficha como imagem PNG ──────────────────────────
export function baixarFicha(nomePassaro = 'passaro') {
  const canvas = document.getElementById('fichaCanvas');
  const link   = document.createElement('a');
  const nome   = nomePassaro.replace(/[^a-zA-Z0-9\u00C0-\u00FF\s]/g, '').trim().replace(/\s+/g, '_');
  link.download = `ficha_${nome}.png`;
  link.href     = canvas.toDataURL('image/png');
  link.click();
}

// ── Imprimir ficha ────────────────────────────────────────
export function imprimirFicha() {
  const canvas  = document.getElementById('fichaCanvas');
  const dataUrl = canvas.toDataURL('image/png');
  if (!dataUrl.startsWith('data:image/png;base64,')) {
    alert('Erro ao gerar imagem para impressão.');
    return;
  }
  const win     = window.open('', '_blank');
  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Ficha — Criatório Igarapava</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: white; }
        img { width: 100%; display: block; }
        @media print {
          @page { margin: 0; size: landscape; }
          img { width: 100vw; }
        }
      </style>
    </head>
    <body>
      <img src="${dataUrl}" alt="Ficha do Pássaro"/>
      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); }, 300);
        };
      </script>
    </body>
    </html>
  `);
  win.document.close();
  win.focus();
}
