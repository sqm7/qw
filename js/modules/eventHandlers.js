import { domElements } from './dom.js';
import { appState, setAppState, setFilters, setReportState } from './state.js';
import { fetchDistricts, fetchProjectNames, fetchData, analyzeData } from './api.js';
import { updateDistrictSuggestions, updateDistrictInputArea, updateProjectNameSuggestions, updateProjectNameInput, clearDistrictSelection, clearProjectSelection, displayData, displayMessage, showLoading, hideLoading, switchTab, updatePagination, setActiveTab, displayAnalysisReports, updateDateInputs, applyUrlParameters } from './ui.js';
import { debounce } from './utils.js';

let districtAbortController = new AbortController();
let projectAbortController = new AbortController();

export function setupEventListeners() {
    // Filter event listeners
    domElements.county.addEventListener('change', handleCountyChange);
    domElements.districtInputArea.addEventListener('click', () => domElements.districtSuggestions.classList.remove('hidden'));
    domElements.clearDistrictsBtn.addEventListener('click', clearDistrictSelection);
    
    domElements.projectNameInput.addEventListener('input', debounce(handleProjectNameInput, 300));
    domElements.projectNameInput.addEventListener('focus', () => {
        if (domElements.projectNameInput.value.length > 0) {
            domElements.projectNameSuggestions.classList.remove('hidden');
        }
    });
    domElements.clearProjectsBtn.addEventListener('click', clearProjectSelection);

    domElements.dateRange.addEventListener('change', handleDateRangeChange);
    domElements.setTodayBtn.addEventListener('click', handleSetToday);
    
    // Main action buttons
    domElements.searchBtn.addEventListener('click', handleSearchClick);
    domElements.analyzeBtn.addEventListener('click', handleAnalyzeClick);

    // Click outside to close suggestions
    document.addEventListener('click', (e) => {
        if (!domElements.districtInputArea.parentElement.contains(e.target)) {
            domElements.districtSuggestions.classList.add('hidden');
        }
        if (!domElements.projectNameContainer.parentElement.contains(e.target)) {
            domElements.projectNameSuggestions.classList.add('hidden');
        }
    });

    // Tab navigation
    domElements.tabsContainer.addEventListener('click', (e) => {
        if (e.target.matches('.tab-button')) {
            const tabName = e.target.dataset.tab;
            handleTabClick(tabName);
        }
    });

    // Modal close buttons
    domElements.modalCloseBtn.addEventListener('click', () => domElements.detailsModal.classList.add('hidden'));
    domElements.shareModalCloseBtn.addEventListener('click', () => domElements.shareModal.classList.add('hidden'));
    domElements.copyShareUrlBtn.addEventListener('click', copyShareUrl);
    
    // Report-specific event listeners
    setupUnitPriceReportListeners();
    setupVelocityReportListeners();
    setupPriceGridReportListeners();
    setupRankingReportListeners(); // <<< 新增

    // Initial page load
    applyUrlParameters();
}

function setupUnitPriceReportListeners() {
    domElements.avgTypeToggle.addEventListener('click', (e) => {
        if (e.target.matches('.avg-type-btn')) {
            const newType = e.target.dataset.type;
            if (appState.reports.unitPrice.avgType !== newType) {
                setReportState('unitPrice', { avgType: newType });
                // Re-render the unit price report part without re-fetching
                if (appState.analysisResult) {
                     displayAnalysisReports(appState.analysisResult);
                }
            }
        }
    });
}
function setupVelocityReportListeners() {
    domElements.velocitySubTabsContainer.addEventListener('click', (e) => {
        if (e.target.matches('.sub-tab-btn')) {
            const newTimeUnit = e.target.dataset.view;
            if (appState.reports.velocity.timeUnit !== newTimeUnit) {
                setReportState('velocity', { timeUnit: newTimeUnit });
                if (appState.analysisResult) {
                    displayAnalysisReports(appState.analysisResult);
                }
            }
        }
    });
    // Heatmap listeners
    const debouncedHeatmapRender = debounce(() => {
        if (appState.analysisResult) displayAnalysisReports(appState.analysisResult);
    }, 500);

    const heatmapParamChangeHandler = (e) => {
        setReportState('velocity', {
            heatmapParams: {
                ...appState.reports.velocity.heatmapParams,
                minArea: parseInt(domElements.heatmapMinAreaInput.value) || 0,
                maxArea: parseInt(domElements.heatmapMaxAreaInput.value) || 100,
                interval: parseInt(domElements.heatmapIntervalInput.value) || 5,
            }
        });
        debouncedHeatmapRender();
    };

    domElements.heatmapMinAreaInput.addEventListener('change', heatmapParamChangeHandler);
    domElements.heatmapMaxAreaInput.addEventListener('change', heatmapParamChangeHandler);
    domElements.heatmapIntervalInput.addEventListener('change', heatmapParamChangeHandler);
    
    domElements.heatmapIntervalDecrement.addEventListener('click', () => {
        domElements.heatmapIntervalInput.stepDown();
        heatmapParamChangeHandler();
    });
    domElements.heatmapIntervalIncrement.addEventListener('click', () => {
        domElements.heatmapIntervalInput.stepUp();
        heatmapParamChangeHandler();
    });
     domElements.heatmapMetricToggle.addEventListener('click', (e) => {
        if (e.target.matches('.avg-type-btn')) {
            const newMetric = e.target.dataset.type;
            if (appState.reports.velocity.heatmapMetric !== newMetric) {
                setReportState('velocity', { heatmapMetric: newMetric });
                if (appState.analysisResult) {
                    // Just update the details display, no need to re-render the whole chart
                     const { renderHeatmapDetails } = require('../renderers/heatmap.js');
                     renderHeatmapDetails(appState.analysisResult.velocityAnalysis.areaHeatmap.data);
                }
            }
        }
    });
}

