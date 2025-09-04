// js/modules/state.js

import { dom } from './dom.js'; // 【修正點 1：在檔案最上方加入這行，這是我之前遺漏的關鍵】

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
    selectedPriceBandRoomTypes: [],

    // Velocity Report State
    selectedVelocityRooms: [],
    currentVelocityView: 'monthly',
    lastHeatmapDetails: null, 
    currentHeatmapDetailMetric: 'median',

    // Price Grid Report State
    selectedPriceGridProject: null,
    isHeatmapActive: false,
    currentLegendFilter: { type: null, value: null },

    // 新增的功能狀態
    excludeCommercial: false,
};

export function getFilters() {
    // 【修正點 2：直接使用上方匯入的 dom 物件，移除所有 "window."】
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
