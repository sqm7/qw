// js/app.js

import { supabase } from './supabase-client.js';
import { dom } from './modules/dom.js';
import { initializeDatepickers, populateCountyOptions, checkLoginStatus, handleLogout } from './modules/ui.js';
import {
    handleCountyChange,
    handleDistrictSuggestionClick,
    handleProjectNameInput,
    handleProjectSuggestionClick,
    handleClearDistricts,
    handleClearProjects,
    handleAnalyze,
    handleSearch,
    handleTabClick,
    handlePageChange,
    handleSetToday,
    handleDateRangeChange,
    handleAvgTypeToggle,
    handleVelocitySubTabClick,
    handleRoomFilterClick,
    handleHeatmapIntervalChange,
    handleHeatmapRangeChange,
    handleHeatmapDetailsMetricToggle,
    handlePriceGridProjectFilterClick,
    handleAnalyzeHeatmap,
    handleBackToGrid,
    handleSharePriceGrid,
    handleRankingMetricChange // ▼▼▼ 【已在此處新增 import】 ▼▼▼
} from './modules/eventHandlers.js';
import { updateState } from './modules/state.js';

/**
 * 初始化應用程式事件監聽器
 */
function initializeEventListeners() {
    // 篩選器相關
    dom.countySelect.addEventListener('change', handleCountyChange);
    dom.districtSuggestions.addEventListener('click', handleDistrictSuggestionClick);
    dom.projectNameInput.addEventListener('input', handleProjectNameInput);
    dom.projectNameSuggestions.addEventListener('click', handleProjectSuggestionClick);
    dom.clearDistrictsBtn.addEventListener('click', handleClearDistricts);
    dom.clearProjectsBtn.addEventListener('click', handleClearProjects);
    dom.dateRangeSelect.addEventListener('change', handleDateRangeChange);
    dom.setTodayBtn.addEventListener('click', handleSetToday);

    // 主要操作按鈕
    dom.analyzeBtn.addEventListener('click', handleAnalyze);
    dom.searchBtn.addEventListener('click', handleSearch);

    // Tab 導航
    dom.tabsContainer.addEventListener('click', handleTabClick);

    // 資料列表分頁
    dom.paginationControls.addEventListener('click', handlePageChange);
    
    // 登出按鈕 (如果存在)
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // --- 報告內互動事件 ---
    
    // ▼▼▼ 【已在此處新增監聽器】 ▼▼▼
    // 核心指標與排名
    dom.rankingMetricSelector.addEventListener('click', handleRankingMetricChange);
    // ▲▲▲ 【新增結束】 ▲▲▲

    // 總價帶分析
    dom.priceBandRoomFilterContainer.addEventListener('click', (e) => handleRoomFilterClick(e, 'price-band'));

    // 單價分析
    dom.avgTypeToggle.addEventListener('click', handleAvgTypeToggle);

    // 去化分析
    dom.velocitySubTabsContainer.addEventListener('click', handleVelocitySubTabClick);
    dom.velocityRoomFilterContainer.addEventListener('click', (e) => handleRoomFilterClick(e, 'velocity'));
    dom.heatmapIntervalIncrement.addEventListener('click', () => handleHeatmapIntervalChange(1));
    dom.heatmapIntervalDecrement.addEventListener('click', () => handleHeatmapIntervalChange(-1));
    dom.heatmapMinAreaInput.addEventListener('change', handleHeatmapRangeChange);
    dom.heatmapMaxAreaInput.addEventListener('change', handleHeatmapRangeChange);
    dom.heatmapDetailsMetricToggle.addEventListener('click', handleHeatmapDetailsMetricToggle);

    // 垂直水平分析
    dom.priceGridProjectFilterContainer.addEventListener('click', handlePriceGridProjectFilterClick);
    dom.analyzeHeatmapBtn.addEventListener('click', handleAnalyzeHeatmap);
    dom.backToGridBtn.addEventListener('click', handleBackToGrid);
    dom.sharePriceGridBtn.addEventListener('click', handleSharePriceGrid);

    // 點擊區域外關閉下拉選單
    document.addEventListener('click', (e) => {
        if (!dom.districtFilterWrapper.contains(e.target)) {
            dom.districtSuggestions.classList.add('hidden');
        }
        if (!dom.projectFilterWrapper.contains(e.target)) {
            dom.projectNameSuggestions.classList.add('hidden');
        }
    });
    
    // 讓 district-container 也能觸發顯示建議
    dom.districtContainer.addEventListener('click', () => {
        if (!dom.countySelect.value) return;
        dom.districtSuggestions.classList.remove('hidden');
    });
}


/**
 * 檢查 URL 中是否有共享報告的參數
 */
async function checkForSharedReport() {
    const urlParams = new URLSearchParams(window.location.search);
    const reportId = urlParams.get('report');

    if (reportId) {
        // 移除 URL 中的 report 參數，避免重新整理時再次觸發
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);

        try {
            const { data, error } = await supabase.functions.invoke('public-report', {
                body: { reportId: reportId },
            });

            if (error) throw error;
            
            if (data && data.filters && data.analysisData) {
                // 更新狀態並渲染報告
                updateState({
                    currentCounty: data.filters.county,
                    selectedDistricts: data.filters.districts,
                    selectedProjects: data.filters.projects,
                    dateStart: data.filters.dateStart,
                    dateEnd: data.filters.dateEnd,
                    buildingType: data.filters.buildingType,
                    analysisDataCache: data.analysisData
                });
                
                // 渲染篩選器 UI
                populateCountyOptions([data.filters.county]);
                dom.countySelect.value = data.filters.county;
                // 這裡可以根據需要進一步渲染已選的行政區和建案
                
                // 渲染報告
                renderAllReports(data.analysisData);
            } else {
                alert('無法載入分享的報告內容。');
            }
        } catch (err) {
            console.error('載入分享報告時出錯:', err);
            alert('載入分享報告時發生錯誤，請稍後再試。');
        }
    }
}


/**
 * 應用程式初始化函數
 */
async function init() {
    await checkLoginStatus();
    initializeDatepickers();
    initializeEventListeners();
    await checkForSharedReport();
    
    // 只有在沒有載入分享報告時才去抓取縣市列表
    if (!new URLSearchParams(window.location.search).has('report')) {
        const { data: counties, error } = await supabase.rpc('get_unique_counties');
        if (error) {
            console.error('無法獲取縣市列表:', error);
            return;
        }
        populateCountyOptions(counties.map(c => c.county));
    }
}

// 當 DOM 完全載入後執行初始化
document.addEventListener('DOMContentLoaded', init);
