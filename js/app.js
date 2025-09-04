// supabase_project/js/app.js

import { setupAuthentication } from './modules/auth.js';
import { initializeFilters, getAppliedFilters, applyStateToFilters, updateUIForSharedReport } from './modules/ui.js';
import { renderTable, clearTable, renderPaginationControls } from './modules/renderers/tables.js';
import { showLoader, hideLoader, showMessage, clearMessage, setActiveTab, showTabs, hideTabs, setButtonLoading, resetButtonLoading } from './modules/renderers/uiComponents.js';
import { queryData, analyzeData, fetchSubTableData } from './modules/api.js';
import { setupEventListeners } from './modules/eventHandlers.js';
import { getReportState, setReportState, clearReportState } from './modules/state.js';
import { renderAllReports } from './modules/renderers/reports.js';
import { handleShare, checkSharedUrl } from './modules/sharing.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 初始UI設定
    hideTabs();
    
    // 處理分享連結
    const isShared = await checkSharedUrl();
    if (isShared) {
        // 如果是分享連結，UI和篩選器會有特殊處理
    } else {
        // 一般初始化流程
        await initializeFilters();
        setupEventListeners(handleQuery, handleAnalyze, handleShare);
        setupAuthentication();
    }
});

async function handleQuery(page = 1) {
    clearMessage();
    showLoader('data-list-content');
    showTabs();
    setActiveTab('data-list');

    const filters = getAppliedFilters();
    if (!filters.county || !filters.dateStart || !filters.dateEnd) {
        showMessage('請至少選擇縣市及設定完整的日期範圍。', 'error', 'data-list-content');
        hideLoader('data-list-content');
        return;
    }
    
    setReportState(null);

    try {
        const pageSize = 50;
        const result = await queryData(filters, page, pageSize);
        
        hideLoader('data-list-content');

        if (result && result.data && result.data.length > 0) {
            renderTable(result.data, page, pageSize, result.count, handleQuery, fetchSubTableData);
            renderPaginationControls('pagination-controls', page, pageSize, result.count, handleQuery);
        } else {
            showMessage('查無符合條件的資料。', 'info', 'data-list-content');
            clearTable();
        }
    } catch (error) {
        console.error('Query Error:', error);
        showMessage(`查詢時發生錯誤: ${error.message}`, 'error', 'data-list-content');
        hideLoader('data-list-content');
    }
}

// ▼▼▼ 【修改處】 handleAnalyze 函式 ▼▼▼
async function handleAnalyze(isFromToggle = false) {
    // 如果不是由 toggle 觸發，就清除舊報告狀態
    if (!isFromToggle) {
        clearReportState();
    }
    
    clearMessage();
    const analyzeBtn = document.getElementById('analyze-btn');
    setButtonLoading(analyzeBtn);

    // 如果不是由 toggle 觸發，則顯示載入動畫並切換 tab
    if (!isFromToggle) {
        showLoader('ranking-report-content'); // 預設在第一個tab顯示
        showTabs();
        setActiveTab('ranking-report');
    }

    const filters = getAppliedFilters();
    // 新增：讀取 toggle switch 的狀態
    const residentialOnly = document.getElementById('toggle-residential-only').checked;
    
    if (!filters.county || !filters.dateStart || !filters.dateEnd) {
        showMessage('請至少選擇縣市及設定完整的日期範圍以進行分析。', 'error');
        hideLoader();
        resetButtonLoading(analyzeBtn, '分析報表');
        return;
    }

    try {
        // 將 residentialOnly 參數加入 API 請求
        const analysisResults = await analyzeData({ ...filters, residentialOnly });
        
        hideLoader(); // 隱藏所有 loader
        
        if (analysisResults && !analysisResults.message) {
            setReportState(analysisResults); // 保存報告結果
            renderAllReports(analysisResults);
        } else {
            // 如果後端回傳 "No data found"，顯示一個統一的訊息
            const message = analysisResults.message || '查無符合分析條件的資料。';
            showMessage(message, 'info');
            // 隱藏所有報告內容區塊
            document.querySelectorAll('.tab-content').forEach(el => {
                if(el.id !== 'message-area') el.innerHTML = '';
            });
        }
    } catch (error) {
        console.error('Analysis Error:', error);
        showMessage(`分析時發生錯誤: ${error.message}`, 'error');
        hideLoader();
    } finally {
        resetButtonLoading(analyzeBtn, '分析報表');
    }
}
// ▲▲▲ 【修改結束】 ▲▲▲

// ▼▼▼ 【修改處】新增 Toggle Switch 的事件監聽 ▼▼▼
// 確保 DOM 完全載入後再綁定事件
window.addEventListener('load', () => {
    const residentialToggle = document.getElementById('toggle-residential-only');
    if (residentialToggle) {
        residentialToggle.addEventListener('change', () => {
            // 檢查當前是否有報告結果，如果有，就重新觸發分析
            if (getReportState()) {
                handleAnalyze(true); // 傳入 true 標記為由 toggle 觸發
            }
        });
    }
});
// ▲▲▲ 【修改結束】 ▲▲▲

// 全局加載狀態處理
window.addEventListener('load', () => {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
});

export { handleAnalyze, handleQuery, applyStateToFilters, updateUIForSharedReport };
