// js/modules/renderers/charts.js

import { dom } from '../dom.js';
import { state } from '../state.js';
import { renderHeatmapDetailsTable } from './tables.js';
import { THEME_COLORS } from '../config.js';

// --- 全局圖表實例 ---
let salesVelocityChartInstance = null;
let priceBandChartInstance = null;
let rankingChartInstance = null;

/**
 * 根據當前排序的指標，動態渲染核心指標與排名的圖表。
 * @description 如果指標是關於總量（總價、面積、筆數），則顯示 Treemap (方塊圖)。
 * 如果指標是關於價格（均價、高低價、中位數），則顯示 Bar Chart (長條圖)。
 */
export function renderRankingChart() {
    if (rankingChartInstance) {
        rankingChartInstance.destroy();
        rankingChartInstance = null;
    }

    if (!state.analysisDataCache || !state.analysisDataCache.projectRanking || state.analysisDataCache.projectRanking.length === 0) {
        dom.rankingChartContainer.innerHTML = '<p class="text-gray-500 p-4 text-center">無排名資料可繪製圖表。</p>';
        return;
    }

    const { projectRanking } = state.analysisDataCache;
    const sortKey = state.currentSort.key;

    // 定義哪些指標應使用長條圖
    const barChartKeys = ['averagePrice', 'minPrice', 'maxPrice', 'medianPrice', 'avgParkingPrice'];
    const isBarChart = barChartKeys.includes(sortKey);

    let options;

    if (isBarChart) {
        // --- 長條圖設定 ---
        const chartConfig = {
            averagePrice: { title: '建案平均單價排行 (Top 20)', unit: '萬/坪', yLabel: '平均單價' },
            minPrice: { title: '建案最低單價排行 (Top 20)', unit: '萬/坪', yLabel: '最低單價' },
            maxPrice: { title: '建案最高單價排行 (Top 20)', unit: '萬/坪', yLabel: '最高單價' },
            medianPrice: { title: '建案單價中位數排行 (Top 20)', unit: '萬/坪', yLabel: '單價中位數' },
            avgParkingPrice: { title: '建案車位平均單價排行 (Top 20)', unit: '萬', yLabel: '車位均價' }
        }[sortKey];

        const sortedRanking = [...projectRanking]
            .filter(p => p[sortKey] != null && p[sortKey] > 0)
            .sort((a, b) => (b[sortKey] || 0) - (a[sortKey] || 0));
        
        const chartData = sortedRanking.slice(0, 20).reverse();

        options = {
            series: [{
                name: chartConfig.yLabel,
                data: chartData.map(p => parseFloat(p[sortKey].toFixed(2)))
            }],
            chart: {
                type: 'bar',
                height: 600,
                background: 'transparent',
                toolbar: { show: true },
                foreColor: THEME_COLORS['text-light']
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    borderRadius: 2,
                }
            },
            dataLabels: {
                enabled: true,
                textAnchor: 'start',
                style: {
                    colors: [THEME_COLORS['text-light']]
                },
                formatter: function(val) {
                    return val.toLocaleString(undefined, {maximumFractionDigits: 2});
                },
                offsetX: 10,
                dropShadow: {
                  enabled: true,
                  top: 1, left: 1, blur: 1, color: '#000', opacity: 0.6
                }
            },
            xaxis: {
                categories: chartData.map(p => p.projectName),
                title: {
                    text: chartConfig.unit,
                    style: { color: THEME_COLORS['text-dark'] }
                },
                labels: {
                    style: { colors: THEME_COLORS['text-dark'] }
                }
            },
            yaxis: {
                // ▼▼▼ 【最終根本修正】 ▼▼▼
                labels: {
                    style: { 
                        colors: THEME_COLORS['text-dark'], 
                        fontSize: '12px',
                        fontFamily: 'Noto Sans TC, sans-serif'
                    },
                    // 1. 強制為 Y 軸標籤保留一個寬闊的固定區域
                    minWidth: 150, 
                    maxWidth: 200,

                    // 2. 讓文字在保留區內靠右對齊，創造出與圖表間的視覺間隔
                    align: 'right', 

                    // 3. 微調文字位置，讓它更置中好看
                    offsetX: -10
                }
                // ▲▲▲ 【修正結束】 ▲▲▲
            },
            title: {
                text: chartConfig.title,
                align: 'center',
                style: { fontSize: '16px', color: THEME_COLORS['text-light'] }
            },
            tooltip: {
                theme: 'dark',
                y: {
                    title: { formatter: (seriesName) => seriesName + ':' },
                    formatter: function(val) {
                      return `${val.toLocaleString(undefined, {maximumFractionDigits: 2})} ${chartConfig.unit}`;
                    }
                }
            },
            grid: {
                borderColor: '#374151',
                xaxis: { lines: { show: true } },
                yaxis: { lines: { show: false } },
                // ▼▼▼ 移除之前錯誤的 padding 設置，回到正常的內邊距 ▼▼▼
                padding: {
                    left: 20,
                    right: 40 // 也給右側一點空間，避免數字標籤被截斷
                }
            },
            noData: { text: '無資料可顯示' }
        };

    } else {
        // --- 方塊圖 (Treemap) 設定 ---
        const chartConfig = {
            saleAmountSum: { title: '建案銷售總額佔比', unit: '萬', yLabel: '銷售總額' },
            houseAreaSum: { title: '建案房屋面積佔比', unit: '坪', yLabel: '房屋面積' },
            transactionCount: { title: '建案交易筆數佔比', unit: '筆', yLabel: '資料筆數' }
        }[sortKey] || { title: '建案銷售總額佔比', unit: '萬', yLabel: '銷售總額' };

        const totalValue = projectRanking.reduce((sum, p) => sum + (p[sortKey] || 0), 0);
        const seriesData = projectRanking.map(p => ({
            x: p.projectName,
            y: Math.round(p[sortKey] * 100) / 100
        }));

        options = {
            series: [{ name: chartConfig.yLabel, data: seriesData }],
            chart: {
                type: 'treemap',
                height: 450,
                background: 'transparent',
                toolbar: { show: true, tools: { download: true, selection: false, zoom: false, zoomin: false, zoomout: false, pan: false, reset: false }},
                foreColor: THEME_COLORS['text-light']
            },
            title: {
                text: chartConfig.title,
                align: 'center',
                style: { fontSize: '16px', color: THEME_COLORS['text-light'] }
            },
            plotOptions: {
                treemap: {
                    distributed: true,
                    enableShades: false,
                    colorScale: {
                        ranges: [
                            { from: 0, to: totalValue * 0.1, color: THEME_COLORS['cyan-accent'] },
                            { from: totalValue * 0.1, to: totalValue * 0.3, color: '#4f91f7' },
                            { from: totalValue * 0.3, to: totalValue * 0.6, color: '#7c3aed' },
                            { from: totalValue * 0.6, to: Infinity, color: THEME_COLORS['purple-accent'] }
                        ]
                    }
                }
            },
            tooltip: {
                theme: 'dark',
                y: {
                    formatter: function(value) {
                        const percentage = totalValue > 0 ? ((value / totalValue) * 100).toFixed(2) : 0;
                        const formattedValue = value.toLocaleString(undefined, { maximumFractionDigits: 2 });
                        return `${formattedValue} ${chartConfig.unit} (${percentage}%)`;
                    },
                    title: { formatter: (seriesName) => seriesName + ':' }
                }
            },
            noData: { text: '無資料可顯示' }
        };
    }

    rankingChartInstance = new ApexCharts(dom.rankingChartContainer, options);
    rankingChartInstance.render();
}


