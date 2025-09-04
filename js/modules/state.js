export const appState = {
    // Data
    rawData: [],
    filteredData: [],
    analysisResult: null,
    projectNames: [],
    
    // Filters
    filters: {
        county: '',
        districts: [],
        buildingType: '',
        projectNames: [],
        dateStart: '',
        dateEnd: '',
    },

    // UI State
    activeTab: null,
    isLoading: false,
    currentPage: 1,
    itemsPerPage: 50,
    sortColumn: 'transaction_date',
    sortDirection: 'desc',
    
    // Report-specific state
    reports: {
        unitPrice: {
            avgType: 'arithmetic', // 'arithmetic' or 'weighted'
        },
        velocity: {
            selectedRooms: [],
            timeUnit: 'monthly', // weekly, monthly, quarterly, yearly
            heatmapParams: {
                minArea: 8,
                maxArea: 100,
                interval: 5,
            },
            heatmapMetric: 'median', // median, weighted, arithmetic
        },
        priceBand: {
            selectedRooms: [],
        },
        priceGrid: {
            selectedProject: null,
            isHeatmapMode: false,
            heatmapFilters: {
                legend: [],
                icons: []
            }
        },
        ranking: {
            residentialOnly: false, // <<< 新增
        }
    }
};

export function setAppState(newState) {
    Object.assign(appState, newState);
}

export function setFilters(newFilters) {
    Object.assign(appState.filters, newFilters);
}

export function setReportState(report, newReportState) {
    Object.assign(appState.reports[report], newReportState);
}
