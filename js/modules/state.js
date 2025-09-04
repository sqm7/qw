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

    // ▼▼▼ 【新增處】 ▼▼▼
    excludeCommercial: false, // 是否排除店面/事務所
    // ▲▲▲ 【新增結束】 ▲▲▲
};

export function getFilters() {
    const dom = window.dom; // Accessing global dom object
    return {
        county: dom.countySelect.value,
        districts: state.selectedDistricts,
        type: dom.typeSelect.value,
        buildingType: dom.buildingTypeSelect.value,
        dateStart: dom.dateStartInput.value,
        dateEnd: dom.dateEndInput.value,
        projectNames: state.selectedProjects,
        floorPremium: parseFloat(dom.floorPremiumInput.value),
        excludeCommercial: state.excludeCommercial, // 【新增此行】
    };
}
