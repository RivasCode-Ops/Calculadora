const API_FIPE_BASE = 'https://deividfortuna.github.io/fipe/api/v1';

const PRESETS = {
  carro: {
    ipva: 0.025,
    depreciacao: [0.20, 0.12, 0.10, 0.08, 0.08],
    documentacao: 1500,
  },
  moto: {
    ipva: 0.02,
    depreciacao: [0.25, 0.18, 0.15, 0.12, 0.10],
    documentacao: 800,
  }
};

const TAXAS_JUROS = {
  12: 0.08,
  24: 0.12,
  36: 0.16,
  48: 0.20,
  60: 0.24,
};

function calcularCustoVeiculo({
  tipoVeiculo,
  valorCompra,
  valorRevenda,
  seguroAnual,
  manutencaoAnual,
  anos,
  financiamento,
}) {
  const preset = PRESETS[tipoVeiculo];
  const custo = {
    depreciacao: 0,
    ipva: 0,
    seguro: 0,
    manutencao: 0,
    documentacao: 0,
    juros: 0,
  };

  let valorAtual = valorCompra;

  for (let i = 0; i < anos; i++) {
    const taxaDep = preset.depreciacao[Math.min(i, 4)];
    const depAnual = valorAtual * taxaDep;
    custo.depreciacao += depAnual;
    valorAtual = valorAtual - depAnual;

    custo.ipva += valorAtual * preset.ipva;
    custo.seguro += seguroAnual;
    custo.manutencao += manutencaoAnual;

    if (i === 0 || (anos > 1 && i === anos - 1)) {
      custo.documentacao += preset.documentacao;
    }
  }

  custo.depreciacao = valorCompra - valorRevenda;

  if (financiamento.ativo) {
    const taxa = TAXAS_JUROS[financiamento.parcelas] || 0.16;
    const totalJuros = valorCompra * taxa;
    custo.juros = totalJuros;
  }

  return {
    ...custo,
    total: Object.values(custo).reduce((a, b) => a + b, 0),
    mensal: Object.values(custo).reduce((a, b) => a + b, 0) / (anos * 12),
  };
}

function gerarGrafico(resultados) {
  const labels = ['Compra', '1 ano', '2 anos', '3 anos', '4 anos', '5 anos'];
  const datasets = [
    {
      label: '1 ano',
      data: [0, resultados[1]?.total || 0],
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
    },
    {
      label: '3 anos',
      data: [0, resultados[3]?.total / 3, resultados[3]?.total / 3 * 2, resultados[3]?.total],
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
    },
    {
      label: '5 anos',
      data: [0, resultados[5]?.total / 5, resultados[5]?.total / 5 * 2, resultados[5]?.total / 5 * 3, resultados[5]?.total / 5 * 4, resultados[5]?.total],
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
    },
  ];

  return { labels, datasets };
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function getRecommendations(resultados) {
  const valores = [
    { anos: 1, total: resultados[1]?.total || 0, mensal: resultados[1]?.mensal || 0 },
    { anos: 3, total: resultados[3]?.total || 0, mensal: resultados[3]?.mensal || 0 },
    { anos: 5, total: resultados[5]?.total || 0, mensal: resultados[5]?.mensal || 0 },
  ];

  const maisBarato = valores.reduce((a, b) => (a.total < b.total ? a : b));

  const economia1vs3 = ((resultados[1]?.total * 3 - resultados[3]?.total) / (resultados[1]?.total * 3)) * 100;
  const economia3vs5 = ((resultados[3]?.total - resultados[5]?.total) / resultados[3]?.total) * 100;

  return {
    maisBarato,
    economia1vs3: economia1vs3.toFixed(0),
    economia3vs5: economia3vs5.toFixed(0),
  };
}

export { calcularCustoVeiculo, gerarGrafico, formatCurrency, getRecommendations, PRESETS };