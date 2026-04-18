import { useState, useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { calcularCustoVeiculo, formatCurrency, getRecommendations } from './utils/calculos';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.dataset.label}: ${formatCurrency(context.raw)}`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => formatCurrency(value),
      },
    },
  },
};

export default function CalculadoraCustoVeiculo() {
  const [tipoVeiculo, setTipoVeiculo] = useState('carro');
  const [valorCompra, setValorCompra] = useState(50000);
  const [valorRevenda, setValorRevenda] = useState(35000);
  const [seguroAnual, setSeguroAnual] = useState(3000);
  const [manutencaoAnual, setManutencaoAnual] = useState(2000);
  const [documentacao, setDocumentacao] = useState(1500);
  const [financiamento, setFinanciamento] = useState({ ativo: false, parcelas: 48 });

  const resultados = useMemo(() => ({
    1: calcularCustoVeiculo({
      tipoVeiculo,
      valorCompra,
      valorRevenda: valorCompra * 0.8,
      seguroAnual,
      manutencaoAnual,
      anos: 1,
      financiamento,
    }),
    3: calcularCustoVeiculo({
      tipoVeiculo,
      valorCompra,
      valorRevenda: valorCompra * 0.6,
      seguroAnual,
      manutencaoAnual,
      anos: 3,
      financiamento,
    }),
    5: calcularCustoVeiculo({
      tipoVeiculo,
      valorCompra,
      valorRevenda: valorCompra * 0.45,
      seguroAnual,
      manutencaoAnual,
      anos: 5,
      financiamento,
    }),
  }), [tipoVeiculo, valorCompra, seguroAnual, manutencaoAnual, financiamento]);

  const graficoData = useMemo(() => ({
    labels: ['0 ano', '1 ano', '2 anos', '3 anos', '4 anos', '5 anos'],
    datasets: [
      {
        label: '1 ano (trocar)',
        data: [0, resultados[1].total],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.3,
      },
      {
        label: '3 anos',
        data: [0, resultados[3].total / 3, (resultados[3].total / 3) * 2, resultados[3].total],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.3,
      },
      {
        label: '5 anos',
        data: [0, resultados[5].total / 5, (resultados[5].total / 5) * 2, (resultados[5].total / 5) * 3, (resultados[5].total / 5) * 4, resultados[5].total],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.3,
      },
    ],
  }), [resultados]);

  const recomendacoes = useMemo(() => getRecommendations(resultados), [resultados]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Calculadora de Custo de Troca de Veículo
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Veículo
              </label>
              <select
                value={tipoVeiculo}
                onChange={(e) => setTipoVeiculo(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="carro">Carro</option>
                <option value="moto">Moto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor de Compra (R$)
              </label>
              <input
                type="number"
                value={valorCompra}
                onChange={(e) => setValorCompra(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor de Revenda Estimado (R$)
              </label>
              <input
                type="number"
                value={valorRevenda}
                onChange={(e) => setValorRevenda(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seguro Anual (R$)
              </label>
              <input
                type="number"
                value={seguroAnual}
                onChange={(e) => setSeguroAnual(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manutenção Anual (R$)
              </label>
              <input
                type="number"
                value={manutencaoAnual}
                onChange={(e) => setManutencaoAnual(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Documentação por Troca (R$)
              </label>
              <input
                type="number"
                value={documentacao}
                onChange={(e) => setDocumentacao(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-4">
              <input
                type="checkbox"
                checked={financiamento.ativo}
                onChange={(e) => setFinanciamento({ ...financiamento, ativo: e.target.checked })}
                className="w-5 h-5"
              />
              <label className="text-sm font-medium text-gray-700">
                Financiamento
              </label>
              {financiamento.ativo && (
                <select
                  value={financiamento.parcelas}
                  onChange={(e) => setFinanciamento({ ...financiamento, parcelas: Number(e.target.value) })}
                  className="p-2 border border-gray-300 rounded-lg"
                >
                  <option value={12}>12 meses</option>
                  <option value={24}>24 meses</option>
                  <option value={36}>36 meses</option>
                  <option value={48}>48 meses</option>
                  <option value={60}>60 meses</option>
                </select>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Comparativo de Custos</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">Cenário</th>
                  <th className="p-3 text-right">Custo Total</th>
                  <th className="p-3 text-right">Custo Mensal</th>
                  <th className="p-3 text-right">Perda %</th>
                </tr>
              </thead>
              <tbody>
                {[1, 3, 5].map((anos) => {
                  const custo = resultados[anos];
                  const perda = ((custo.total - (valorCompra - valorRevenda)) / (valorCompra - valorRevenda) * 100).toFixed(0);
                  return (
                    <tr key={anos} className="border-b">
                      <td className="p-3 font-medium">
                        {anos === 1 ? 'Trocar a cada 1 ano' : `Manter por ${anos} anos`}
                      </td>
                      <td className="p-3 text-right">{formatCurrency(custo.total)}</td>
                      <td className="p-3 text-right">{formatCurrency(custo.mensal)}</td>
                      <td className="p-3 text-right">{perda}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Evolução de Custo Acumulado</h2>
          <div className="h-64">
            <Line data={graficoData} options={OPTIONS} />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">Recomendação</h2>
          <p className="text-lg">
            {recomendacoes.maisBarato.anos === 5 ? (
              <>Mantenha o veículo por 5 anos e economia de <strong>{recomendacoes.economia3vs5}%</strong> em relação a trocar em 3 anos.</>
            ) : recomendacoes.maisBarato.anos === 3 ? (
              <>Mantenha por 3 anos. Economia de <strong>{recomendacoes.economia1vs3}%</strong> em relação a trocar todo ano.</>
            ) : (
              <>Trocar anualmente custa {formatCurrency(recomendacoes.maisBarato.mensal)}/mês. Considere manter pelo menos 3 anos.</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}