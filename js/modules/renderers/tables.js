// js/modules/renderers/tables.js

import { dom } from '../dom.js';
import { formatNumber, createPaginationControls, getWeekDateRange } from '../ui.js';
import { getCurrentState } from '../state.js';
import { fetchDataList, handleDataListPagination } from '../../app.js';

export function renderRankingTable(data, analysisData) {
    const container = dom.rankingReportContent.querySelector('#ranking-table-container');
    if (!container) return;
    
    let tableHtml = `
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-700">
                <thead class="bg-gray-800">
                    <tr>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">排名</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">建案名稱</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">總戶數</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">總銷(億)</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">週銷戶數</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">週銷金額(萬)</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">戶去化率</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">錢去化率</th>
                    </tr>
                </thead>
                <tbody class="bg-gray-900 divide-y divide-gray-800">
    `;

    if (data && data.length > 0) {
        data.forEach((item, index) => {
            const projectData = analysisData.projects[item.project_id] || {};
            tableHtml += `
                <tr class="hover:bg-gray-700">
                    <td class="px-4 py-3 whitespace-nowrap">${index + 1}</td>
                    <td class="px-4 py-3 whitespace-nowrap">${item.project_name}</td>
                    <td class="px-4 py-3 whitespace-nowrap">${projectData.total_units || 'N/A'}</td>
                    <td class="px-4 py-3 whitespace-nowrap">${projectData.total_sales_amount_billion !== undefined ? formatNumber(projectData.total_sales_amount_billion, 2) : 'N/A'}</td>
                    <td class="px-4 py-3 whitespace-nowrap">${item.weekly_sales_count}</td>
                    <td class="px-4 py-3 whitespace-nowrap">${formatNumber(item.weekly_sales_amount / 10000, 0)}</td>
                    <td class="px-4 py-3 whitespace-nowrap">${projectData.sales_rate_by_count !== undefined ? (projectData.sales_rate_by_count * 100).toFixed(1) + '%' : 'N/A'}</td>
                    <td class="px-4 py-3 whitespace-nowrap">${projectData.sales_rate_by_amount !== undefined ? (projectData.sales_rate_by_amount * 100).toFixed(1) + '%' : 'N/A'}</td>
                </tr>
            `;
        });
    } else {
        tableHtml += `<tr><td colspan="8" class="text-center py-4">沒有可顯示的資料</td></tr>`;
    }
    
    tableHtml += `
                </tbody>
            </table>
        </div>
    `;
    container.innerHTML = tableHtml;
}

export function renderPriceBandTable(analysisData) {
    const container = document.getElementById('price-band-table');
    if (!container) return;

    if (!analysisData || !analysisData.priceBandAnalysis || !analysisData.priceBandAnalysis.bands) {
        container.innerHTML = '<p class="text-gray-400">沒有可顯示的總價帶分析資料。</p>';
        return;
    }

    const { bands, total } = analysisData.priceBandAnalysis;
    let tableHtml = `
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-700">
                <thead class="bg-gray-800">
                    <tr>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">總價帶 (萬)</th>
                        <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">戶數</th>
                        <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">戶數佔比</th>
                        <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">總銷 (億)</th>
                        <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">總銷佔比</th>
                    </tr>
                </thead>
                <tbody class="bg-gray-900 divide-y divide-gray-800">
    `;
    for (const band in bands) {
        const data = bands[band];
        tableHtml += `
            <tr class="hover:bg-gray-700">
                <td class="px-4 py-3 whitespace-nowrap">${band}</td>
                <td class="px-4 py-3 whitespace-nowrap text-right">${data.count}</td>
                <td class="px-4 py-3 whitespace-nowrap text-right">${formatNumber(data.count_percentage * 100, 1)}%</td>
                <td class="px-4 py-3 whitespace-nowrap text-right">${formatNumber(data.amount / 100000000, 2)}</td>
                <td class="px-4 py-3 whitespace-nowrap text-right">${formatNumber(data.amount_percentage * 100, 1)}%</td>
            </tr>
        `;
    }
    tableHtml += `
            <tr class="bg-gray-800 font-bold">
                <td class="px-4 py-3 whitespace-nowrap">總計</td>
                <td class="px-4 py-3 whitespace-nowrap text-right">${total.count}</td>
                <td class="px-4 py-3 whitespace-nowrap text-right">100.0%</td>
                <td class="px-4 py-3 whitespace-nowrap text-right">${formatNumber(total.amount / 100000000, 2)}</td>
                <td class="px-4 py-3 whitespace-nowrap text-right">100.0%</td>
            </tr>
        </tbody></table></div>`;
    container.innerHTML = tableHtml;
}