/**
 * 渲染總價帶分佈箱型圖
 */
export function renderPriceBandChart() {
    if (priceBandChartInstance) {
        priceBandChartInstance.destroy();
        priceBandChartInstance = null;
    }

    if (!state.analysisDataCache || !state.analysisDataCache.priceBandAnalysis || state.analysisDataCache.priceBandAnalysis.length === 0) {
        dom.priceBandChart.innerHTML = '<p class="text-gray-500 p-4 text-center">無總價帶資料可繪製圖表。</p>';
        return;
    }

    const { priceBandAnalysis } = state.analysisDataCache;

    const filteredAnalysis = priceBandAnalysis.filter(item => state.selectedPriceBandRoomTypes.includes(item.roomType));
    
    if (filteredAnalysis.length === 0) {
        dom.priceBandChart.innerHTML = '<p class="text-gray-500 p-4 text-center">請選擇房型以生成圖表。</p>';
        return;
    }

    const seriesData = filteredAnalysis.map(item => ({
        x: item.bathrooms !== null ? `${item.roomType}-${item.bathrooms}衛` : item.roomType,
        y: [
            Math.round(item.minPrice),
            Math.round(item.q1Price),
            Math.round(item.medianPrice),
            Math.round(item.q3Price),
            Math.round(item.maxPrice)
        ]
    }));
    
    const options = {
        series: [{
            name: '總價分佈',
            type: 'boxPlot',
            data: seriesData
        }],
        chart: {
            type: 'boxPlot',
            height: 450,
            background: 'transparent',
            toolbar: { show: true },
            foreColor: '#e5e7eb'
        },
        title: {
            text: '各房型總價帶分佈箱型圖',
            align: 'center',
            style: {
                fontSize: '16px',
                color: '#e5e7eb'
            }
        },
        plotOptions: {
            boxPlot: {
                colors: {
                    upper: '#06b6d4',
                    lower: '#8b5cf6'
                }
            }
        },
        stroke: {
            show: true,
            width: 1,
            colors: ['#9ca3af']
        },
        xaxis: {
            type: 'category',
            labels: {
                style: {
                    colors: '#9ca3af'
                },
                rotate: -45,
                offsetY: 5,
            },
            categories: seriesData.map(d => d.x).sort()
        },
        yaxis: {
            title: {
                text: '房屋總價 (萬)',
                style: {
                    color: '#9ca3af'
                }
            },
            labels: {
                formatter: function (val) {
                    return val.toLocaleString() + " 萬";
                },
                style: {
                    colors: '#9ca3af'
                }
            }
        },
        tooltip: {
            theme: 'dark',
            y: {
                formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
                    const stats = w.globals.series[seriesIndex][dataPointIndex];
                    if (Array.isArray(stats) && stats.length === 5) {
                        return `
                            <div>最高: ${stats[4].toLocaleString()} 萬</div>
                            <div>Q3: ${stats[3].toLocaleString()} 萬</div>
                            <div>中位數: ${stats[2].toLocaleString()} 萬</div>
                            <div>Q1: ${stats[1].toLocaleString()} 萬</div>
                            <div>最低: ${stats[0].toLocaleString()} 萬</div>
                        `;
                    }
                    return value;
                }
            }
        },
        grid: {
            borderColor: '#374151'
        }
    };
    
    if (seriesData.length > 0) {
        const allPrices = seriesData.flatMap(d => d.y);
        const overallMin = Math.min(...allPrices);
        const overallMax = Math.max(...allPrices);

        const range = overallMax - overallMin;
        const padding = range === 0 ? Math.max(overallMin * 0.1, 100) : range * 0.1; 
        
        let paddedMin = overallMin - padding;
        let paddedMax = overallMax + padding;

        options.yaxis.min = Math.max(0, paddedMin);
        options.yaxis.max = paddedMax;
    }

    priceBandChartInstance = new ApexCharts(dom.priceBandChart, options);
    priceBandChartInstance.render();
}


