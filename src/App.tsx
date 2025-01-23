import { ArrowUpDown, Clock, RefreshCcw, X } from 'lucide-react';
import { fetchFirstRow, fetchAllStores } from './api';
import { gpuScores } from './data/gpuScores';
import { manufacturerWarranties } from './data/warrantyInfo';
import type { GPUData, StoreData, WarrantyInfo } from './types';
import { useEffect, useState, useRef } from 'react';

function App() {
  const [gpuData, setGpuData] = useState<GPUData[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<keyof GPUData>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [g3dRange, setG3dRange] = useState<{ min: number; max: number }>({ min: 0, max: 40000 });
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedVRAMs, setSelectedVRAMs] = useState<string[]>([]);
  const [selectedWarranty, setSelectedWarranty] = useState<number>(0); // 0 means all
  const [modelSearch, setModelSearch] = useState<string>('');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 50000 });
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showVRAMDropdown, setShowVRAMDropdown] = useState(false);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const vramDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setShowModelDropdown(false);
      }
      if (vramDropdownRef.current && !vramDropdownRef.current.contains(event.target as Node)) {
        setShowVRAMDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const findGPUScore = (name: string) => {
    // Normaliza e limpa o nome para comparação
    const normalizedName = name.toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/placa\s+de\s+video\s*/gi, '') // Remove "Placa de Video"
      .replace(/\b(mancer|asus|gigabyte|msi|evga|zotac|powercolor|sapphire|asrock|galax)\b/gi, '') // Remove brand names
      .replace(/\b(oc|gaming|dual|eagle|aorus|strix|tuf|pulse|red\s*devil|phantom|hof|hall\s*of\s*fame)\b/gi, '') // Remove model variants
      .replace(/[^\w\s-]/g, '') // Remove special characters except hyphen
      .replace(/\b(geforce|radeon|nvidia|amd)\b/gi, '') // Remove brand names
      .replace(/\b(rtx|gtx|rx)\b/gi, '') // Remove common prefixes
      .trim();

    // Se não encontrar correspondência exata, procura por correspondência parcial
    const modelMatch = normalizedName.match(/\b(\d{3,4})\s*(ti|xt|super)?\b/i);
    if (!modelMatch) {
      return undefined;
    }

    const modelNumber = modelMatch[1];
    const suffix = modelMatch[2]?.toLowerCase() || '';
    
    // Procura por placas com o mesmo número de modelo e sufixo
    const possibleMatches = gpuScores.filter(gpu => {
      const gpuNormalized = gpu.name.toLowerCase();
      const hasModelNumber = gpuNormalized.includes(modelNumber);
      
      // Se a placa tem um sufixo (super, ti, xt), deve corresponder exatamente
      if (suffix) {
        const hasExactSuffix = gpuNormalized.includes(` ${suffix}`);
        return hasModelNumber && hasExactSuffix;
      }
      
      // Se a placa não tem sufixo, não deve corresponder a versões com sufixo
      return hasModelNumber && 
        !gpuNormalized.includes(' super') && 
        !gpuNormalized.includes(' ti') && 
        !gpuNormalized.includes(' xt');
    });

    if (possibleMatches.length === 0) return undefined;
    if (possibleMatches.length === 1) return possibleMatches[0];

    // Se encontrar múltiplas correspondências, tenta encontrar a mais específica
    return possibleMatches.reduce((best, current) => {
      const currentNormalized = current.name.toLowerCase();
      const bestNormalized = best.name.toLowerCase();
      
      // Conta quantas palavras do nome original correspondem
      const currentMatchScore = normalizedName.split(' ').filter(word => 
        currentNormalized.includes(word.toLowerCase())
      ).length;
      
      const bestMatchScore = normalizedName.split(' ').filter(word => 
        bestNormalized.includes(word.toLowerCase())
      ).length;

      return currentMatchScore > bestMatchScore ? current : best;
    });
  };

  const getGPUManufacturer = (name: string): string | undefined => {
    const normalizedName = name.toLowerCase();
    const manufacturers = [
      'asus', 'gigabyte', 'msi', 'galax', 'zotac', 'pcyes', 'xfx', 'sapphire'
    ];

    return manufacturers.find(manufacturer => normalizedName.includes(manufacturer));
  };

  const getWarrantyInfo = (name: string): WarrantyInfo | undefined => {
    const manufacturer = getGPUManufacturer(name);
    if (!manufacturer) return undefined;

    // Special case for Zotac cards
    if (manufacturer === 'zotac') {
      const isLegacy = name.toLowerCase().includes('rtx 30') || 
                      name.toLowerCase().includes('gtx') ||
                      name.toLowerCase().includes('rtx 20');
      return manufacturerWarranties[isLegacy ? 'zotac-legacy' : 'zotac'];
    }

    return manufacturerWarranties[manufacturer];
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
        // Parse g3d score from string with comma to number
        const g3dScore = gpuScore?.g3d ? Number(String(gpuScore.g3d).replace(',', '')) : undefined;
        const tdp = gpuScore?.tdp ? Number(gpuScore.tdp) : undefined;

        // Calcula custo/benefício (G3D Score / Preço) * 1000 para melhor legibilidade
        const pricePerformance = g3dScore ? Number((g3dScore / mappedPrice.price).toFixed(1)) : 0;
        
        // Calcula eficiência (G3D Score / TDP)
        const efficiencyScore = (g3dScore && tdp) ? Number((g3dScore / tdp).toFixed(1)) : 0;

        // Get warranty information
        const warranty = getWarrantyInfo(mappedPrice.name);

        combined.push({
          ...mappedPrice,
          g3dScore,
          tdp,
          pricePerformance,
          efficiencyScore,
          warranty
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

  // Get unique model names for the dropdown
  const uniqueModels = Array.from(new Set(gpuData.map(gpu => {
    // Extract the basic model number (e.g., "RTX 4090" from full name)
    const match = gpu.name.match(/(?:RTX|GTX|RX|Arc\sA)\s*\d{3,4}/i);
    return match ? match[0].toUpperCase() : '';
  }).filter(model => model !== ''))).sort();

  // Filter models based on search
  const filteredModels = uniqueModels.filter(model => 
    model.toLowerCase().includes(modelSearch.toLowerCase())
  );

  const handleModelSelect = (model: string) => {
    setSelectedModels(prev => {
      if (prev.includes(model)) {
        return prev.filter(m => m !== model);
      }
      return [...prev, model];
    });
    setModelSearch('');
  };

  const handleRemoveModel = (modelToRemove: string) => {
    setSelectedModels(prev => prev.filter(model => model !== modelToRemove));
  };

  // Get unique VRAM sizes from GPU names
  const uniqueVRAMs = Array.from(new Set(gpuData.map(gpu => {
    const match = gpu.name.match(/\b(\d+)\s*GB\b/i);
    return match ? parseInt(match[1]) + 'GB' : '';
  }).filter(vram => vram !== ''))).sort((a, b) => {
    const aNum = parseInt(a);
    const bNum = parseInt(b);
    return aNum - bNum;
  });

  const handleVRAMSelect = (vram: string) => {
    setSelectedVRAMs(prev => {
      if (prev.includes(vram)) {
        return prev.filter(v => v !== vram);
      }
      return [...prev, vram];
    });
  };

  const handleRemoveVRAM = (vramToRemove: string) => {
    setSelectedVRAMs(prev => prev.filter(vram => vram !== vramToRemove));
  };

  const filteredData = sortedData.filter(gpu => {
    // Filter by warranty
    if (selectedWarranty > 0 && (!gpu.warranty || gpu.warranty.years !== selectedWarranty)) {
      return false;
    }

    // Filter by specific models
    if (selectedModels.length > 0) {
      const matches = selectedModels.some(model => 
        gpu.name.toLowerCase().includes(model.toLowerCase())
      );
      if (!matches) return false;
    }

    // Filter by VRAM
    if (selectedVRAMs.length > 0) {
      const match = gpu.name.match(/\b(\d+)\s*GB\b/i);
      const gpuVRAM = match ? parseInt(match[1]) + 'GB' : '';
      if (!gpuVRAM || !selectedVRAMs.includes(gpuVRAM)) {
        return false;
      }
    }

    // Filter by price range
    if (priceRange.min > 0 && gpu.price < priceRange.min) return false;
    if (priceRange.max < 50000 && gpu.price > priceRange.max) return false;

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
              Banheirão GPU Comparator
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
              <label className="text-sm font-medium text-gray-700">Garantia:</label>
              <select
                value={selectedWarranty}
                onChange={(e) => setSelectedWarranty(Number(e.target.value))}
                className="rounded-md border border-gray-300 px-3 py-1"
              >
                <option value={0}>Todas</option>
                <option value={2}>2 anos</option>
                <option value={3}>3 anos</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">VRAM:</label>
              <div className="relative" ref={vramDropdownRef}>
                <div 
                  className="flex flex-wrap items-center gap-1 min-h-[2.25rem] p-1 w-48 rounded-md border border-gray-300 bg-white cursor-pointer"
                  onClick={() => setShowVRAMDropdown(!showVRAMDropdown)}
                >
                  {selectedVRAMs.map(vram => (
                    <div 
                      key={vram}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                    >
                      {vram}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveVRAM(vram);
                        }}
                        className="hover:text-blue-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {selectedVRAMs.length === 0 && (
                    <span className="text-gray-500 text-sm px-2">Selecionar VRAM...</span>
                  )}
                </div>
                {showVRAMDropdown && uniqueVRAMs.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {uniqueVRAMs.map((vram) => (
                      <div
                        key={vram}
                        className={`px-3 py-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between ${
                          selectedVRAMs.includes(vram) ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handleVRAMSelect(vram)}
                      >
                        <span>{vram}</span>
                        {selectedVRAMs.includes(vram) && (
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Modelo:</label>
              <div className="relative" ref={modelDropdownRef}>
                <div className="flex flex-wrap items-center gap-1 min-h-[2.25rem] p-1 w-64 rounded-md border border-gray-300 bg-white">
                  {selectedModels.map(model => (
                    <div 
                      key={model}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                    >
                      {model}
                      <button
                        onClick={() => handleRemoveModel(model)}
                        className="hover:text-blue-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <input
                    type="text"
                    value={modelSearch}
                    onChange={(e) => {
                      setModelSearch(e.target.value);
                      setShowModelDropdown(true);
                    }}
                    onFocus={() => setShowModelDropdown(true)}
                    placeholder={selectedModels.length === 0 ? "Buscar modelo..." : ""}
                    className="flex-1 min-w-[100px] border-none focus:outline-none p-1"
                  />
                </div>
                {showModelDropdown && filteredModels.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredModels.map((model) => (
                      <div
                        key={model}
                        className={`px-3 py-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between ${
                          selectedModels.includes(model) ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handleModelSelect(model)}
                      >
                        <span>{model}</span>
                        {selectedModels.includes(model) && (
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Preço:</label>
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                className="w-24 rounded-md border border-gray-300 px-3 py-1"
                placeholder="Min"
              />
              <span>-</span>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                className="w-24 rounded-md border border-gray-300 px-3 py-1"
                placeholder="Max"
              />
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
                    <th className="px-4 py-2">Garantia</th>
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
                        {gpu.pricePerformance ? gpu.pricePerformance.toFixed(1) : '-'}
                      </td>
                      <td className="px-4 py-2">
                        {gpu.efficiencyScore ? gpu.efficiencyScore.toFixed(1) : '-'}
                      </td>
                      <td className="px-4 py-2">
                        {gpu.warranty ? (
                          <div className="text-sm">
                            <div>{gpu.warranty.years} anos</div>
                            {gpu.warranty.description && (
                              <div className="text-gray-500 text-xs">{gpu.warranty.description}</div>
                            )}
                          </div>
                        ) : '-'}
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