export function renderUnitPriceTable(analysisData) {
    const container = document.getElementById('unit-price-table');
    if (!container) return;

    if (!analysisData || !analysisData.unitPriceAnalysis || !analysisData.unitPriceAnalysis.bands) {
        container.innerHTML = '<p class="text-gray-400">沒有可顯示的單價分析資料。</p>';
        return;
    }

    const { bands, total } = analysisData.unitPriceAnalysis;
    let tableHtml = `
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-700">
                <thead class="bg-gray-800">
                    <tr>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">單價帶 (萬)</th>
                        <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">戶數</th>
                        <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">戶數佔比</th>
                        <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">總銷 (億)</th>
                        <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">總銷佔比</th>
                    </tr>
                </thead>
                <tbody class="bg-gray-900 divide-y divide-gray-800">
    `;
    for (const band in bands) {
        const data = bands[band];
        tableHtml += `
            <tr class="hover:bg-gray-700">
                <td class="px-4 py-3 whitespace-nowrap">${band}</td>
                <td class="px-4 py-3 whitespace-nowrap text-right">${data.count}</td>
                <td class="px-4 py-3 whitespace-nowrap text-right">${formatNumber(data.count_percentage * 100, 1)}%</td>
                <td class="px-4 py-3 whitespace-nowrap text-right">${formatNumber(data.amount / 100000000, 2)}</td>
                <td class="px-4 py-3 whitespace-nowrap text-right">${formatNumber(data.amount_percentage * 100, 1)}%</td>
            </tr>
        `;
    }
    tableHtml += `
            <tr class="bg-gray-800 font-bold">
                <td class="px-4 py-3 whitespace-nowrap">總計</td>
                <td class="px-4 py-3 whitespace-nowrap text-right">${total.count}</td>
                <td class="px-4 py-3 whitespace-nowrap text-right">100.0%</td>
                <td class="px-4 py-3 whitespace-nowrap text-right">${formatNumber(total.amount / 100000000, 2)}</td>
                <td class="px-4 py-3 whitespace-nowrap text-right">100.0%</td>
            </tr>
        </tbody></table></div>`;
    container.innerHTML = tableHtml;
}

export function renderVelocityAnalysisTable(analysisData) {
    const container = document.getElementById('velocity-analysis-table-container');
    if (!container) return;

    if (!analysisData || !analysisData.velocityAnalysis || !analysisData.velocityAnalysis.length) {
        container.innerHTML = '<p class="text-gray-400">沒有可顯示的房型去化分析資料。</p>';
        return;
    }

    const weeklyData = analysisData.velocityAnalysis;
    let tableHtml = `
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-700">
                <thead class="bg-gray-800">
                    <tr>
                        <th scope="col" class="sticky left-0 bg-gray-800 z-10 px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">房型</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">週次</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">週銷/戶</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">週銷/億</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">累積/戶</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">累積/億</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">戶去化率</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">錢去化率</th>
                    </tr>
                </thead>
                <tbody class="bg-gray-900 divide-y divide-gray-800">
    `;

    weeklyData.forEach(item => {
        const dateRange = getWeekDateRange(item.week);
        tableHtml += `
            <tr class="hover:bg-gray-700">
                <td class="sticky left-0 bg-gray-900 z-10 px-4 py-3 whitespace-nowrap">${item.unit_type_group}</td>
                <td class="px-4 py-3 whitespace-nowrap" title="${dateRange}">W${item.week.split('-W')[1]}</td>
                <td class="px-4 py-3 whitespace-nowrap">${item.weekly_sales_count}</td>
                <td class="px-4 py-3 whitespace-nowrap">${formatNumber(item.weekly_sales_amount / 100000000, 2)}</td>
                <td class="px-4 py-3 whitespace-nowrap">${item.cumulative_sales_count}</td>
                <td class="px-4 py-3 whitespace-nowrap">${formatNumber(item.cumulative_sales_amount / 100000000, 2)}</td>
                <td class="px-4 py-3 whitespace-nowrap">${(item.sales_rate_by_count * 100).toFixed(1)}%</td>
                <td class="px-4 py-3 whitespace-nowrap">${(item.sales_rate_by_amount * 100).toFixed(1)}%</td>
            </tr>
        `;
    });

    tableHtml += `
                </tbody>
            </table>
        </div>
    `;
    container.innerHTML = tableHtml;
}


