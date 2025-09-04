// js/modules/state.js

import { dom } from './dom.js';
import { getCurrentDate, getDateMonthsAgo } from './utils.js';

export const state = {
    currentPage: 1,
    itemsPerPage: 50,
    totalItems: 0,
    sortColumn: '交易日期',
    sortOrder: 'desc',
    currentData: [],
    allData: [],
    selectedDistricts: [],
    selectedProjects: [],
    analysisDataCache: null,
    excludeCommercial: false, // 【新增此行】
    currentSort: { key: 'saleAmountSum', order: 'desc' },
    currentRankingPage: 1,
    rankingItemsPerPage: 10,
    currentPriceBandRoomType: 'all',
    currentVelocityRoomType: 'all',
    currentVelocityView: 'monthly',
    currentAvgType: 'arithmetic',
    priceGrid: {
        currentProject: null,
        projects: []
    },
    heatmap: {
        currentMetric: 'median'
    }
};

export function getFilters() {
    const filters = {};
    const county = dom.county.value;
    const districts = state.selectedDistricts;
    const type = dom.type.value;
    const buildingType = dom.buildingType.value;
    const dateStart = dom.dateStart.value;
    const dateEnd = dom.dateEnd.value;
    const floorPremium = parseFloat(dom.floorPremiumInput.value);

    if (county) filters.countyCode = county;
    if (districts && districts.length > 0) filters.districts = districts;
    if (type) filters.type = type;
    if (buildingType) filters.buildingType = buildingType;
    if (dateStart) filters.dateStart = dateStart;
    if (dateEnd) filters.dateEnd = dateEnd;
    if (state.selectedProjects.length > 0) filters.projectNames = state.selectedProjects;
    if (!isNaN(floorPremium) && floorPremium >= 0) filters.floorPremium = floorPremium;
    
    filters.excludeCommercial = state.excludeCommercial; // 【新增此行】

    return filters;
}

export function updateStateFromFilters() {
    state.currentPage = 1; 
}

export function initializeDateRange() {
    const oneYearAgo = getDateMonthsAgo(12);
    dom.dateStart.value = oneYearAgo;
    dom.dateEnd.value = getCurrentDate();
}
