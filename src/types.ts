export interface GPUPrice {
  Modelo: string;
  ValorAV: number;
  ValorParc: number;
  Parcelas?: number;
  Loja?: string;
  Link: string;
}

export interface FirstRowData {
  lastUpdate: string;
}

export interface WarrantyInfo {
  years: number;
  description?: string;
}

export interface GPUData {
  name: string;
  price: number;
  installmentPrice: number;
  installments: number;
  store: string;
  url: string;
  g3dScore?: number;
  tdp?: number;
  pricePerformance: number;
  efficiencyScore: number;
  warranty?: WarrantyInfo;
}

export interface StoreData {
  [key: string]: GPUPrice[];
}