export function renderParkingAnalysisTable(analysisData) {
    const container = document.getElementById('parking-analysis-table');
    if (!container) return;

    if (!analysisData || !analysisData.parkingAnalysis) {
        container.innerHTML = '<p class="text-gray-400">沒有可顯示的車位分析資料。</p>';
        return;
    }
    
    const { parkingSales, parkingTypes } = analysisData.parkingAnalysis;
    let tableHtml = `
        <h4 class="text-lg font-semibold text-cyan-300 mb-2">車位銷售狀況</h4>
        <div class="overflow-x-auto mb-6">
            <table class="min-w-full divide-y divide-gray-700">
                <thead class="bg-gray-800">
                    <tr>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"></th>
                        <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">可售</th>
                        <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">已售</th>
                        <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">剩餘</th>
                        <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">去化率</th>
                    </tr>
                </thead>
                <tbody class="bg-gray-900 divide-y divide-gray-800">
                    <tr class="hover:bg-gray-700">
                        <td class="px-4 py-3 whitespace-nowrap font-medium">車位數</td>
                        <td class="px-4 py-3 whitespace-nowrap text-right">${parkingSales.total_parking_spaces}</td>
                        <td class="px-4 py-3 whitespace-nowrap text-right">${parkingSales.sold_parking_spaces}</td>
                        <td class="px-4 py-3 whitespace-nowrap text-right">${parkingSales.remaining_parking_spaces}</td>
                        <td class="px-4 py-3 whitespace-nowrap text-right">${formatNumber(parkingSales.parking_sales_rate * 100, 1)}%</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h4 class="text-lg font-semibold text-cyan-300 mb-2">各類型車位價格與數量</h4>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-700">
                <thead class="bg-gray-800">
                    <tr>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">車位類型</th>
                        <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">數量</th>
                        <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">最低價 (萬)</th>
                        <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">最高價 (萬)</th>
                        <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">平均價 (萬)</th>
                    </tr>
                </thead>
                <tbody class="bg-gray-900 divide-y divide-gray-800">
    `;

    for (const type in parkingTypes) {
        const data = parkingTypes[type];
        tableHtml += `
            <tr class="hover:bg-gray-700">
                <td class="px-4 py-3 whitespace-nowrap">${type}</td>
                <td class="px-4 py-3 whitespace-nowrap text-right">${data.count}</td>
                <td class="px-4 py-3 whitespace-nowrap text-right">${formatNumber(data.min_price / 10000, 0)}</td>
                <td class="px-4 py-3 whitespace-nowrap text-right">${formatNumber(data.max_price / 10000, 0)}</td>
                <td class="px-4 py-3 whitespace-nowrap text-right">${formatNumber(data.avg_price / 10000, 0)}</td>
            </tr>
        `;
    }

    tableHtml += `</tbody></table></div>`;
    container.innerHTML = tableHtml;
}


