import { ArrowUpDown, Clock, RefreshCcw } from 'lucide-react';
import { fetchFirstRow, fetchAllStores } from './api';
import { gpuScores } from './data/gpuScores';
import type { GPUData, StoreData } from './types';
import { useEffect, useState } from 'react';

function App() {
  const [gpuData, setGpuData] = useState<GPUData[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<keyof GPUData>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedBrand, setSelectedBrand] = useState<'all' | 'nvidia' | 'amd' | 'intel'>('all');
  const [g3dRange, setG3dRange] = useState<{ min: number; max: number }>({ min: 0, max: 40000 });

  useEffect(() => {
    fetchData();
  }, []);

  const findGPUScore = (name: string) => {
    // Normaliza e limpa o nome para comparação
    const normalizedName = name.toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s-]/g, '') // Remove special characters except hyphen
      .replace(/geforce|radeon|nvidia|amd/gi, '') // Remove brand names
      .replace(/\b(rtx|gtx|rx)\b/gi, '') // Remove common prefixes
      .replace(/\b(ti|xt|super)\b/gi, '') // Remove common suffixes
      .trim();

    // Primeiro tenta encontrar uma correspondência exata após a normalização
    const exactMatch = gpuScores.find(gpu => {
      const scoreNormalizedName = gpu.name.toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s-]/g, '')
        .replace(/geforce|radeon|nvidia|amd/gi, '')
        .replace(/\b(rtx|gtx|rx)\b/gi, '')
        .replace(/\b(ti|xt|super)\b/gi, '')
        .trim();
      return normalizedName === scoreNormalizedName;
    });

    if (exactMatch) return exactMatch;

    // Se não encontrar correspondência exata, procura por correspondência parcial
    const numberMatch = normalizedName.match(/\d{4}/); // Extrai o número do modelo (ex: 3060, 6700, etc)
    if (!numberMatch) return undefined;

    const modelNumber = numberMatch[0];
    
    // Procura por placas com o mesmo número de modelo
    const possibleMatches = gpuScores.filter(gpu => {
      const gpuNormalized = gpu.name.toLowerCase();
      return gpuNormalized.includes(modelNumber);
    });

    if (possibleMatches.length === 0) return undefined;

    // Se encontrar múltiplas correspondências, tenta encontrar a mais específica
    // Prioriza correspondências que compartilham mais palavras com o nome original
    const bestMatch = possibleMatches.reduce((best, current) => {
      const currentNormalized = current.name.toLowerCase();
      const currentMatchScore = normalizedName.split(' ').filter(word => 
        currentNormalized.includes(word.toLowerCase())
      ).length;

      const bestNormalized = best.name.toLowerCase();
      const bestMatchScore = normalizedName.split(' ').filter(word => 
        bestNormalized.includes(word.toLowerCase())
      ).length;

      return currentMatchScore > bestMatchScore ? current : best;
    });

    return bestMatch;
  };

  const processStoreData = (storeData: StoreData): GPUData[] => {
    const combined: GPUData[] = [];
    
    Object.entries(storeData).forEach(([store, prices]) => {
      prices.forEach((price) => {
        // Map the API properties to our expected properties
        const mappedPrice = {
          name: price.Modelo,
          price: price.ValorAV,
          installmentPrice: price.ValorParc,
          installments: price.Parcelas || 12, // Default to 12 if not provided
          store: price.Loja || store,
          url: price.Link
        };
        
        if (!mappedPrice.price || !mappedPrice.installmentPrice) {
          return;
        }

        const gpuScore = findGPUScore(mappedPrice.name);
        const g3dScore = gpuScore?.g3d;
        const tdp = gpuScore?.tdp;

        // Calcula custo/benefício (G3D Score / Preço)
        const pricePerformance = g3dScore ? Number((g3dScore / mappedPrice.price).toFixed(2)) : 0;
        
        // Calcula eficiência (G3D Score / TDP)
        const efficiencyScore = (g3dScore && tdp) ? Number((g3dScore / tdp).toFixed(2)) : 0;

        combined.push({
          ...mappedPrice,
          g3dScore,
          tdp,
          pricePerformance,
          efficiencyScore,
        });
      });
    });

    return combined;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [firstRowData, storeData] = await Promise.all([
        fetchFirstRow(),
        fetchAllStores(),
      ]);

      console.log('First row data received:', firstRowData);
      setLastUpdate(firstRowData.lastUpdate || '');
      
      const combinedData = processStoreData(storeData);
      setGpuData(combinedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handleSort = (key: keyof GPUData) => {
    setSortOrder(current => key === sortBy ? (current === 'asc' ? 'desc' : 'asc') : 'asc');
    setSortBy(key);
  };

  const sortedData = [...gpuData].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return sortOrder === 'asc' 
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatInstallmentPrice = (price: number, installments: number) => {
    const installmentValue = price / installments;
    return `${installments}x ${formatPrice(installmentValue)}`;
  };

  const filteredData = sortedData.filter(gpu => {
    // Filter by brand
    if (selectedBrand !== 'all') {
      const name = gpu.name.toLowerCase();
      if (selectedBrand === 'nvidia' && !name.includes('geforce') && !name.includes('rtx') && !name.includes('gtx')) {
        return false;
      }
      if (selectedBrand === 'amd' && !name.includes('radeon') && !name.includes('rx')) {
        return false;
      }
      if (selectedBrand === 'intel' && !name.includes('intel') && !name.includes('arc')) {
        return false;
      }
    }

    // Filter by G3D range
    if (gpu.g3dScore) {
      return gpu.g3dScore >= g3dRange.min && gpu.g3dScore <= g3dRange.max;
    }
    return true;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    // The date string is already in the format "Última atualização DD/MM/YYYY - HH:mm:ss"
    return dateString;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Comparativo de Placas de Vídeo Banheiristico
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                Última atualização: {formatDate(lastUpdate)}
              </div>
              <button
                onClick={fetchData}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                disabled={loading}
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Atualizar
              </button>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Fabricante:</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value as typeof selectedBrand)}
                className="rounded-md border border-gray-300 px-3 py-1"
              >
                <option value="all">Todos</option>
                <option value="nvidia">NVIDIA</option>
                <option value="amd">AMD</option>
                <option value="intel">Intel</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">G3D Mark:</label>
              <input
                type="number"
                value={g3dRange.min}
                onChange={(e) => setG3dRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                className="w-24 rounded-md border border-gray-300 px-3 py-1"
                placeholder="Min"
              />
              <span>-</span>
              <input
                type="number"
                value={g3dRange.max}
                onChange={(e) => setG3dRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                className="w-24 rounded-md border border-gray-300 px-3 py-1"
                placeholder="Max"
              />
            </div>

            <div className="flex items-center text-sm text-gray-600">
              {filteredData.length} placas encontradas
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('name')}>
                      <div className="flex items-center">
                        Placa de Vídeo
                        {sortBy === 'name' && <ArrowUpDown className="w-4 h-4 ml-1" />}
                      </div>
                    </th>
                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('price')}>
                      <div className="flex items-center">
                        Preço à Vista
                        {sortBy === 'price' && <ArrowUpDown className="w-4 h-4 ml-1" />}
                      </div>
                    </th>
                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('installmentPrice')}>
                      <div className="flex items-center">
                        Preço Parcelado
                        {sortBy === 'installmentPrice' && <ArrowUpDown className="w-4 h-4 ml-1" />}
                      </div>
                    </th>
                    <th className="px-4 py-2">Loja</th>
                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('g3dScore')}>
                      <div className="flex items-center">
                        G3D Mark
                        {sortBy === 'g3dScore' && <ArrowUpDown className="w-4 h-4 ml-1" />}
                      </div>
                    </th>
                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('tdp')}>
                      <div className="flex items-center">
                        TDP (W)
                        {sortBy === 'tdp' && <ArrowUpDown className="w-4 h-4 ml-1" />}
                      </div>
                    </th>
                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('pricePerformance')}>
                      <div className="flex items-center">
                        Custo/Benefício
                        {sortBy === 'pricePerformance' && <ArrowUpDown className="w-4 h-4 ml-1" />}
                      </div>
                    </th>
                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('efficiencyScore')}>
                      <div className="flex items-center">
                        Eficiência
                        {sortBy === 'efficiencyScore' && <ArrowUpDown className="w-4 h-4 ml-1" />}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((gpu, index) => (
                    <tr 
                      key={index} 
                      className="border-t hover:bg-blue-50 cursor-pointer transition-colors"
                      onClick={() => window.open(gpu.url, '_blank')}
                    >
                      <td className="px-4 py-2">
                        <a 
                          href={gpu.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {gpu.name}
                        </a>
                      </td>
                      <td className="px-4 py-2">{formatPrice(gpu.price)}</td>
                      <td className="px-4 py-2">
                        {formatInstallmentPrice(gpu.installmentPrice, gpu.installments)}
                      </td>
                      <td className="px-4 py-2">{gpu.store}</td>
                      <td className="px-4 py-2">{gpu.g3dScore?.toLocaleString() || '-'}</td>
                      <td className="px-4 py-2">{gpu.tdp || '-'}</td>
                      <td className="px-4 py-2">
                        {gpu.pricePerformance ? gpu.pricePerformance.toFixed(2) : '-'}
                      </td>
                      <td className="px-4 py-2">
                        {gpu.efficiencyScore ? gpu.efficiencyScore.toFixed(2) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;