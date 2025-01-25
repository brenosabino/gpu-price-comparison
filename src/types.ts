export interface GPUPrice {
  Modelo: string;
  ModeloSimplificado: string;
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

export type BenchmarkType = 'raster' | 'raytracing';
export type ResolutionType = '1080p_medium' | '1080p_ultra' | '1440p_ultra' | '4k_ultra';

export interface GPUData {
  name: string;
  simplifiedModel: string;
  price: number;
  installmentPrice: number;
  installments: number;
  store: string;
  url: string;
  fps?: number;
  tdp?: number;
  pricePerformance: number;
  efficiencyScore: number;
  warranty?: WarrantyInfo;
}

export interface StoreData {
  [key: string]: GPUPrice[];
}