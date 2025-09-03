// js/modules/dom.js

/**
 * 集中管理所有 DOM 元素的引用
 */
export const dom = {
    // --- 身份驗證 ---
    logoutButton: document.getElementById('logout-button'),
    mobileLogoutButton: document.getElementById('mobile-logout-button'),
    
    // --- 選單 ---
    mobileMenuButton: document.getElementById('mobile-menu-button'),
    mobileMenu: document.getElementById('mobile-menu'),

    // --- 查詢表單 ---
    queryForm: document.getElementById('query-form'),
    countySelect: document.getElementById('county-select'),
    districtSelect: document.getElementById('district-select'),
    projectNameSelect: document.getElementById('project-name-select'),
    dateRangeSelect: document.getElementById('date-range-select'),
    clearFiltersButton: document.getElementById('clear-filters-button'),
    queryButton: document.getElementById('query-button'),

    // --- 狀態顯示 ---
    loadingSpinner: document.getElementById('loading-spinner'),
    
    // --- 報告區塊 ---
    reportSection: document.getElementById('report-section'),
    reportSummary: document.getElementById('report-summary'),
    downloadReportButton: document.getElementById('download-report-button'),
    shareReportButton: document.getElementById('share-report-button'),
    
    // --- 報告頁籤 ---
    reportTabs: document.getElementById('report-tabs'),
    rankingTab: document.getElementById('ranking-tab'),
    priceBandTab: document.getElementById('price-band-tab'),
    salesVelocityTab: document.getElementById('sales-velocity-tab'),
    areaDistributionTab: document.getElementById('area-distribution-tab'),
    
    // --- 核心指標與排名 ---
    rankingChartContainer: document.getElementById('ranking-chart-container'),
    rankingTable: document.getElementById('ranking-table'),
    
    // --- 總價帶分析 ---
    priceBandRoomTypeFilter: document.getElementById('price-band-room-type-filter'),
    priceBandChart: document.getElementById('price-band-chart'),
    priceBandTable: document.getElementById('price-band-table'),
    
    // --- 銷售速度 ---
    salesVelocityRoomTypeFilter: document.getElementById('sales-velocity-room-type-filter'),
    salesVelocityViewToggle: document.getElementById('sales-velocity-view-toggle'),
    salesVelocityChart: document.getElementById('sales-velocity-chart'),
    salesVelocityTable: document.getElementById('sales-velocity-table'),
    
    // --- 面積分佈 (熱力圖) ---
    heatmapIntervalInput: document.getElementById('heatmap-interval-input'),
    heatmapMinAreaInput: document.getElementById('heatmap-min-area-input'),
    heatmapMaxAreaInput: document.getElementById('heatmap-max-area-input'),
    heatmapRoomTypeFilter: document.getElementById('heatmap-room-type-filter'),
    heatmapUpdateButton: document.getElementById('heatmap-update-button'),
    areaHeatmapChart: document.getElementById('area-heatmap-chart'),
    heatmapDetailsSection: document.getElementById('heatmap-details-section'),
    heatmapDetailsTitle: document.getElementById('heatmap-details-title'),
    heatmapDetailsTable: document.getElementById('heatmap-details-table'),

    // --- 分享彈窗 ---
    shareModal: document.getElementById('share-modal'),
    closeShareModalButton: document.getElementById('close-share-modal-button'),
    shareLinkInput: document.getElementById('share-link-input'),
    copyShareLinkButton: document.getElementById('copy-share-link-button'),
    copyFeedback: document.getElementById('copy-feedback'),
};
