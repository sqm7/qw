// js/modules/state.js

import { dom } from './dom.js'; // 【第1步：在檔案最上方加入這行匯入】

export const state = {
    // Data and Pagination
    currentPage: 1,
    pageSize: 50,
    totalRecords: 0,
    
    // Filters
    selectedDistricts: [],
    selectedProjects: [],
    
    // UI State
    suggestionDebounceTimer: null,
    
    // Analysis & Reports
    analysisDataCache: null,
    currentSort: { key: 'saleAmountSum', order: 'desc' },
    rankingCurrentPage: 1,
    rankingPageSize: 10,
    currentAverageType: 'arithmetic',
    
    // Price Band Report State
    selectedPriceBandRoomTypes: [], // 總價帶分析的房型篩選

    // Velocity Report State
    selectedVelocityRooms: [],
    currentVelocityView: 'monthly',
    lastHeatmapDetails: null, // 用於儲存熱力圖點擊的數據
    currentHeatmapDetailMetric: 'median', // 熱力圖詳細數據的預設統計類型

    // Price Grid Report State
    selectedPriceGridProject: null,
    isHeatmapActive: false,
    currentLegendFilter: { type: null, value: null },

    excludeCommercial: false,
};

export function getFilters() {
    // 【第2步：移除 "window."，直接使用匯入的 dom】
    return {
        county: dom.countySelect.value,
        districts: state.selectedDistricts,
        type: dom.typeSelect.value,
        buildingType: dom.buildingTypeSelect.value,
        dateStart: dom.dateStartInput.value,
        dateEnd: dom.dateEndInput.value,
        projectNames: state.selectedProjects,
        floorPremium: parseFloat(dom.floorPremiumInput.value),
        excludeCommercial: state.excludeCommercial,
    };
}
