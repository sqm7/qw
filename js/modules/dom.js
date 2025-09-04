export const domElements = {
    // Filters
    filterForm: document.getElementById('filter-form'),
    county: document.getElementById('county'),
    districtContainer: document.getElementById('district-container'),
    districtInputArea: document.getElementById('district-input-area'),
    districtSuggestions: document.getElementById('district-suggestions'),
    clearDistrictsBtn: document.getElementById('clear-districts-btn'),
    buildingType: document.getElementById('building-type'),
    projectNameInput: document.getElementById('project-name-input'),
    projectNameContainer: document.getElementById('project-name-container'),
    projectNameSuggestions: document.getElementById('project-name-suggestions'),
    clearProjectsBtn: document.getElementById('clear-projects-btn'),
    dateRange: document.getElementById('date-range'),
    dateStart: document.getElementById('date-start'),
    dateEnd: document.getElementById('date-end'),
    setTodayBtn: document.getElementById('set-today-btn'),
    
    // Buttons
    searchBtn: document.getElementById('search-btn'),
    analyzeBtn: document.getElementById('analyze-btn'),

    // Results Area
    resultsContainer: document.getElementById('results-container'),
    messageArea: document.getElementById('message-area'),
    
    // Tabs
    tabsContainer: document.getElementById('tabs-container'),
    tabButtons: document.querySelectorAll('.tab-button'),
    
    // Tab Content - Data List
    dataListContent: document.getElementById('data-list-content'),
    tableContainer: document.getElementById('table-container'),
    resultsTable: document.getElementById('results-table'),
    paginationControls: document.getElementById('pagination-controls'),

    // Tab Content - Ranking Report
    rankingReportContent: document.getElementById('ranking-report-content'),
    metricCardsContainer: document.getElementById('metric-cards-container'),
    rankingChartContainer: document.getElementById('ranking-chart-container'),
    rankingTable: document.getElementById('ranking-table'),
    rankingFilterToggle: document.getElementById('ranking-filter-toggle'), // <<< 新增

    // Tab Content - Price Band Report
    priceBandReportContent: document.getElementById('price-band-report-content'),
    priceBandRoomFilterContainer: document.getElementById('price-band-room-filter-container'),
    priceBandChart: document.getElementById('price-band-chart'),
    priceBandTable: document.getElementById('price-band-table'),

    // Tab Content - Unit Price Report
    unitPriceReportContent: document.getElementById('unit-price-report-content'),
    avgTypeToggle: document.getElementById('avg-type-toggle'),
    residentialStatsTableContainer: document.getElementById('residential-stats-table-container'),
    officeStatsTableContainer: document.getElementById('office-stats-table-container'),
    storeStatsTableContainer: document.getElementById('store-stats-table-container'),
    residentialStatsExtraInfo: document.getElementById('residential-stats-extra-info'),
    officeStatsExtraInfo: document.getElementById('office-stats-extra-info'),
    storeStatsExtraInfo: document.getElementById('store-stats-extra-info'),
    typeComparisonTableContainer: document.getElementById('type-comparison-table-container'),
    
    // Tab Content - Parking Report
    parkingReportContent: document.getElementById('parking-report-content'),
    parkingRatioTableContainer: document.getElementById('parking-ratio-table-container'),
    avgPriceByTypeTableContainer: document.getElementById('avg-price-by-type-table-container'),
    rampPlanePriceByFloorTableContainer: document.getElementById('ramp-plane-price-by-floor-table-container'),

    // Tab Content - Velocity Report
    velocityReportContent: document.getElementById('velocity-report-content'),
    velocityRoomFilterContainer: document.getElementById('velocity-room-filter-container'),
    velocitySubTabsContainer: document.getElementById('velocity-sub-tabs-container'),
    salesVelocityChart: document.getElementById('sales-velocity-chart'),
    velocityTableContainer: document.getElementById('velocity-table-container'),
    areaHeatmapChart: document.getElementById('area-heatmap-chart'),
    heatmapDetailsContainer: document.getElementById('heatmap-details-container'),
    heatmapDetailsContent: document.getElementById('heatmap-details-content'),
    heatmapMinAreaInput: document.getElementById('heatmap-min-area-input'),
    heatmapMaxAreaInput: document.getElementById('heatmap-max-area-input'),
    heatmapIntervalInput: document.getElementById('heatmap-interval-input'),
    heatmapIntervalDecrement: document.getElementById('heatmap-interval-decrement'),
    heatmapIntervalIncrement: document.getElementById('heatmap-interval-increment'),
    heatmapMetricToggle: document.getElementById('heatmap-metric-toggle'),
    heatmapDetailsControls: document.getElementById('heatmap-details-controls'),

    // Tab Content - Price Grid Report
    priceGridReportContent: document.getElementById('price-grid-report-content'),
    priceGridProjectFilterContainer: document.getElementById('price-grid-project-filter-container'),
    horizontalPriceGridContainer: document.getElementById('horizontal-price-grid-container'),
    unitColorLegnedContainer: document.getElementById('unit-color-legend-container'),
    analyzeHeatmapBtn: document.getElementById('analyze-heatmap-btn'),
    backToGridBtn: document.getElementById('back-to-grid-btn'),
    floorPremiumInput: document.getElementById('floor-premium-input'),
    heatmapInfoContainer: document.getElementById('heatmap-info-container'),
    heatmapColorLegend: document.getElementById('heatmap-color-legend'),
    heatmapIconLegend: document.getElementById('heatmap-icon-legend'),
    heatmapSummaryTableContainer: document.getElementById('heatmap-summary-table-container'),
    heatmapHorizontalComparisonTableContainer: document.getElementById('heatmap-horizontal-comparison-table-container'),
    sharePriceGridBtn: document.getElementById('share-price-grid-btn'),

    // Modals
    detailsModal: document.getElementById('details-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalContent: document.getElementById('modal-content'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    shareModal: document.getElementById('share-modal'),
    shareModalCloseBtn: document.getElementById('share-modal-close-btn'),
    shareUrlInput: document.getElementById('share-url-input'),
    copyShareUrlBtn: document.getElementById('copy-share-url-btn'),
    copyFeedback: document.getElementById('copy-feedback'),

    // User Status
    userStatusContainer: document.getElementById('user-status-container'),
};