function setupPriceGridReportListeners() {
    domElements.analyzeHeatmapBtn.addEventListener('click', handleAnalyzeHeatmapClick);
    domElements.backToGridBtn.addEventListener('click', handleBackToGridClick);
}

// ▼▼▼ 【新增函式】 ▼▼▼
function setupRankingReportListeners() {
    domElements.rankingFilterToggle.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        setReportState('ranking', { residentialOnly: isChecked });

        // If analysis has already been run, re-run it with the new setting
        if (appState.analysisResult) {
            handleAnalyzeClick();
        }
    });
}
// ▲▲▲ 【新增結束】 ▲▲▲


async function handleCountyChange() {
    const county = domElements.county.value;
    setFilters({ county, districts: [], projectNames: [] });
    
    clearDistrictSelection();
    clearProjectSelection();
    updateDistrictInputArea();
    updateProjectNameInput();

    domElements.projectNameInput.disabled = true;
    domElements.projectNameInput.placeholder = '請先選縣市...';

    if (county) {
        try {
            const districts = await fetchDistricts(county);
            updateDistrictSuggestions(districts, handleDistrictSelection);
            domElements.districtInputArea.textContent = '請選擇行政區...';
            domElements.districtInputArea.classList.remove('text-gray-400/80');
        } catch (error) {
            console.error('Failed to fetch districts:', error);
            displayMessage('無法載入行政區，請稍後再試。');
        }
    } else {
        updateDistrictSuggestions([], handleDistrictSelection);
        domElements.districtInputArea.textContent = '請先選縣市...';
        domElements.districtInputArea.classList.add('text-gray-400/80');
    }
}

function handleDistrictSelection(district) {
    const currentDistricts = appState.filters.districts;
    if (currentDistricts.includes(district)) {
        setFilters({ districts: currentDistricts.filter(d => d !== district) });
    } else {
        setFilters({ districts: [...currentDistricts, district] });
    }
    updateDistrictInputArea();
    
    // After district selection changes, clear project names and fetch new ones
    clearProjectSelection();
    setFilters({ projectNames: [] });
    updateProjectNameInput();

    if (appState.filters.county && appState.filters.districts.length > 0) {
        domElements.projectNameInput.disabled = false;
        domElements.projectNameInput.placeholder = '可輸入建案...';
    } else {
        domElements.projectNameInput.disabled = true;
        domElements.projectNameInput.placeholder = '請先選行政區...';
    }
}

async function handleProjectNameInput() {
    const query = domElements.projectNameInput.value;
    if (query.length < 1 && appState.filters.projectNames.length === 0) {
        domElements.projectNameSuggestions.classList.add('hidden');
        return;
    }

    projectAbortController.abort();
    projectAbortController = new AbortController();
    const signal = projectAbortController.signal;

    try {
        const { county, districts } = appState.filters;
        const projectNames = await fetchProjectNames(county, districts, query, signal);
        
        // Filter out already selected names
        const unselectedNames = projectNames.filter(p => !appState.filters.projectNames.includes(p.project_name));
        
        updateProjectNameSuggestions(unselectedNames.map(p => p.project_name), handleProjectNameSelection);
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Failed to fetch project names:', error);
        }
    }
}

