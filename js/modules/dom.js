// js/modules/dom.js

export const dom = {
    // 篩選器
    filterCard: document.getElementById('filter-card'),
    countySelect: document.getElementById('county'),
    typeSelect: document.getElementById('type'),
    buildingTypeSelect: document.getElementById('building-type'),
    dateStartInput: document.getElementById('date-start'),
    dateEndInput: document.getElementById('date-end'),
    dateRangeSelect: document.getElementById('date-range'),
    setTodayBtn: document.getElementById('set-today-btn'),
    floorPremiumInput: document.getElementById('floor-premium-input'),

    // 行政區篩選器
    districtFilterWrapper: document.getElementById('district-filter-wrapper'),
    districtContainer: document.getElementById('district-container'),
    districtInputArea: document.getElementById('district-input-area'),
    districtSuggestions: document.getElementById('district-suggestions'),
    clearDistrictsBtn: document.getElementById('clear-districts-btn'),

    // 建案名稱篩選器
    projectFilterWrapper: document.getElementById('project-filter-wrapper'),
    projectNameContainer: document.getElementById('project-name-container'),
    projectNameInput: document.getElementById('project-name-input'),
    projectNameSuggestions: document.getElementById('project-name-suggestions'),
    clearProjectsBtn: document.getElementById('clear-projects-btn'),

    // 按鈕
    searchBtn: document.getElementById('search-btn'),
    analyzeBtn: document.getElementById('analyze-btn'),
    analyzeHeatmapBtn: document.getElementById('analyze-heatmap-btn'),
    backToGridBtn: document.getElementById('back-to-grid-btn'),

    // 主要容器
    resultsContainer: document.getElementById('results-container'),
    messageArea: document.getElementById('message-area'),
    tabsContainer: document.getElementById('tabs-container'),
    
    // 資料列表
    dataListContent: document.getElementById('data-list-content'),
    tableContainer: document.getElementById('table-container'),
    resultsTable: document.getElementById('results-table'),
    paginationControls: document.getElementById('pagination-controls'),

    // 報表 - 核心指標
    rankingReportContent: document.getElementById('ranking-report-content'),
    metricCardsContainer: document.getElementById('metric-cards-container'),
    rankingTable: document.getElementById('ranking-table'),
    rankingPaginationControls: document.createElement('div'), // This was created dynamically in original code
    rankingChartContainer: document.getElementById('ranking-chart-container'),
    excludeCommercialToggle: document.getElementById('exclude-commercial-toggle'), // 【新增此行】

    // 報表 - 總價帶
    priceBandReportContent: document.getElementById('price-band-report-content'),
    priceBandRoomFilterContainer: document.getElementById('price-band-room-filter-container'),
    priceBandChart: document.getElementById('price-band-chart'),
    priceBandTable: document.getElementById('price-band-table'),
    
    // 報表 - 單價分析
    unitPriceReportContent: document.getElementById('unit-price-report-content'),
    avgTypeToggle: document.getElementById('avg-type-toggle'),
    residentialStatsTableContainer: document.getElementById('residential-stats-table-container'),
    officeStatsTableContainer: document.getElementById('office-stats-table-container'),
    storeStatsTableContainer: document.getElementById('store-stats-table-container'),
    residentialStatsExtraInfo: document.getElementById('residential-stats-extra-info'),
    officeStatsExtraInfo: document.getElementById('office-stats-extra-info'),
    storeStatsExtraInfo: document.getElementById('store-stats-extra-info'),
    typeComparisonTableContainer: document.getElementById('type-comparison-table-container'),
    averageTypeExplanation: document.getElementById('average-type-explanation'),

    // 報表 - 車位分析
    parkingReportContent: document.getElementById('parking-report-content'),
    parkingRatioTableContainer: document.getElementById('parking-ratio-table-container'),
    avgPriceByTypeTableContainer: document.getElementById('avg-price-by-type-table-container'),
    rampPlanePriceByFloorTableContainer: document.getElementById('ramp-plane-price-by-floor-table-container'),
    
    // 報表 - 去化分析
    velocityReportContent: document.getElementById('velocity-report-content'),
    velocityRoomFilterContainer: document.getElementById('velocity-room-filter-container'),
    velocitySubTabsContainer: document.getElementById('velocity-sub-tabs-container'),
    salesVelocityChart: document.getElementById('sales-velocity-chart'),
    velocityTableContainer: document.getElementById('velocity-table-container'),
    areaHeatmapChart: document.getElementById('area-heatmap-chart'),
    heatmapMinAreaInput: document.getElementById('heatmap-min-area-input'),
    heatmapMaxAreaInput: document.getElementById('heatmap-max-area-input'),
    heatmapIntervalInput: document.getElementById('heatmap-interval-input'),
    heatmapIntervalIncrementBtn: document.getElementById('heatmap-interval-increment'),
    heatmapIntervalDecrementBtn: document.getElementById('heatmap-interval-decrement'),
    heatmapDetailsContainer: document.getElementById('heatmap-details-container'),
    heatmapDetailsControls: document.getElementById('heatmap-details-controls'),
    heatmapMetricToggle: document.getElementById('heatmap-metric-toggle'),
    heatmapDetailsContent: document.getElementById('heatmap-details-content'),

    // 報表 - 垂直水平分析
    priceGridReportContent: document.getElementById('price-grid-report-content'),
    priceGridProjectFilterContainer: document.getElementById('price-grid-project-filter-container'),
    horizontalPriceGridContainer: document.getElementById('horizontal-price-grid-container'),
    unitColorLegendContainer: document.getElementById('unit-color-legend-container'),
    heatmapInfoContainer: document.getElementById('heatmap-info-container'),
    heatmapLegendContainer: document.getElementById('heatmap-legend-container'),
    heatmapSummaryTableContainer: document.getElementById('heatmap-summary-table-container'),
    heatmapHorizontalComparisonTableContainer: document.getElementById('heatmap-horizontal-comparison-table-container'),
    sharePriceGridBtn: document.getElementById('share-price-grid-btn'),

    // 彈出視窗 (Modal)
    modal: document.getElementById('details-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalContent: document.getElementById('modal-content'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    
    // 分享彈出視窗
    shareModal: document.getElementById('share-modal'),
    shareUrlInput: document.getElementById('share-url-input'),
    copyShareUrlBtn: document.getElementById('copy-share-url-btn'),
    copyFeedback: document.getElementById('copy-feedback'),
    shareModalCloseBtn: document.getElementById('share-modal-close-btn'),
};
