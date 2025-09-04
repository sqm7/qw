// js/modules/renderers/reports.js
import { formatNumber, safeDivide, formatDate, createIcon, formatPercentage } from '../utils.js';
import { createStatCard, createComparisonTable, createParkingTable, createFloorPriceTable, createHorizontalComparisonTable } from './uiComponents.js';

/**
 * 渲染主報表的內容
 * @param {object} analysisResults - 後端回傳的完整分析結果
 * @param {object} parkData - 停車位相關的子資料
 * @param {Map<string, string>} finalUnitIds - 最終的戶號對應 Map
 */
export function renderReport(analysisResults, parkData, finalUnitIds) {
    const reportContainer = document.getElementById('report-container');
    if (!reportContainer) return;
    reportContainer.innerHTML = ''; // 清空舊內容

    // 獲取區塊的 DOM 元素
    const unitPriceSection = document.getElementById('unit-price-analysis-section');
    const parkingSection = document.getElementById('parking-analysis-section');
    const salesVelocitySection = document.getElementById('sales-velocity-section');
    const priceBandSection = document.getElementById('price-band-analysis-section');
    const areaDistributionSection = document.getElementById('area-distribution-section');

    // 清空現有內容
    unitPriceSection.innerHTML = '<h2>房屋單價分析</h2>';
    parkingSection.innerHTML = '<h2>停車位分析</h2>';
    salesVelocitySection.innerHTML = '<h2>銷售速度分析</h2>';
    priceBandSection.innerHTML = '<h2>各房型總價段分佈</h2>';
    areaDistributionSection.innerHTML = '<h2>各房型面積分佈</h2>';

    // 依次渲染各個分析區塊
    if (analysisResults.unitPriceAnalysis) {
        renderUnitPriceAnalysis(unitPriceSection, analysisResults.unitPriceAnalysis);
    }
    if (analysisResults.parkingAnalysis) {
        renderParkingAnalysis(parkingSection, analysisResults.parkingAnalysis);
    }
    if (analysisResults.salesVelocity) {
        renderSalesVelocity(salesVelocitySection, analysisResults.salesVelocity);
    }
    if (analysisResults.priceBandAnalysis) {
        renderPriceBandAnalysis(priceBandSection, analysisResults.priceBandAnalysis);
    }
    if (analysisResults.areaDistribution) {
        renderAreaDistribution(areaDistributionSection, analysisResults.areaDistribution);
    }
}


/**
 * 渲染單價分析區塊
 * @param {HTMLElement} container - 插入內容的容器元素
 * @param {object} unitPriceAnalysis - 單價分析數據
 */
export function renderUnitPriceAnalysis(container, unitPriceAnalysis) {
    const { residentialStats, officeStats, storeStats, typeComparison } = unitPriceAnalysis;

    // --- 創建一個 flex 容器來放置三個統計卡片 ---
    const statsContainer = document.createElement('div');
    statsContainer.className = 'stats-cards-container'; // 新增的 class，用於 CSS flex 排版

    // 1. 住宅單價統計卡片
    if (residentialStats && residentialStats.count > 0) {
        const residentialCard = createStatCard(
            '住宅單價 (住宅大樓/華廈)',
            residentialStats.avgPrice.weighted,
            '萬/坪',
            residentialStats.count,
            {
                '算術平均': residentialStats.avgPrice.arithmetic.toFixed(2),
                '最低價': `${residentialStats.minPrice.toFixed(2)} (${residentialStats.minPriceProject} - ${residentialStats.minPriceUnit || 'N/A'})`,
                '最高價': `${residentialStats.maxPrice.toFixed(2)} (${residentialStats.maxPriceProject} - ${residentialStats.maxPriceUnit || 'N/A'})`,
                'Q1': residentialStats.q1Price.toFixed(2),
                '中位數': residentialStats.medianPrice.toFixed(2),
                'Q3': residentialStats.q3Price.toFixed(2),
            },
            'fa-building'
        );
        statsContainer.appendChild(residentialCard); // 將卡片加入到 flex 容器中
    }

    // 2. 事務所/辦公室單價統計卡片
    if (officeStats && officeStats.count > 0) {
        const officeCard = createStatCard(
            '事務所/辦公室單價',
            officeStats.avgPrice.weighted,
            '萬/坪',
            officeStats.count,
            {
                '算術平均': officeStats.avgPrice.arithmetic.toFixed(2),
                '最低價': `${officeStats.minPrice.toFixed(2)} (${officeStats.minPriceProject} - ${officeStats.minPriceUnit || 'N/A'})`,
                '最高價': `${officeStats.maxPrice.toFixed(2)} (${officeStats.maxPriceProject} - ${officeStats.maxPriceUnit || 'N/A'})`,
                'Q1': officeStats.q1Price.toFixed(2),
                '中位數': officeStats.medianPrice.toFixed(2),
                'Q3': officeStats.q3Price.toFixed(2),
            },
            'fa-briefcase'
        );
        statsContainer.appendChild(officeCard); // 將卡片加入到 flex 容器中
    }

    // 3. 店鋪單價統計卡片
    if (storeStats && storeStats.count > 0) {
        const storeCard = createStatCard(
            '店舖單價',
            storeStats.avgPrice.weighted,
            '萬/坪',
            storeStats.count,
            {
                '算術平均': storeStats.avgPrice.arithmetic.toFixed(2),
                '最低價': `${storeStats.minPrice.toFixed(2)} (${storeStats.minPriceProject} - ${storeStats.minPriceUnit || 'N/A'})`,
                '最高價': `${storeStats.maxPrice.toFixed(2)} (${storeStats.maxPriceProject} - ${storeStats.maxPriceUnit || 'N/A'})`,
                'Q1': storeStats.q1Price.toFixed(2),
                '中位數': storeStats.medianPrice.toFixed(2),
                'Q3': storeStats.q3Price.toFixed(2),
            },
            'fa-store'
        );
        statsContainer.appendChild(storeCard); // 將卡片加入到 flex 容器中
    }

    // --- 將整個 flex 容器加入到主容器中 ---
    if (statsContainer.hasChildNodes()) {
        container.appendChild(statsContainer);
    }

    // 4. 建案類型單價倍數比較表格
    if (typeComparison && typeComparison.length > 0) {
        const comparisonTable = createComparisonTable(typeComparison);
        container.appendChild(comparisonTable);
    }
}


