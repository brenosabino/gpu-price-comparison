import type { WarrantyInfo } from '../types';

interface ManufacturerWarranty {
  [key: string]: WarrantyInfo;
}

export const manufacturerWarranties: ManufacturerWarranty = {
  'asus': { years: 3, description: 'Garantia Nacional' },
  'gigabyte': { years: 3, description: 'Garantia Nacional' },
  'msi': { years: 3, description: 'Garantia Nacional' },
  'galax': { years: 3, description: 'Garantia Nacional (Exceto modelos GT)' },
  'zotac': { years: 3, description: 'Garantia para série 40 adiante' },
  'zotac-legacy': { years: 2, description: 'Garantia para série 30 ou anterior' },
  'pcyes': { years: 2, description: 'Garantia Nacional' },
  'xfx': { years: 2, description: 'Garantia Nacional (1º ano) + Internacional (2º ano)' },
  'sapphire': { years: 2, description: 'Garantia Nacional (1º ano) + Internacional (2º ano)' }
}; 