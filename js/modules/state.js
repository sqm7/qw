// js/modules/state.js

/**
 * 全局狀態管理物件
 */
export const state = {
    // --- 使用者身份與權限 ---
    user: null,

    // --- 下拉選單選項 ---
    countyNames: [],
    districtNames: [],
    projectNames: [],

    // --- 查詢參數 ---
    lastQueryParams: null,

    // --- 數據快取 ---
    analysisDataCache: null,
    
    // --- UI 狀態 ---
    isReportVisible: false,

    // --- 圖表與互動狀態 ---
    // 總價帶分析
    availablePriceBandRoomTypes: [],
    selectedPriceBandRoomTypes: [],
    
    // 銷售速度分析
    availableVelocityRooms: [],
    selectedVelocityRooms: [],
    currentVelocityView: 'monthly', // 'monthly', 'quarterly', 'yearly'

    // 面積分佈熱力圖
    areaHeatmapChart: null,
    lastHeatmapDetails: null // 用於存儲點擊熱力圖單元格後的詳細數據
};