export function renderPriceGrid(analysisData) {
    const container = document.getElementById('price-grid-table');
    if (!container) return;
    
    if (!analysisData || !analysisData.priceGrid) {
        container.innerHTML = '<p class="text-gray-400">沒有可顯示的價量網格資料。</p>';
        return;
    }

    const { grid, unitPriceLabels, totalPriceLabels, totalCount, totalAmount } = analysisData.priceGrid;
    
    let tableHtml = `
        <p class="text-sm text-gray-400 mb-2">說明：下表顯示不同單價與總價區間的戶數分佈。</p>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-700 border border-gray-700">
                <thead class="bg-gray-800">
                    <tr>
                        <th scope="col" class="px-3 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider border-r border-gray-700">單價(萬) \\ 總價(萬)</th>
    `;
    totalPriceLabels.forEach(label => {
        tableHtml += `<th scope="col" class="px-3 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">${label}</th>`;
    });
    tableHtml += `<th scope="col" class="px-3 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider bg-gray-700">單價區間加總</th></tr></thead>`;

    tableHtml += `<tbody class="bg-gray-900 divide-y divide-gray-800">`;
    grid.forEach((row, i) => {
        tableHtml += `<tr class="hover:bg-gray-700/50">
                        <td class="px-3 py-3 whitespace-nowrap font-medium bg-gray-800 border-r border-gray-700">${unitPriceLabels[i]}</td>`;
        let rowSum = 0;
        row.forEach(cell => {
            rowSum += cell.count;
            const percentage = totalCount > 0 ? (cell.count / totalCount * 100).toFixed(1) : 0;
            const bgColor = cell.count > 0 ? `rgba(6, 182, 212, ${Math.min(0.1 + percentage / 30, 1)})` : '';
            tableHtml += `<td class="px-3 py-3 text-center whitespace-nowrap" style="background-color: ${bgColor}">
                            <div>${cell.count}戶</div>
                            <div class="text-xs text-gray-400">${percentage}%</div>
                          </td>`;
        });
        const rowSumPercentage = totalCount > 0 ? (rowSum / totalCount * 100).toFixed(1) : 0;
        tableHtml += `<td class="px-3 py-3 text-center whitespace-nowrap font-bold bg-gray-700">
                        <div>${rowSum}戶</div>
                        <div class="text-xs text-gray-400">${rowSumPercentage}%</div>
                      </td></tr>`;
    });

    tableHtml += `<tr class="bg-gray-700 font-bold">
                    <td class="px-3 py-3 text-center whitespace-nowrap">總價區間加總</td>`;
    
    const colSums = totalPriceLabels.map((_, colIndex) => grid.reduce((sum, row) => sum + row[colIndex].count, 0));
    
    colSums.forEach(sum => {
        const colSumPercentage = totalCount > 0 ? (sum / totalCount * 100).toFixed(1) : 0;
        tableHtml += `<td class="px-3 py-3 text-center whitespace-nowrap">
                        <div>${sum}戶</div>
                        <div class="text-xs text-gray-400">${colSumPercentage}%</div>
                      </td>`;
    });

    tableHtml += `<td class="px-3 py-3 text-center whitespace-nowrap bg-cyan-800/50">
                    <div>${totalCount}戶</div>
                    <div class="text-xs text-gray-300">100%</div>
                  </td></tr>`;
    
    tableHtml += `</tbody></table></div>`;
    container.innerHTML = tableHtml;
}


export function renderDataListTable(data, totalItems) {
    const { currentPage, pageSize } = getCurrentState();
    
    const tableContainer = document.getElementById('data-list-table');
    const paginationContainer = document.getElementById('data-list-pagination');
    
    if (!tableContainer || !paginationContainer) return;

    let tableHtml = `
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-700">
                <thead class="bg-gray-800">
                    <tr>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">建案名稱</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">縣市</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">行政區</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">地址</th>
                        <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">更新日期</th>
                    </tr>
                </thead>
                <tbody class="bg-gray-900 divide-y divide-gray-800">
    `;

    if (data && data.length > 0) {
        data.forEach(item => {
            tableHtml += `
                <tr class="hover:bg-gray-700">
                    <td class="px-4 py-3 whitespace-nowrap">${item.id}</td>
                    <td class="px-4 py-3 whitespace-nowrap">${item.project_name || 'N/A'}</td>
                    <td class="px-4 py-3 whitespace-nowrap">${item.city || 'N/A'}</td>
                    <td class="px-4 py-3 whitespace-nowrap">${item.district || 'N/A'}</td>
                    <td class="px-4 py-3 whitespace-nowrap">${item.address || 'N/A'}</td>
                    <td class="px-4 py-3 whitespace-nowrap">${item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'N/A'}</td>
                </tr>
            `;
        });
    } else {
        tableHtml += `<tr><td colspan="6" class="text-center py-4">沒有可顯示的資料</td></tr>`;
    }
    
    tableHtml += `</tbody></table></div>`;
    tableContainer.innerHTML = tableHtml;

    createPaginationControls(paginationContainer, totalItems, currentPage, pageSize, handleDataListPagination);
}