function handleProjectNameSelection(projectName) {
    const currentProjects = appState.filters.projectNames;
    if (!currentProjects.includes(projectName)) {
        setFilters({ projectNames: [...currentProjects, projectName] });
        updateProjectNameInput();
        domElements.projectNameInput.value = '';
        domElements.projectNameSuggestions.classList.add('hidden');
    }
}

function handleDateRangeChange() {
    updateDateInputs(this.value);
}

function handleSetToday() {
    const today = new Date().toISOString().split('T')[0];
    domElements.dateEnd.value = today;
}

function collectFilters() {
    const filters = {
        county: domElements.county.value,
        districts: appState.filters.districts,
        building_type: domElements.buildingType.value,
        project_names: appState.filters.projectNames,
        start_date: domElements.dateStart.value,
        end_date: domElements.dateEnd.value,
    };
    return filters;
}

async function handleSearchClick() {
    const filters = collectFilters();
    if (!filters.county) {
        displayMessage('請至少選擇一個縣市。');
        return;
    }

    showLoading('查詢中...');
    try {
        const data = await fetchData(filters, 1, appState.itemsPerPage, appState.sortColumn, appState.sortDirection);
        setAppState({ rawData: data.data, totalItems: data.count, currentPage: 1 });
        displayData(data.data);
        updatePagination(data.count, 1);
        setActiveTab('data-list');
    } catch (error) {
        console.error('Search failed:', error);
        displayMessage(`查詢失敗：${error.message}`);
    } finally {
        hideLoading();
    }
}

async function handleAnalyzeClick() {
    const filters = collectFilters();
    if (!filters.county) {
        displayMessage('請至少選擇一個縣市來進行分析。');
        return;
    }

    showLoading('分析中，請稍候...');
    try {
        // Collect report-specific settings
        const reportSettings = {
            ranking: {
                residentialOnly: appState.reports.ranking.residentialOnly
            }
        };

        const result = await analyzeData(filters, reportSettings);
        setAppState({ analysisResult: result });
        displayAnalysisReports(result);
        if (!appState.activeTab || appState.activeTab === 'data-list') {
            setActiveTab('ranking-report');
        } else {
            // If already on a report tab, stay there but re-render
            setActiveTab(appState.activeTab);
        }
    } catch (error) {
        console.error('Analysis failed:', error);
        displayMessage(`分析失敗：${error.message}`);
    } finally {
        hideLoading();
    }
}


function handleTabClick(tabName) {
    // If switching to a report tab and no analysis has been run, run it.
    if (tabName.endsWith('-report') && !appState.analysisResult) {
        handleAnalyzeClick();
    } else {
        setActiveTab(tabName);
    }
}

function copyShareUrl() {
    domElements.shareUrlInput.select();
    document.execCommand('copy');
    domElements.copyFeedback.classList.remove('hidden');
    setTimeout(() => {
        domElements.copyFeedback.classList.add('hidden');
    }, 2000);
}

async function handleAnalyzeHeatmapClick() {
    const selectedProject = appState.reports.priceGrid.selectedProject;
    if (!selectedProject) {
        displayMessage('請先在上方選擇一個建案進行分析。');
        return;
    }
    
    showLoading('正在進行熱力圖分析...');
    try {
        const { analyzePriceGridHeatmap } = require('../renderers/heatmap.js');
        const filters = collectFilters();
        const premium = parseFloat(domElements.floorPremiumInput.value);

        // We use the main analyzeData function but only care for the priceGrid part
        const result = await analyzeData({ ...filters, project_names: [selectedProject] });
        
        if (result && result.priceGridAnalysis) {
             setAppState({ analysisResult: result }); // Store the latest result
             analyzePriceGridHeatmap(result.priceGridAnalysis, premium);
             setReportState('priceGrid', { isHeatmapMode: true });
        } else {
             throw new Error('分析結果中未包含銷控表數據。');
        }

    } catch (error) {
        console.error('Heatmap analysis failed:', error);
        displayMessage(`熱力圖分析失敗：${error.message}`);
    } finally {
        hideLoading();
    }
}

function handleBackToGridClick() {
    setReportState('priceGrid', { isHeatmapMode: false });
    // Re-render the price grid report from existing analysisResult
    if (appState.analysisResult) {
        displayAnalysisReports(appState.analysisResult);
    }
}
