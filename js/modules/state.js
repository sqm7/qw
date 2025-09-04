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

    // ▼▼▼ 【新增處 1】 ▼▼▼
    excludeCommercial: false, // 是否排除店面/事務所
    // ▲▲▲ 【新增結束】 ▲▲▲
};

export function getFilters() {
    // 【關鍵修正】: 遵從您原始的架構，從 window 物件讀取 dom
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
        // ▼▼▼ 【新增處 2】 ▼▼▼
        excludeCommercial: state.excludeCommercial,
        // ▲▲▲ 【新增結束】 ▲▲▲
    };
}