/**
 * 渲染停車位分析區塊
 * @param {HTMLElement} container - 插入內容的容器元素
 * @param {object} parkingAnalysis - 停車位分析數據
 */
export function renderParkingAnalysis(container, parkingAnalysis) {
    const { parkingRatio, avgPriceByType, rampPlanePriceByFloor } = parkingAnalysis;

    const content = document.createDocumentFragment();

    // 1. 房車配比
    const ratioDiv = document.createElement('div');
    ratioDiv.className = 'parking-ratio-container';
    ratioDiv.innerHTML = `
        <p>總交易戶數: ${parkingRatio.withParking.count + parkingRatio.withoutParking.count}戶</p>
        <div class="ratio-bar">
            <div class="bar-with-parking" style="width: ${parkingRatio.withParking.percentage.toFixed(2)}%;" data-tooltip="配車位: ${parkingRatio.withParking.count}戶 (${parkingRatio.withParking.percentage.toFixed(1)}%)"></div>
            <div class="bar-without-parking" style="width: ${parkingRatio.withoutParking.percentage.toFixed(2)}%;" data-tooltip="無車位: ${parkingRatio.withoutParking.count}戶 (${parkingRatio.withoutParking.percentage.toFixed(1)}%)"></div>
        </div>
    `;
    content.appendChild(ratioDiv);

    // 2. 車位類型均價表 + 坡道平面分層價差表
    const tablesContainer = document.createElement('div');
    tablesContainer.className = 'parking-tables-container';

    if (avgPriceByType && avgPriceByType.length > 0) {
        const avgPriceTable = createParkingTable(avgPriceByType);
        tablesContainer.appendChild(avgPriceTable);
    }

    if (rampPlanePriceByFloor && rampPlanePriceByFloor.some(f => f.count > 0)) {
        const floorPriceTable = createFloorPriceTable(rampPlanePriceByFloor);
        tablesContainer.appendChild(floorPriceTable);
    }

    content.appendChild(tablesContainer);
    container.appendChild(content);
}


/**
 * 渲染銷售速度圖表
 * @param {HTMLElement} container - The container element to render the chart in.
 * @param {object} salesVelocityData - The sales velocity data from the analysis.
 */
