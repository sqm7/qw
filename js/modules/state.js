// js/modules/state.js

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
    // 【關鍵修正】: 遵從您原始的架3構，從 window 物件讀取 dom
    const dom = window.dom; 
    
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
