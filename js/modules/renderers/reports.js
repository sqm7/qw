// js/modules/renderers/reports.js

import { dom } from '../dom.js';
import { state } from '../state.js';
import { renderRankingChart } from './charts.js';
import { renderRankingTable, renderPriceBandTable, renderSalesVelocityTable, clearAllTables, renderHeatmapDetailsTable } from './tables.js';
import { renderPriceBandChart, renderSalesVelocityChart, renderAreaHeatmap } from './charts.js';
import { renderRoomTypeFilters, renderVelocityViewToggle } from './uiComponents.js';

/**
 * 渲染報告的摘要資訊卡片
 * @param {object} summaryData - 包含摘要資訊的物件
 */
function renderSummary(summaryData) {
    const {
        totalProjects,
        totalTransactions,
        totalAmount,
        avgPricePerPing
    } = summaryData;

    dom.reportSummary.innerHTML = `
        <div class="summary-card">
            <h4 class="summary-title">建案總數</h4>
            <p class="summary-value">${totalProjects.toLocaleString()}</p>
        </div>
        <div class="summary-card">
            <h4 class="summary-title">總交易筆數</h4>
            <p class="summary-value">${totalTransactions.toLocaleString()}</p>
        </div>
        <div class="summary-card">
            <h4 class="summary-title">總銷售額 (萬)</h4>
            <p class="summary-value">${Math.round(totalAmount).toLocaleString()}</p>
        </div>
        <div class="summary-card">
            <h4 class="summary-title">平均單價 (萬/坪)</h4>
            <p class="summary-value">${avgPricePerPing.toFixed(2)}</p>
        </div>
    `;
}


/**
 * 渲染整個報告區塊
 * @param {object} analysisData - 從後端獲取的完整分析數據
 */
export function renderReport(analysisData) {
    state.analysisDataCache = analysisData;
    
    // 1. 渲染摘要
    renderSummary(analysisData.summary);

    // 2. 清空舊內容
    clearAllTables();
    dom.heatmapDetailsSection.classList.add('hidden'); // 隱藏熱力圖詳細資料

    // 3. 初始化並渲染各個分析模塊
    // --- 核心指標與排名 ---
    renderRankingChart('saleAmountSum'); // 預設使用銷售總額
    renderRankingTable(analysisData.projectRanking);

    // --- 總價帶分析 ---
    state.availablePriceBandRoomTypes = [...new Set(analysisData.priceBandAnalysis.map(p => p.roomType))].sort();
    state.selectedPriceBandRoomTypes = [...state.availablePriceBandRoomTypes]; // 預設全選
    renderRoomTypeFilters(
        dom.priceBandRoomTypeFilter,
        state.availablePriceBandRoomTypes,
        state.selectedPriceBandRoomTypes,
        'price-band'
    );
    renderPriceBandChart();
    renderPriceBandTable();


    // --- 銷售速度 & 面積分佈 (共用篩選器) ---
    state.availableVelocityRooms = analysisData.salesVelocityAnalysis.availableRoomTypes.sort();
    state.selectedVelocityRooms = [...state.availableVelocityRooms]; // 預設全選
    // 銷售速度的篩選器
    renderRoomTypeFilters(
        dom.salesVelocityRoomTypeFilter,
        state.availableVelocityRooms,
        state.selectedVelocityRooms,
        'sales-velocity'
    );
     // 面積分佈的篩選器
    renderRoomTypeFilters(
        dom.heatmapRoomTypeFilter,
        state.availableVelocityRooms,
        state.selectedVelocityRooms,
        'heatmap'
    );
    renderVelocityViewToggle(dom.salesVelocityViewToggle, state.currentVelocityView);
    renderSalesVelocityChart();
    renderSalesVelocityTable();

    // --- 面積分佈熱力圖 ---
    const allAreas = Object.values(analysisData.areaDistributionAnalysis).flat();
    if (allAreas.length > 0) {
        dom.heatmapMinAreaInput.value = Math.floor(Math.min(...allAreas));
        dom.heatmapMaxAreaInput.value = Math.ceil(Math.max(...allAreas));
    } else {
        dom.heatmapMinAreaInput.value = 10;
        dom.heatmapMaxAreaInput.value = 100;
    }
    renderAreaHeatmap();
    // 清除上一次點擊的詳細資料
    state.lastHeatmapDetails = null; 
    renderHeatmapDetailsTable();


    // 4. 顯示報告區塊
    dom.reportSection.classList.remove('hidden');
    state.isReportVisible = true;

    // 5. 確保預設顯示第一個 tab
    const tabs = new Tabs(
        [
            { id: 'ranking', triggerEl: dom.rankingTab, targetEl: document.getElementById('ranking-content') },
            { id: 'price-band', triggerEl: dom.priceBandTab, targetEl: document.getElementById('price-band-content') },
            { id: 'sales-velocity', triggerEl: dom.salesVelocityTab, targetEl: document.getElementById('sales-velocity-content') },
            { id: 'area-distribution', triggerEl: dom.areaDistributionTab, targetEl: document.getElementById('area-distribution-content') }
        ],
        {
            defaultTabId: 'ranking',
            activeClasses: 'text-cyan-accent border-cyan-accent',
            inactiveClasses: 'text-text-dark border-transparent hover:text-gray-300 hover:border-gray-500',
        }
    );
    tabs.show('ranking');
}
