// js/modules/state.js

/**
 * @typedef {Object} GlobalState
 * @property {string|null} currentCounty - The currently selected county.
 * @property {string[]} selectedDistricts - A list of currently selected districts.
 * @property {string[]} selectedProjects - A list of currently selected project names.
 * @property {string|null} dateStart - The start date for the filter.
 * @property {string|null} dateEnd - The end date for the filter.
 * @property {string|null} buildingType - The selected building type.
 * @property {any[]} data - The raw data fetched from the API.
 * @property {any[]} filteredData - The data after applying filters.
 * @property {boolean} isLoading - A flag to indicate if data is being loaded.
 * @property {any} analysisDataCache - To cache the results of data analysis.
 * @property {string} currentUnitPriceAvgType - The current average type for unit price ('arithmetic' or 'weighted').
 * @property {string} currentVelocityView - The current view for sales velocity ('weekly', 'monthly', 'quarterly', 'yearly').
 * @property {string} currentRankingMetric - The currently selected metric for the ranking treemap.
 */

/**
 * The global state of the application.
 * @type {GlobalState}
 */
export const state = {
    currentCounty: null,
    selectedDistricts: [],
    selectedProjects: [],
    dateStart: null,
    dateEnd: null,
    buildingType: null,
    data: [],
    filteredData: [],
    isLoading: false,
    analysisDataCache: null, 
    currentUnitPriceAvgType: 'arithmetic',
    currentVelocityView: 'monthly',
    currentRankingMetric: 'saleAmountSum', //  新增這一行
};

/**
 * Updates the global state.
 * @param {Partial<GlobalState>} newState - An object with the new state values.
 */
export function updateState(newState) {
    Object.assign(state, newState);
}
