// js/modules/renderers/reports.js

import { dom } from '../dom.js';
import * as chartRenderer from './charts.js';
import * as tableRenderer from './tables.js';
import * as uiComponentRenderer from './uiComponents.js';
import { state } from '../state.js';
import { renderHorizontalPriceGrid } from './heatmap.js';

/**
 * 渲染所有分析報告
 * @param {object} analysisData - The complete analysis data object.
 */
export function renderAllReports(analysisData) {
    if (!analysisData) {
        dom.messageArea.textContent = '分析失敗或沒有返回資料。';
        return;
    }

    // 渲染各個報告分頁
    renderRankingReport(analysisData);
    renderPriceBandReport(analysisData);
    renderUnitPriceReport(analysisData);
    renderParkingReport(analysisData);
    renderVelocityReport(analysisData);
    renderPriceGridReport(analysisData);

    // 顯示報告內容，隱藏初始訊息
    dom.messageArea.classList.add('hidden');
    dom.tabsContainer.classList.remove('hidden');

    // 預設顯示第一個分頁
    const defaultTab = document.querySelector('.tab-button[data-tab="ranking-report"]');
    if (defaultTab) {
        defaultTab.click();
    }
}

/**
 * 渲染核心指標與排名報告
 * @param {object} analysisData - The analysis data.
 */
export function renderRankingReport(analysisData) {
    const { keyMetrics, projectRanking } = analysisData;

    // 渲染指標卡片
    uiComponentRenderer.renderMetricCards(keyMetrics);

    // 渲染圖表和表格
    if (projectRanking && projectRanking.length > 0) {
        // ▼▼▼ 【已修改此處】 ▼▼▼
        chartRenderer.renderRankingChart(projectRanking, state.currentRankingMetric);
        // ▲▲▲ 【修改結束】 ▲▲▲
        tableRenderer.renderRankingTable(projectRanking);
    } else {
        dom.rankingChartContainer.innerHTML = '<p class="text-gray-500 text-center p-4">沒有建案排名資料可顯示。</p>';
        dom.rankingTable.innerHTML = '';
    }
}

/**
 * 渲染總價帶分析報告
 * @param {object} analysisData - The analysis data.
 */
export function renderPriceBandReport(analysisData) {
    const { priceBandAnalysis, availableRoomTypes } = analysisData;

    if (priceBandAnalysis && availableRoomTypes && availableRoomTypes.priceBand.length > 0) {
        uiComponentRenderer.renderRoomTypeFilter('price-band', availableRoomTypes.priceBand);
        chartRenderer.renderPriceBandChart();
        tableRenderer.renderPriceBandTable();
    } else {
        dom.priceBandReportContent.innerHTML = '<p class="text-gray-500 text-center p-4">沒有總價帶分析資料可顯示。</p>';
    }
}

/**
 * 渲染房屋單價分析報告
 * @param {object} analysisData - The analysis data.
 */
export function renderUnitPriceReport(analysisData) {
    const { unitPriceStats } = analysisData;

    if (unitPriceStats) {
        tableRenderer.renderResidentialStatsTable(unitPriceStats);
        tableRenderer.renderTypeComparisonTable(unitPriceStats);
    } else {
        dom.unitPriceReportContent.innerHTML = '<p class="text-gray-500 text-center p-4">沒有單價分析資料可顯示。</p>';
    }
}

/**
 * 渲染車位單價分析報告
 * @param {object} analysisData - The analysis data.
 */
export function renderParkingReport(analysisData) {
    const { parkingAnalysis } = analysisData;
    if (parkingAnalysis) {
        tableRenderer.renderParkingRatioTable(parkingAnalysis.parkingRatio);
        tableRenderer.renderAvgPriceByTypeTable(parkingAnalysis.avgPriceByType);
        tableRenderer.renderRampPlanePriceByFloorTable(parkingAnalysis.rampPlanePriceByFloor);
    } else {
        dom.parkingReportContent.innerHTML = '<p class="text-gray-500 text-center p-4">沒有車位分析資料可顯示。</p>';
    }
}

/**
 * 渲染房型去化分析報告
 * @param {object} analysisData - The analysis data.
 */
export function renderVelocityReport(analysisData) {
    const { salesVelocityAnalysis, availableRoomTypes, areaDistributionAnalysis } = analysisData;

    if (salesVelocityAnalysis && availableRoomTypes && availableRoomTypes.velocity.length > 0) {
        uiComponentRenderer.renderRoomTypeFilter('velocity', availableRoomTypes.velocity, true); // true表示預設全選
        chartRenderer.renderSalesVelocityChart();
        tableRenderer.renderVelocityTable();
        
        if (areaDistributionAnalysis) {
            chartRenderer.renderAreaHeatmap();
        } else {
            dom.areaHeatmapChart.innerHTML = '<p class="text-gray-500 p-4 text-center">無面積分佈資料可供分析。</p>';
        }

    } else {
        dom.velocityReportContent.innerHTML = '<p class="text-gray-500 text-center p-4">沒有房型去化資料可顯示。</p>';
    }
}

/**
 * 渲染垂直水平分析報告
 * @param {object} analysisData - The analysis data.
 */
export function renderPriceGridReport(analysisData) {
    const { priceGrid, availableProjects } = analysisData;

    if (priceGrid && availableProjects && availableProjects.length > 0) {
        uiComponentRenderer.renderProjectFilter(availableProjects);

        // 檢查是否有選中的建案，如果沒有就選第一個
        if (state.selectedPriceGridProject === null && availableProjects.length > 0) {
            state.selectedPriceGridProject = availableProjects[0];
        }

        const projectData = priceGrid[state.selectedPriceGridProject];
        if (projectData) {
            renderHorizontalPriceGrid(projectData);
        } else {
            dom.horizontalPriceGridContainer.innerHTML = '<p class="text-gray-500 text-center p-4">請先選擇一個建案來查看銷控表。</p>';
        }

    } else {
        dom.priceGridReportContent.innerHTML = '<p class="text-gray-500 text-center p-4">沒有銷控表資料可顯示。</p>';
    }
}
