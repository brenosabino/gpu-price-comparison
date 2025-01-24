import { ArrowUpDown, Clock, RefreshCcw, X, Bath, Moon, Sun } from 'lucide-react';
import { fetchFirstRow, fetchAllStores } from './api';
import { gpuScores } from './data/gpuScores';
import { manufacturerWarranties } from './data/warrantyInfo';
import type { GPUData, StoreData, WarrantyInfo } from './types';
import { useEffect, useState, useRef } from 'react';

function App() {
  const [gpuData, setGpuData] = useState<GPUData[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [sortBy, setSortBy] = useState<keyof GPUData>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [g3dRange, setG3dRange] = useState<{ min: number; max: number }>({ min: 0, max: 40000 });
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedVRAMs, setSelectedVRAMs] = useState<string[]>([]);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [selectedWarranty, setSelectedWarranty] = useState<number>(0); // 0 means all
  const [modelSearch, setModelSearch] = useState<string>('');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 50000 });
  const [priceFilterType, setPriceFilterType] = useState<'cash' | 'installment'>('cash');
  const [pricePerformanceType, setPricePerformanceType] = useState<'cash' | 'installment'>('cash');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showVRAMDropdown, setShowVRAMDropdown] = useState(false);
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const vramDropdownRef = useRef<HTMLDivElement>(null);
  const storeDropdownRef = useRef<HTMLDivElement>(null);

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
      if (storeDropdownRef.current && !storeDropdownRef.current.contains(event.target as Node)) {
        setShowStoreDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Apply dark mode class to body
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const findGPUScore = (name: string) => {
    console.log('=== Starting GPU Score Search ===');
    console.log('Original:', name);

    // First normalize spaces and case, and remove accents
    let normalizedName = name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/\s+/g, ' ')
      .trim();
    
    console.log('After space normalization:', normalizedName);

    // Remove "Placa de Video" prefix
    normalizedName = normalizedName.replace(/placa\s+de\s+video\s*/gi, '');
    console.log('After removing prefix:', normalizedName);

    // Remove memory specifications
    normalizedName = normalizedName.replace(/\b\d+\s*gb\s+gddr\d+\b/gi, '');
    console.log('After removing memory:', normalizedName);

    // Remove part numbers at the end
    normalizedName = normalizedName.replace(/\s*-\s*[\w\d-]+\s*$/i, '');
    console.log('After removing part numbers:', normalizedName);

    // Remove brand names and model variants
    normalizedName = normalizedName
      .replace(/\b(mancer|asus|gigabyte|msi|evga|zotac|powercolor|sapphire|asrock|galax|vx\s*pro|bluecase|hwj|xfx)\b/gi, '')
      .replace(/\b(oc|gaming|dual|eagle|aorus|strix|tuf|pulse|red\s*devil|phantom|hof|hall\s*of\s*fame|gamer)\b/gi, '')
      .replace(/\b(fsr|ray\s*tracing|384-bit)\b/gi, '') // Remove feature names
      .replace(/\b(geforce|nvidia|amd)\b/gi, '') // Remove other brand names
      .trim();
    console.log('After removing brands and variants:', normalizedName);

    // Remove special characters except hyphen and clean up multiple spaces
    normalizedName = normalizedName
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    console.log('After removing special chars:', normalizedName);

    // Keep rx/rtx/gtx and clean up the name
    normalizedName = normalizedName
      .replace(/\b(radeon)\b/gi, '') // Remove 'radeon' but keep RX
      .trim()
      .replace(/\s+/g, ' ');
    console.log('After final cleanup:', normalizedName);

    // Add space after RX/GTX/RTX if it's missing
    const spacedName = normalizedName
      .replace(/\b(rtx|gtx|rx)(\d)/gi, '$1 $2')
      .trim();
    console.log('Final spaced name:', spacedName);

    // Try to match the model number and any suffix (like Ti, SUPER, XT)
    const modelMatch = spacedName.match(/\b(?:rtx|gtx|rx)?\s*(\d{3,4})\s*(ti|xt|super)?\b/i);
    if (!modelMatch) {
      console.log('No model match found');
      return undefined;
    }

    const modelNumber = modelMatch[1];
    const suffix = modelMatch[2]?.toLowerCase() || '';
    console.log('Model number:', modelNumber);
    console.log('Suffix:', suffix || 'xtx'); // Default to 'xtx' for 7900 XTX cards

    // Find all possible matches
    const possibleMatches = gpuScores.filter(gpu => {
      const gpuNormalized = gpu.name.toLowerCase();
      
      // Check if the model number is present
      const hasModelNumber = gpuNormalized.includes(modelNumber);
      if (!hasModelNumber) return false;
      
      // For 7900 XTX cards, we need to match the XTX suffix
      if (modelNumber === '7900' && spacedName.toLowerCase().includes('xtx')) {
        return gpuNormalized.includes('xtx');
      }
      
      // For other cards with suffixes (ti, xt, super), match exactly
      if (suffix) {
        return gpuNormalized.includes(` ${suffix}`);
      }
      
      // If no suffix, make sure we don't match cards with suffixes
      return !gpuNormalized.includes(' super') && 
             !gpuNormalized.includes(' ti') && 
             !gpuNormalized.includes(' xt') &&
             !gpuNormalized.includes(' xtx');
    });

    console.log('Possible matches:', possibleMatches);

    if (possibleMatches.length === 0) {
      console.log('No matches found');
      return undefined;
    }
    
    if (possibleMatches.length === 1) {
      console.log('Single match found:', possibleMatches[0]);
      return possibleMatches[0];
    }

    // If we have multiple matches, try to find the best one
    const bestMatch = possibleMatches.reduce((best, current) => {
      const currentNormalized = current.name.toLowerCase();
      const bestNormalized = best.name.toLowerCase();
      
      // Count how many words from the original name match
      const currentMatchScore = spacedName.split(' ').filter(word => 
        currentNormalized.includes(word.toLowerCase())
      ).length;
      
      const bestMatchScore = spacedName.split(' ').filter(word => 
        bestNormalized.includes(word.toLowerCase())
      ).length;

      return currentMatchScore > bestMatchScore ? current : best;
    });

    console.log('Best match found:', bestMatch);
    return bestMatch;
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

  const processStoreData = (storeData: StoreData, currentPricePerformanceType: 'cash' | 'installment'): GPUData[] => {
    const combined: GPUData[] = [];
    
    Object.entries(storeData).forEach(([store, prices]) => {
      prices.forEach((price) => {
        // Map the API properties to our expected properties
        const mappedPrice = {
          name: price.Modelo,
          simplifiedModel: price.ModeloSimplificado,
          price: price.ValorAV,
          installmentPrice: price.ValorParc,
          installments: price.Parcelas || 12, // Default to 12 if not provided
          store: price.Loja || store,
          url: price.Link
        };

        const gpuScore = findGPUScore(mappedPrice.name);
        // Parse g3d score from string with comma to number
        const g3dScore = gpuScore?.g3d ? Number(String(gpuScore.g3d).replace(',', '')) : undefined;
        const tdp = gpuScore?.tdp ? Number(gpuScore.tdp) : undefined;

        // Calcula custo/benefício (G3D Score / Preço) * 1000 para melhor legibilidade
        const pricePerformance = g3dScore && typeof mappedPrice.price === 'number' && typeof mappedPrice.installmentPrice === 'number' ? 
          Number((g3dScore / (currentPricePerformanceType === 'cash' ? mappedPrice.price : mappedPrice.installmentPrice)).toFixed(1)) : 0;
        
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
      const combinedData = processStoreData(storeData, pricePerformanceType);
      setGpuData(combinedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (gpuData.length > 0) {
      const reprocessedData = processStoreData(
        Object.fromEntries(
          Array.from(new Set(gpuData.map(gpu => gpu.store))).map(store => [
            store,
            gpuData.filter(gpu => gpu.store === store).map(gpu => ({
              Modelo: gpu.name,
              ModeloSimplificado: gpu.simplifiedModel,
              ValorAV: gpu.price,
              ValorParc: gpu.installmentPrice,
              Parcelas: gpu.installments,
              Loja: gpu.store,
              Link: gpu.url
            }))
          ])
        ),
        pricePerformanceType
      );
      setGpuData(reprocessedData);
    }
  }, [pricePerformanceType]);

  const handleSort = (key: keyof GPUData) => {
    setSortOrder(current => key === sortBy ? (current === 'asc' ? 'desc' : 'asc') : 'asc');
    setSortBy(key);
  };

  const sortedData = [...gpuData].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    // Special handling for price performance sorting
    if (sortBy === 'pricePerformance') {
      // If both items have no score, maintain their original order
      if (!aValue && !bValue) return 0;
      // If only one item has no score, put it at the end
      if (!aValue) return 1;
      if (!bValue) return -1;
      // If both have scores, sort normally
      return sortOrder === 'asc' ? 
        (aValue as number) - (bValue as number) : 
        (bValue as number) - (aValue as number);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return sortOrder === 'asc' 
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const formatPrice = (price: any) => {
    if (typeof price !== 'number') {
      return price; // Return the original text if it's not a number
    }
    return price.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Get unique model names for the dropdown
  const uniqueModels = Array.from(new Set(gpuData.map(gpu => 
    gpu.simplifiedModel.toUpperCase()
  ).filter(model => model !== ''))).sort();

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

  // Get unique stores from GPU data
  const uniqueStores = Array.from(new Set(gpuData.map(gpu => gpu.store))).sort();

  const handleStoreSelect = (store: string) => {
    setSelectedStores(prev => {
      if (prev.includes(store)) {
        return prev.filter(s => s !== store);
      }
      return [...prev, store];
    });
  };

  const handleRemoveStore = (storeToRemove: string) => {
    setSelectedStores(prev => prev.filter(store => store !== storeToRemove));
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString('pt-BR');
  };

  const filteredData = sortedData.filter(gpu => {
    // Filter by warranty
    if (selectedWarranty > 0 && (!gpu.warranty || gpu.warranty.years !== selectedWarranty)) {
      return false;
    }

    // Filter by stores
    if (selectedStores.length > 0 && !selectedStores.includes(gpu.store)) {
      return false;
    }

    // Filter by specific models
    if (selectedModels.length > 0) {
      const matches = selectedModels.some(model => 
        gpu.simplifiedModel.toUpperCase() === model.toUpperCase()
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

    // Filter by price range based on selected price type
    const priceToCompare = priceFilterType === 'cash' ? gpu.price : gpu.installmentPrice;
    
    // Skip price filtering if the price is not a number (e.g., "Verificar no site")
    if (typeof priceToCompare !== 'number') {
      return priceRange.min === 0 && priceRange.max === 50000; // Only show non-numeric prices when no price filter is active
    }

    // Apply price filter
    if (priceRange.min > 0 && priceToCompare < priceRange.min) return false;
    if (priceRange.max < 50000 && priceToCompare > priceRange.max) return false;

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

  const handleResetFilters = () => {
    setSelectedWarranty(0);
    setSelectedStores([]);
    setSelectedVRAMs([]);
    setSelectedModels([]);
    setPriceRange({ min: 0, max: 50000 });
    setG3dRange({ min: 0, max: 40000 });
    setPriceFilterType('cash');
    setPricePerformanceType('cash');
    setModelSearch('');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-3 sm:p-6`}>
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-2">
              <Bath className={`w-6 h-6 sm:w-8 sm:h-8 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
              <h1 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Banheirão GPU Comparator
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} flex items-center`}>
                <Clock className="w-4 h-4 mr-1" />
                Última atualização: {formatDate(lastUpdate)}
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`flex items-center px-3 py-1.5 ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                  } text-${darkMode ? 'white' : 'gray-700'} rounded-lg transition-colors flex-1 sm:flex-none justify-center`}
                >
                  {darkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                  {darkMode ? 'Modo Claro' : 'Modo Escuro'}
                </button>
                <button
                  onClick={handleResetFilters}
                  className={`flex items-center px-3 py-1.5 ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-500 hover:bg-gray-600'
                  } text-white rounded-lg transition-colors flex-1 sm:flex-none justify-center`}
                >
                  <X className="w-4 h-4 mr-2" />
                  Limpar Filtros
                </button>
                <button
                  onClick={fetchData}
                  className="flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex-1 sm:flex-none justify-center"
                  disabled={loading}
                >
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Atualizar
                </button>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="mb-6 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Warranty Filter */}
              <div className="flex items-center gap-2">
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Garantia:</label>
                <select
                  value={selectedWarranty}
                  onChange={(e) => setSelectedWarranty(Number(e.target.value))}
                  className={`rounded-md border border-gray-300 px-3 py-1 w-full ${
                    darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'
                  }`}
                >
                  <option value={0}>Todas</option>
                  <option value={2}>2 anos</option>
                  <option value={3}>3 anos</option>
                </select>
              </div>

              {/* Stores Filter */}
              <div className="flex items-center gap-2">
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Lojas:</label>
                <div className="relative flex-1" ref={storeDropdownRef}>
                  <div 
                    className="flex flex-wrap items-center gap-1 min-h-[2.25rem] p-1 w-full rounded-md border border-gray-300 bg-white cursor-pointer"
                    onClick={() => setShowStoreDropdown(!showStoreDropdown)}
                  >
                    {selectedStores.map(store => (
                      <div 
                        key={store}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                      >
                        {store}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveStore(store);
                          }}
                          className="hover:text-blue-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {selectedStores.length === 0 && (
                      <span className="text-gray-500 text-sm px-2">Selecionar lojas...</span>
                    )}
                  </div>
                  {showStoreDropdown && uniqueStores.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {uniqueStores.map((store) => (
                        <div
                          key={store}
                          className={`px-3 py-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between ${
                            selectedStores.includes(store) ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => handleStoreSelect(store)}
                        >
                          <span>{store}</span>
                          {selectedStores.includes(store) && (
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* VRAM Filter */}
              <div className="flex items-center gap-2">
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>VRAM:</label>
                <div className="relative flex-1" ref={vramDropdownRef}>
                  <div 
                    className="flex flex-wrap items-center gap-1 min-h-[2.25rem] p-1 w-full rounded-md border border-gray-300 bg-white cursor-pointer"
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

              {/* Model Filter */}
              <div className="flex items-center gap-2">
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Modelo:</label>
                <div className="relative flex-1" ref={modelDropdownRef}>
                  <div className="flex flex-wrap items-center gap-1 min-h-[2.25rem] p-1 w-full rounded-md border border-gray-300 bg-white">
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
                      className="flex-1 min-w-[100px] border-none focus:outline-none p-1 h-6 text-sm"
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

              {/* Price Filter */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Preço:</label>
                <div className="flex gap-2 flex-1">
                  <select
                    value={priceFilterType}
                    onChange={(e) => setPriceFilterType(e.target.value as 'cash' | 'installment')}
                    className={`rounded-md border border-gray-300 px-2 py-1 text-sm ${
                      darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'
                    }`}
                  >
                    <option value="cash">À Vista</option>
                    <option value="installment">Parcelado</option>
                  </select>
                  <div className="flex gap-2 flex-1">
                    <div className="relative flex-1">
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">R$</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={formatNumber(priceRange.min)}
                        onChange={(e) => {
                          const value = Number(e.target.value.replace(/\D/g, ''));
                          if (!isNaN(value)) {
                            setPriceRange(prev => ({ ...prev, min: value }));
                          }
                        }}
                        className="w-full rounded-md border border-gray-300 px-2 py-1 pl-7 text-sm"
                      />
                    </div>
                    <span className="text-sm">-</span>
                    <div className="relative flex-1">
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">R$</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={formatNumber(priceRange.max)}
                        onChange={(e) => {
                          const value = Number(e.target.value.replace(/\D/g, ''));
                          if (!isNaN(value)) {
                            setPriceRange(prev => ({ ...prev, max: value }));
                          }
                        }}
                        className="w-full rounded-md border border-gray-300 px-2 py-1 pl-7 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* G3D Mark Filter */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>G3D Mark:</label>
                <div className="flex gap-2 flex-1">
                  <input
                    type="text"
                    value={formatNumber(g3dRange.min)}
                    onChange={(e) => {
                      const value = Number(e.target.value.replace(/\D/g, ''));
                      setG3dRange(prev => ({ ...prev, min: value }));
                    }}
                    className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
                    placeholder="Min"
                  />
                  <span className="text-sm">-</span>
                  <input
                    type="text"
                    value={formatNumber(g3dRange.max)}
                    onChange={(e) => {
                      const value = Number(e.target.value.replace(/\D/g, ''));
                      setG3dRange(prev => ({ ...prev, max: value }));
                    }}
                    className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
                    placeholder="Max"
                  />
                </div>
                <div className="flex items-center gap-2 sm:ml-4">
                  <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Custo/Benefício:</label>
                  <select
                    value={pricePerformanceType}
                    onChange={(e) => setPricePerformanceType(e.target.value as 'cash' | 'installment')}
                    className={`rounded-md border border-gray-300 px-2 py-1 text-sm ${
                      darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'
                    }`}
                  >
                    <option value="cash">À Vista</option>
                    <option value="installment">Parcelado</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {filteredData.length} placas encontradas
            </div>
          </div>

          {/* Table Section */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
                darkMode ? 'border-blue-400' : 'border-blue-500'
              }`}></div>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full">
                    <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                      <tr>
                        <th scope="col" className={`px-3 py-2 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider cursor-pointer`} onClick={() => handleSort('name')}>
                          <div className="flex items-center">
                            Placa de Vídeo
                            {sortBy === 'name' && <ArrowUpDown className="w-4 h-4 ml-1" />}
                          </div>
                        </th>
                        <th scope="col" className={`px-3 py-2 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider cursor-pointer`} onClick={() => handleSort('price')}>
                          <div className="flex items-center">
                            Preço à Vista
                            {sortBy === 'price' && <ArrowUpDown className="w-4 h-4 ml-1" />}
                          </div>
                        </th>
                        <th scope="col" className={`px-3 py-2 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider cursor-pointer`} onClick={() => handleSort('installmentPrice')}>
                          <div className="flex items-center">
                            Preço Parcelado
                            {sortBy === 'installmentPrice' && <ArrowUpDown className="w-4 h-4 ml-1" />}
                          </div>
                        </th>
                        <th scope="col" className={`px-3 py-2 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                          Loja
                        </th>
                        <th scope="col" className={`px-3 py-2 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider cursor-pointer`} onClick={() => handleSort('g3dScore')}>
                          <div className="flex items-center">
                            G3D Mark
                            {sortBy === 'g3dScore' && <ArrowUpDown className="w-4 h-4 ml-1" />}
                          </div>
                        </th>
                        <th scope="col" className={`px-3 py-2 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider cursor-pointer`} onClick={() => handleSort('tdp')}>
                          <div className="flex items-center">
                            TDP (W)
                            {sortBy === 'tdp' && <ArrowUpDown className="w-4 h-4 ml-1" />}
                          </div>
                        </th>
                        <th scope="col" className={`px-3 py-2 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider cursor-pointer`} onClick={() => handleSort('pricePerformance')}>
                          <div className="flex items-center">
                            Custo/Benefício
                            {sortBy === 'pricePerformance' && <ArrowUpDown className="w-4 h-4 ml-1" />}
                          </div>
                        </th>
                        <th scope="col" className={`px-3 py-2 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider cursor-pointer`} onClick={() => handleSort('efficiencyScore')}>
                          <div className="flex items-center">
                            Eficiência
                            {sortBy === 'efficiencyScore' && <ArrowUpDown className="w-4 h-4 ml-1" />}
                          </div>
                        </th>
                        <th scope="col" className={`px-3 py-2 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                          Garantia
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                      {filteredData.map((gpu, index) => (
                        <tr 
                          key={index}
                          className={`hover:bg-${darkMode ? 'gray-700' : 'blue-50'} cursor-pointer transition-colors`}
                          onClick={() => window.open(gpu.url, '_blank')}
                        >
                          <td className={`px-3 py-2 whitespace-normal text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            <a 
                              href={gpu.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} hover:underline`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {gpu.name}
                            </a>
                          </td>
                          <td className={`px-3 py-2 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatPrice(gpu.price)}</td>
                          <td className={`px-3 py-2 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatPrice(gpu.installmentPrice)}</td>
                          <td className={`px-3 py-2 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{gpu.store}</td>
                          <td className={`px-3 py-2 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{gpu.g3dScore?.toLocaleString() || '-'}</td>
                          <td className={`px-3 py-2 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{gpu.tdp || '-'}</td>
                          <td className={`px-3 py-2 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {gpu.pricePerformance ? gpu.pricePerformance.toFixed(1) : '-'}
                          </td>
                          <td className={`px-3 py-2 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {gpu.efficiencyScore ? gpu.efficiencyScore.toFixed(1) : '-'}
                          </td>
                          <td className={`px-3 py-2 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {gpu.warranty ? (
                              <div>
                                <div>{gpu.warranty.years} anos</div>
                                {gpu.warranty.description && (
                                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {gpu.warranty.description}
                                  </div>
                                )}
                              </div>
                            ) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;