/**
 * 渲染銷售速度趨勢圖
 */
export function renderSalesVelocityChart() {
    if (salesVelocityChartInstance) {
        salesVelocityChartInstance.destroy();
        salesVelocityChartInstance = null;
    }
    
    if (!state.analysisDataCache || !state.analysisDataCache.salesVelocityAnalysis || state.selectedVelocityRooms.length === 0) {
        dom.salesVelocityChart.innerHTML = '<p class="text-gray-500 p-4 text-center">請先選擇房型以生成趨勢圖。</p>';
        return;
    }
    
    const view = state.currentVelocityView;
    const dataForView = state.analysisDataCache.salesVelocityAnalysis[view] || {};
    const timeKeys = Object.keys(dataForView).sort();

    if (timeKeys.length === 0) {
        dom.salesVelocityChart.innerHTML = '<p class="text-gray-500 p-4 text-center">在此條件下無銷售趨勢資料。</p>';
        return;
    }
    
    const series = state.selectedVelocityRooms.map(roomType => {
        return {
            name: roomType,
            data: timeKeys.map(timeKey => dataForView[timeKey][roomType]?.count || 0)
        };
    });

    const options = {
        series: series,
        chart: {
            type: 'line',
            height: 350,
            background: 'transparent',
            toolbar: { show: true },
            foreColor: '#e5e7eb',
            zoom: { enabled: false }
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        dataLabels: {
            enabled: false
        },
        markers: {
            size: 4,
            hover: {
                size: 6
            }
        },
        xaxis: {
            categories: timeKeys,
            labels: {
                style: {
                    colors: '#9ca3af'
                }
            }
        },
        yaxis: {
            title: {
                text: '交易筆數',
                style: {
                    color: '#9ca3af'
                }
            },
            labels: {
                style: {
                    colors: '#9ca3af'
                }
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            offsetY: -5
        },
        tooltip: {
            theme: 'dark'
        },
        grid: {
            borderColor: '#374151'
        },
        noData: {
            text: '載入中或無資料...',
            align: 'center',
            verticalAlign: 'middle',
            style: {
                color: '#9ca3af',
                fontSize: '14px',
            }
        }
    };

    salesVelocityChartInstance = new ApexCharts(dom.salesVelocityChart, options);
    salesVelocityChartInstance.render();
}


/**
 * 動態生成熱力圖的顏色區間
 */
function generateColorRanges(maxValue) {
    const palette = ['#fef9c3', '#fef08a', '#fde047', '#facc15', '#fbbf24', '#f97316', '#ea580c', '#dc2626', '#b91c1c'];
    const ranges = [{
        from: 0, to: 0, color: '#252836', name: '0 戶'
    }];

    if (maxValue <= 0) return ranges;

    const steps = [3, 5, 10, 20, 35, 50, 100, 200];
    let lastStep = 0;

    for (let i = 0; i < steps.length; i++) {
        const from = lastStep + 1;
        const to = steps[i];
        if (from > maxValue) break;

        const effectiveTo = Math.min(to, maxValue);
        const labelName = from === effectiveTo ? `${from} 戶` : `戶數: ${from}-${effectiveTo}`;

        ranges.push({
            from: from,
            to: effectiveTo + 0.9,
            color: palette[i],
            name: labelName
        });
        lastStep = effectiveTo;
    }

    if (maxValue > lastStep) {
        ranges.push({
            from: lastStep + 1,
            to: maxValue,
            color: palette[palette.length - 1],
            name: `> ${lastStep} 戶`
        });
    }

    return ranges;
}


export function renderAreaHeatmap() {
    if (state.areaHeatmapChart) {
        state.areaHeatmapChart.destroy();
        state.areaHeatmapChart = null;
    }
    if (!state.analysisDataCache || !state.analysisDataCache.areaDistributionAnalysis) {
        dom.areaHeatmapChart.innerHTML = '<p class="text-gray-500 p-4 text-center">無面積分佈資料可供分析。</p>';
        return;
    }

    const distributionData = state.analysisDataCache.areaDistributionAnalysis;
    const interval = parseFloat(dom.heatmapIntervalInput.value);
    const userMinArea = parseFloat(dom.heatmapMinAreaInput.value);
    const userMaxArea = parseFloat(dom.heatmapMaxAreaInput.value);

    let allAreas = [];
    state.selectedVelocityRooms.forEach(roomType => {
        if (distributionData[roomType]) {
            const filteredAreas = distributionData[roomType].filter(area => area >= userMinArea && area <= userMaxArea);
            allAreas.push(...filteredAreas);
        }
    });

    if (allAreas.length === 0 || isNaN(interval) || interval <= 0 || isNaN(userMinArea) || isNaN(userMaxArea) || userMinArea >= userMaxArea) {
        dom.areaHeatmapChart.innerHTML = '<p class="text-gray-500 p-4 text-center">在此面積範圍內無資料，或範圍/級距設定無效。</p>';
        return;
    }

    const yAxisCategories = [];
    for (let i = userMinArea; i < userMaxArea; i += interval) {
        yAxisCategories.push(`${i.toFixed(1)}-${(i + interval).toFixed(1)}`);
    }

    let maxValue = 0;
    const seriesData = yAxisCategories.map(category => {
        const [lower, upper] = category.split('-').map(parseFloat);
        const dataPoints = state.selectedVelocityRooms.map(roomType => {
            const roomData = distributionData[roomType] || [];
            const count = roomData.filter(area => area >= lower && area < upper && area >= userMinArea && area <= userMaxArea).length;
            if (count > maxValue) {
                maxValue = count;
            }
            return count;
        });
        return {
            name: category,
            data: dataPoints
        };
    });

    const colorRanges = generateColorRanges(maxValue);

    const dynamicHeight = Math.max(400, yAxisCategories.length * 22);

    const options = {
        series: seriesData,
        chart: {
            height: dynamicHeight,
            type: 'heatmap',
            background: 'transparent',
            toolbar: { show: true, tools: { download: true } },
            foreColor: '#e5e7eb',
            events: {
                dataPointSelection: (event, chartContext, config) => {
                    const { seriesIndex, dataPointIndex } = config;
                    if (seriesIndex < 0 || dataPointIndex < 0) return;

                    const areaRange = config.w.globals.seriesNames[seriesIndex];
                    const roomType = state.selectedVelocityRooms[dataPointIndex];
                    const [lower, upper] = areaRange.split('-').map(parseFloat);

                    const getRoomCategory = (record) => {
                        const buildingType = record['建物型態'] || '';
                        const mainPurpose = record['主要用途'] || '';
                        const rooms = record['房數'];
                        const houseArea = record['房屋面積(坪)'];

                        if (buildingType.includes('店舖') || buildingType.includes('店面')) return '店舖';
                        if (buildingType.includes('工廠') || buildingType.includes('倉庫') || buildingType.includes('廠辦')) return '廠辦/工廠';
                        if (mainPurpose.includes('商業') || buildingType.includes('辦公') || buildingType.includes('事務所')) return '辦公/事務所';

                        const isResidentialBuilding = buildingType.includes('住宅大樓') || buildingType.includes('華廈');
                        if (isResidentialBuilding && rooms === 0) {
                            if (houseArea > 35) return '毛胚';
                            if (houseArea <= 35) return '套房';
                        }

                        if (typeof rooms === 'number' && !isNaN(rooms)) {
                            if (rooms === 1) return '1房';
                            if (rooms === 2) return '2房';
                            if (rooms === 3) return '3房';
                            if (rooms === 4) return '4房';
                            if (rooms >= 5) return '5房以上';
                        }
                        
                        return '其他'; 
                    };

                    const matchingTransactions = state.analysisDataCache.transactionDetails.filter(tx => {
                        const txRoomType = getRoomCategory(tx);
                        const txArea = tx['房屋面積(坪)'];
                        return txRoomType === roomType && txArea >= lower && txArea < upper;
                    });

                    const groupedByProject = matchingTransactions.reduce((acc, tx) => {
                        const projectName = tx['建案名稱'];
                        if (!acc[projectName]) {
                            acc[projectName] = { transactions: [] };
                        }
                        acc[projectName].transactions.push(tx);
                        return acc;
                    }, {});

                    const details = Object.entries(groupedByProject).map(([projectName, data]) => {
                        const txs = data.transactions;
                        const prices = txs.map(t => t['房屋總價(萬)']).filter(p => typeof p === 'number').sort((a, b) => a - b);
                        const unitPrices = txs.map(t => t['房屋單價(萬)']).filter(p => typeof p === 'number').sort((a, b) => a - b);
                        
                        const safeDivide = (a, b) => b > 0 ? a / b : 0;

                        const medianPrice = prices.length > 0 ? (prices.length % 2 === 0 ? (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2 : prices[Math.floor(prices.length / 2)]) : 0;
                        const medianUnitPrice = unitPrices.length > 0 ? (unitPrices.length % 2 === 0 ? (unitPrices[unitPrices.length / 2 - 1] + unitPrices[unitPrices.length / 2]) / 2 : unitPrices[Math.floor(unitPrices.length / 2)]) : 0;
                        
                        const arithmeticAvgPrice = safeDivide(prices.reduce((s, p) => s + p, 0), prices.length);
                        const arithmeticAvgUnitPrice = safeDivide(unitPrices.reduce((s, p) => s + p, 0), unitPrices.length);

                        const totalHousePrice = txs.reduce((s, t) => s + (t['房屋總價(萬)'] || 0), 0);
                        const totalArea = txs.reduce((s, t) => s + (t['房屋面積(坪)'] || 0), 0);
                        const weightedAvgUnitPrice = safeDivide(totalHousePrice, totalArea);

                        return {
                            projectName: projectName,
                            count: txs.length,
                            priceRange: { min: prices.length > 0 ? prices[0] : 0, max: prices.length > 0 ? prices[prices.length - 1] : 0 },
                            unitPriceRange: { min: unitPrices.length > 0 ? unitPrices[0] : 0, max: unitPrices.length > 0 ? unitPrices[prices.length - 1] : 0 },
                            metrics: {
                                median: { totalPrice: medianPrice, unitPrice: medianUnitPrice },
                                arithmetic: { totalPrice: arithmeticAvgPrice, unitPrice: arithmeticAvgUnitPrice },
                                weighted: { totalPrice: arithmeticAvgPrice, unitPrice: weightedAvgUnitPrice }
                            }
                        };
                    }).sort((a, b) => b.count - a.count);
                    
                    state.lastHeatmapDetails = { details, roomType, areaRange };
                    renderHeatmapDetailsTable();
                }
            }
        },
        plotOptions: {
            heatmap: {
                radius: 0,
                useFillColorAsStroke: true,
                enableShades: false,
                colorScale: {
                    ranges: colorRanges
                }
            }
        },
        dataLabels: {
            enabled: true,
            dropShadow: {
                enabled: true,
                top: 1,
                left: 1,
                blur: 1,
                color: '#000',
                opacity: 0.6
            },
            style: {
                colors: [function({ value }) {
                    if (value === 0) {
                        return 'transparent';
                    }
                    return '#e5e7eb';
                }]
            },
            formatter: function(val) {
                if (val === 0) {
                    return '';
                }
                return val;
            }
        },
        xaxis: {
            type: 'category',
            categories: state.selectedVelocityRooms,
            labels: {
                rotate: 0,
            }
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: '12px',
                },
                formatter: (value) => {
                    if (typeof value === 'string' && value.includes('-')) {
                        const parts = value.split('-');
                        return `${parseFloat(parts[0]).toFixed(1)}-${parseFloat(parts[1]).toFixed(1)}`;
                    }
                    return value;
                }
            }
        },
        title: {
            text: '房型面積分佈熱力圖',
            align: 'center',
            style: { color: '#e5e7eb', fontSize: '16px' }
        },
        tooltip: {
            theme: 'dark',
            y: {
                formatter: (val) => {
                    if (val === 0) return '無成交紀錄';
                    return `${val} 戶`;
                }
            }
        },
        grid: {
            borderColor: '#374151'
        },
    };

    state.areaHeatmapChart = new ApexCharts(dom.areaHeatmapChart, options);
    state.areaHeatmapChart.render();
}
}