export function renderSalesVelocity(container, salesVelocityData) {
    const chartContainer = document.createElement('div');
    chartContainer.id = 'sales-velocity-chart-container';
    chartContainer.style.height = '400px';

    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'chart-controls';

    const viewSelector = document.createElement('select');
    viewSelector.id = 'sales-velocity-view-selector';
    ['weekly', 'monthly', 'quarterly', 'yearly'].forEach(view => {
        const option = document.createElement('option');
        option.value = view;
        option.textContent = { weekly: '週', monthly: '月', quarterly: '季', yearly: '年' }[view];
        viewSelector.appendChild(option);
    });
    viewSelector.value = 'monthly';

    const dataTypeSelector = document.createElement('select');
    dataTypeSelector.id = 'sales-velocity-datatype-selector';
    ['count', 'price', 'area'].forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = { count: '戶數', price: '總價', area: '面積' }[type];
        dataTypeSelector.appendChild(option);
    });
    
    controlsContainer.innerHTML = '<span>時間單位:</span>';
    controlsContainer.appendChild(viewSelector);
    controlsContainer.innerHTML += '<span style="margin-left: 15px;">數據類型:</span>';
    controlsContainer.appendChild(dataTypeSelector);
    
    container.appendChild(controlsContainer);
    container.appendChild(chartContainer);

    let chart = null;

    const drawChart = () => {
        const selectedView = viewSelector.value;
        const selectedDataType = dataTypeSelector.value;
        const data = salesVelocityData[selectedView];
        const allRoomTypes = salesVelocityData.allRoomTypes;

        if (chart) {
            chart.dispose();
        }
        chart = echarts.init(chartContainer);

        const timeKeys = Object.keys(data).sort();
        const series = allRoomTypes.map(roomType => {
            return {
                name: roomType,
                type: 'bar',
                stack: 'total',
                emphasis: { focus: 'series' },
                data: timeKeys.map(timeKey => {
                    const periodData = data[timeKey][roomType];
                    if (!periodData) return 0;
                    if (selectedDataType === 'count') return periodData.count;
                    if (selectedDataType === 'price') return parseFloat((periodData.priceSum / 10000).toFixed(2)); // 轉為億
                    if (selectedDataType === 'area') return parseFloat(periodData.areaSum.toFixed(2));
                    return 0;
                })
            };
        });

        const yAxisName = { count: '戶', price: '億', area: '坪' }[selectedDataType];

        const option = {
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            legend: { data: allRoomTypes, top: 'bottom' },
            grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
            xAxis: [{ type: 'category', data: timeKeys }],
            yAxis: [{ type: 'value', name: yAxisName }],
            series: series,
            dataZoom: [{ type: 'inside' }, { type: 'slider' }],
        };
        chart.setOption(option);
    };

    viewSelector.addEventListener('change', drawChart);
    dataTypeSelector.addEventListener('change', drawChart);
    
    drawChart();
     // 監聽側邊欄寬度變化，重新渲染圖表
    const sidebar = document.getElementById('sidebar');
    const resizeObserver = new ResizeObserver(() => {
        if (chart) {
            chart.resize();
        }
    });
    resizeObserver.observe(sidebar);
    resizeObserver.observe(report-container);
}


/**
 * 渲染房型總價段分佈圖表 (Boxplot)
 * @param {HTMLElement} container - The container element to render the chart in.
 * @param {Array<object>} priceBandData - The data for the price band analysis.
 */
export function renderPriceBandAnalysis(container, priceBandData) {
    const chartContainer = document.createElement('div');
    chartContainer.id = 'price-band-chart-container';
    chartContainer.style.height = '450px';
    container.appendChild(chartContainer);

    const chart = echarts.init(chartContainer);
    
    // 排序數據，優先顯示房數，然後是衛浴數
    priceBandData.sort((a, b) => {
        const roomTypeOrder = ['套房', '1房', '2房', '3房', '4房', '5房以上', '毛胚'];
        const indexA = roomTypeOrder.indexOf(a.roomType);
        const indexB = roomTypeOrder.indexOf(b.roomType);
        
        if (indexA !== -1 && indexB !== -1) {
            if (indexA !== indexB) return indexA - indexB;
            // 房型相同時，按衛浴數排序
            return (a.bathrooms || 0) - (b.bathrooms || 0);
        }
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        // 其他類型按原樣排序
        return a.roomType.localeCompare(b.roomType);
    });

    const categories = priceBandData.map(d => d.bathrooms ? `${d.roomType}-${d.bathrooms}衛` : d.roomType);
    const boxplotData = priceBandData.map(d => [d.minPrice, d.q1Price, d.medianPrice, d.q3Price, d.maxPrice, d.count]);

    const option = {
        title: {
            text: '各房型總價分佈 (盒鬚圖)',
            left: 'center',
            textStyle: { fontSize: 16 }
        },
        tooltip: {
            trigger: 'item',
            axisPointer: { type: 'shadow' },
            formatter: function (params) {
                const data = params.value;
                const name = params.name;
                return [
                    `${name} (共 ${data[5]} 戶)`,
                    `最高價: ${data[4].toFixed(0)} 萬`,
                    `上四分位 (Q3): ${data[3].toFixed(0)} 萬`,
                    `中位數: ${data[2].toFixed(0)} 萬`,
                    `下四分位 (Q1): ${data[1].toFixed(0)} 萬`,
                    `最低價: ${data[0].toFixed(0)} 萬`,
                ].join('<br/>');
            }
        },
        grid: {
            left: '10%',
            right: '10%',
            bottom: '15%'
        },
        xAxis: {
            type: 'category',
            data: categories,
            boundaryGap: true,
            nameGap: 30,
            splitArea: { show: false },
            axisLabel: {
                formatter: function (value) {
                    return value.replace('-', '\n'); // 讓標籤可以換行
                }
            },
            splitLine: { show: false }
        },
        yAxis: {
            type: 'value',
            name: '總價 (萬)',
            splitArea: { show: true }
        },
        series: [
            {
                name: '總價分佈',
                type: 'boxplot',
                data: boxplotData,
                itemStyle: {
                    borderColor: '#337ab7'
                }
            }
        ],
        dataZoom: [{ type: 'inside' }, { type: 'slider', bottom: 10 }],
    };

    chart.setOption(option);
    // 監聽側邊欄寬度變化，重新渲染圖表
    const sidebar = document.getElementById('sidebar');
    const resizeObserver = new ResizeObserver(() => {
        if (chart) {
            chart.resize();
        }
    });
    resizeObserver.observe(sidebar);
    resizeObserver.observe(report-container);
}


