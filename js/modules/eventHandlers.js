// js/modules/eventHandlers.js

import { dom } from './dom.js';
import { state } from './state.js';
import { supabase } from '../supabase-client.js';
import { fetchDistricts, fetchProjectNames, handleQuery, clearAllFilters } from './ui.js';
import { renderRankingChart, renderPriceBandChart, renderSalesVelocityChart, renderAreaHeatmap } from './renderers/charts.js';
import { renderPriceBandTable, renderSalesVelocityTable } from './renderers/tables.js';
import { generateAndShareReport } from './api.js';

/**
 * 處理登出邏輯
 */
async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('登出失敗:', error);
        alert('登出時發生錯誤，請稍後再試。');
    } else {
        // 清除 session 後重定向到登入頁面
        window.location.href = '/login.html';
    }
}

/**
 * 處理總價帶房型篩選器變更
 * @param {Event} event - 點擊事件對象
 */
function handlePriceBandFilterChange(event) {
    const button = event.target.closest('.capsule-btn');
    if (!button) return;

    const roomType = button.dataset.roomType;
    button.classList.toggle('active');

    const isActive = button.classList.contains('active');
    if (isActive) {
        state.selectedPriceBandRoomTypes.push(roomType);
    } else {
        state.selectedPriceBandRoomTypes = state.selectedPriceBandRoomTypes.filter(rt => rt !== roomType);
    }

    renderPriceBandChart();
    renderPriceBandTable();
}


/**
 * 處理銷售速度房型篩選器變更
 */
function handleSalesVelocityFilterChange(event) {
    const button = event.target.closest('.capsule-btn');
    if (!button) return;

    const roomType = button.dataset.roomType;
    button.classList.toggle('active');

    const isActive = button.classList.contains('active');
    if (isActive) {
        state.selectedVelocityRooms.push(roomType);
    } else {
        state.selectedVelocityRooms = state.selectedVelocityRooms.filter(rt => rt !== roomType);
    }
    
    renderSalesVelocityChart();
    renderSalesVelocityTable();
    renderAreaHeatmap(); // 同步更新熱力圖
}

/**
 * 處理銷售速度時間視圖切換
 * @param {string} view - 'monthly', 'quarterly', or 'yearly'
 */
function handleVelocityViewChange(view) {
    state.currentVelocityView = view;
    // 更新按鈕的 active 狀態
    dom.salesVelocityViewToggle.querySelectorAll('button').forEach(btn => {
        if (btn.dataset.view === view) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    renderSalesVelocityChart();
    renderSalesVelocityTable();
}


/**
 * 初始化所有事件監聽器
 */
export function initializeEventHandlers() {
    // --- 身份驗證 ---
    dom.logoutButton.addEventListener('click', handleLogout);
    dom.mobileLogoutButton.addEventListener('click', handleLogout);

    // --- 手機版選單 ---
    dom.mobileMenuButton.addEventListener('click', () => {
        const isExpanded = dom.mobileMenuButton.getAttribute('aria-expanded') === 'true';
        dom.mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        dom.mobileMenu.style.display = isExpanded ? 'none' : 'block';
    });

    // --- 查詢表單 ---
    dom.countySelect.addEventListener('change', fetchDistricts);
    dom.districtSelect.addEventListener('change', fetchProjectNames);
    dom.queryForm.addEventListener('submit', event => {
        event.preventDefault();
        handleQuery();
    });
    dom.clearFiltersButton.addEventListener('click', clearAllFilters);
    
    // --- 總價帶篩選器 (事件委派) ---
    dom.priceBandRoomTypeFilter.addEventListener('click', handlePriceBandFilterChange);

    // --- 銷售速度篩選器 (事件委派) ---
    dom.salesVelocityRoomTypeFilter.addEventListener('click', handleSalesVelocityFilterChange);
    dom.salesVelocityViewToggle.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (button && button.dataset.view) {
            handleVelocityViewChange(button.dataset.view);
        }
    });

    // --- 面積分佈 (熱力圖) ---
    dom.heatmapUpdateButton.addEventListener('click', renderAreaHeatmap);
    // 使用事件委派處理熱力圖房型篩選
    dom.heatmapRoomTypeFilter.addEventListener('click', (event) => {
        const button = event.target.closest('.capsule-btn');
        if (!button) return;

        const roomType = button.dataset.roomType;
        button.classList.toggle('active');

        const isActive = button.classList.contains('active');
        
        // 找到銷售速度區塊對應的按鈕並同步其狀態
        const correspondingButton = dom.salesVelocityRoomTypeFilter.querySelector(`[data-room-type="${roomType}"]`);
        if (correspondingButton) {
            if (isActive) {
                correspondingButton.classList.add('active');
                 if (!state.selectedVelocityRooms.includes(roomType)) {
                    state.selectedVelocityRooms.push(roomType);
                }
            } else {
                correspondingButton.classList.remove('active');
                state.selectedVelocityRooms = state.selectedVelocityRooms.filter(rt => rt !== roomType);
            }
        }
        
        // 直接調用 renderAreaHeatmap 來更新圖表，因為它會從 state.selectedVelocityRooms 讀取最新的篩選條件
        renderAreaHeatmap();
        renderSalesVelocityChart(); // 同步更新銷售速度圖
        renderSalesVelocityTable(); // 同步更新銷售速度表
    });


    // --- 報告操作 ---
    dom.shareReportButton.addEventListener('click', generateAndShareReport);
    
    // --- 分享彈窗 ---
    const shareModal = new Modal(dom.shareModal);
    dom.shareReportButton.addEventListener('click', () => shareModal.show());
    dom.closeShareModalButton.addEventListener('click', () => shareModal.hide());
    dom.copyShareLinkButton.addEventListener('click', () => {
        navigator.clipboard.writeText(dom.shareLinkInput.value).then(() => {
            dom.copyFeedback.classList.remove('hidden');
            setTimeout(() => dom.copyFeedback.classList.add('hidden'), 2000);
        });
    });
}
