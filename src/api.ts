import type { FirstRowData, StoreData } from './types';

const STORES = [
  'Amazon',
  'AlligatorShop',
  'Enifler',
  'FGTec',
  'Gigantec',
  'GuerraDigital',
  'GKInfoStore',
  'Inpower',
  'ItxGamer',
  'Kabum',
  'Magalu',
  'MercadoLivre',
  'Microgem',
  'Patoloco',
  'Pichau',
  'Terabyte',
  'Waz'
];

const BASE_URL = 'https://www.placasdevideo.app.br/precos';

export async function fetchFirstRow(): Promise<FirstRowData> {
  try {
    const response = await fetch(`${BASE_URL}/firstRow.json`);
    const data = await response.json();
    console.log('Raw firstRow response:', data);
    
    // If it's an array, get the first item
    const firstRow = Array.isArray(data) ? data[0] : data;
    
    // Extract the date from the Modelo field and remove the prefix
    const lastUpdate = (firstRow.Modelo || '').replace('Última atualização ', '');
    
    console.log('Processed firstRow data:', { lastUpdate });
    
    return { lastUpdate };
  } catch (error) {
    console.error('Error fetching firstRow:', error);
    return { lastUpdate: '' };
  }
}

export async function fetchAllStores(): Promise<StoreData> {
  const storeData: StoreData = {};
  
  await Promise.all(
    STORES.map(async (store) => {
      try {
        const response = await fetch(`${BASE_URL}/${store}.json`);
        storeData[store] = await response.json();
      } catch (error) {
        console.error(`Error fetching ${store} data:`, error);
        storeData[store] = [];
      }
    })
  );

  return storeData;
}