/**
 * 渲染房型面積分佈圖表 (Violin Plot)
 * @param {HTMLElement} container - The container element to render the chart in.
 * @param {object} areaDistributionData - The data for the area distribution.
 */
export function renderAreaDistribution(container, areaDistributionData) {
    const chartContainer = document.createElement('div');
    chartContainer.id = 'area-distribution-chart-container';
    chartContainer.style.height = '450px';
    container.appendChild(chartContainer);

    const chart = echarts.init(chartContainer);

    // 準備 ECharts 的 dataset
    const source = [];
    const roomTypes = Object.keys(areaDistributionData).sort((a, b) => {
        const roomTypeOrder = ['套房', '1房', '2房', '3房', '4房', '5房以上', '毛胚'];
        const indexA = roomTypeOrder.indexOf(a);
        const indexB = roomTypeOrder.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.localeCompare(b);
    });

    for (const roomType of roomTypes) {
        for (const area of areaDistributionData[roomType]) {
            source.push([roomType, area]);
        }
    }

    const option = {
        dataset: [{ source: source }, { transform: { type: 'boxplot', config: { itemNameFormatter: '{value}' } } }],
        title: {
            text: '各房型面積分佈 (小提琴圖)',
            left: 'center',
            textStyle: { fontSize: 16 }
        },
        tooltip: {
            trigger: 'item',
            formatter: (params) => {
                if (params.seriesType === 'boxplot') {
                     return [
                        `${params.name}`,
                        `最大面積: ${params.value[5].toFixed(1)} 坪`,
                        `Q3: ${params.value[4].toFixed(1)} 坪`,
                        `中位數: ${params.value[3].toFixed(1)} 坪`,
                        `Q1: ${params.value[2].toFixed(1)} 坪`,
                        `最小面積: ${params.value[1].toFixed(1)} 坪`,
                    ].join('<br/>');
                }
                return `${params.value[0]}: ${params.value[1].toFixed(1)} 坪`;
            }
        },
        grid: {
            left: '10%',
            right: '10%',
            bottom: '15%'
        },
        xAxis: {
            type: 'category',
            data: roomTypes,
            boundaryGap: true,
        },
        yAxis: {
            type: 'value',
            name: '面積 (坪)',
            splitArea: { show: true }
        },
        series: [
            {
                name: '面積分佈',
                type: 'boxplot',
                datasetIndex: 1,
                itemStyle: {
                    color: '#fff',
                    borderColor: '#337ab7'
                },
                boxWidth: [15, 25]
            },
            {
                name: '原始數據',
                type: 'violin',
                data: areaDistributionData,
                itemStyle: {
                    color: 'rgba(51, 122, 183, 0.5)'
                },
                points: {
                    show: true,
                    symbolSize: 3,
                    itemStyle: {
                        color: 'rgba(0,0,0,0.3)'
                    }
                }
            }
        ],
        dataZoom: [{ type: 'inside' }, { type: 'slider', bottom: 10 }],
    };

    chart.setOption(option);
    // 監聽側邊欄寬度變化，重新渲染圖表
    const sidebar = document.getElementById('sidebar');
    const resizeObserver = new ResizeObserver(() => {
        if (chart) {
            chart.resize();
        }
    });
    resizeObserver.observe(sidebar);
    resizeObserver.observe(report-container);
}
