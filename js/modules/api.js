// supabase_project/js/modules/api.js

import { supabase } from '../supabase-client.js';

/**
 * 通用的 Supabase Function 呼叫器
 * @param {string} functionName - 要呼叫的 Function 名稱
 * @param {object} body - 要傳遞的請求內容
 * @returns {Promise<any>} - 回傳的資料
 */
async function invokeSupabaseFunction(functionName, body) {
    // 檢查是否有可用的 session，並相應地設定 Authorization header
    const { data: { session } } = await supabase.auth.getSession();
    const headers = {
        'Content-Type': 'application/json',
    };
    if (session) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    const { data, error } = await supabase.functions.invoke(functionName, {
        body: JSON.stringify(body),
        headers: headers // 確保 headers 被傳遞
    });

    if (error) {
        console.error(`Error invoking ${functionName}:`, error);
        // 根據錯誤類型提供更具體的錯誤訊息
        if (error.context?.msg) {
             throw new Error(`Function Error: ${error.context.msg}`);
        }
        if (error instanceof TypeError) { // e.g., Network error
            throw new Error("無法連接到伺服器，請檢查您的網路連線。");
        }
        throw new Error(`執行 ${functionName} 失敗: ${error.message}`);
    }
    
    // 如果回傳的 data 是字串，嘗試解析為 JSON
    if (typeof data === 'string') {
        try {
            return JSON.parse(data);
        } catch (e) {
             // 如果不是合法的 JSON 字串，直接回傳
            console.warn("Function returned a non-JSON string:", data);
            return data;
        }
    }
    
    return data;
}


export async function fetchCountyNames() {
    return invokeSupabaseFunction('query-names', { type: 'counties' });
}

export async function fetchDistrictNames(county) {
    if (!county) throw new Error("County is required to fetch districts.");
    return invokeSupabaseFunction('query-names', { type: 'districts', county });
}

export async function fetchProjectNames(county, districts) {
    if (!county) throw new Error("County is required to fetch project names.");
    return invokeSupabaseFunction('query-names', { type: 'projects', county, districts });
}

export async function queryData(filters, page, pageSize) {
    return invokeSupabaseFunction('query-data', { ...filters, page, pageSize });
}

// ▼▼▼ 【修改處】新增 residentialOnly 參數 ▼▼▼
export async function analyzeData({ county, districts, buildingTypes, projectNames, dateStart, dateEnd, residentialOnly }) {
    if (!county || !dateStart || !dateEnd) {
        throw new Error('分析時缺少必要參數 (縣市、開始日期、結束日期)');
    }
    return invokeSupabaseFunction('analyze-data', {
        county,
        districts: districts || [],
        buildingTypes: buildingTypes || [],
        projectNames: projectNames || [],
        dateStart,
        dateEnd,
        residentialOnly // 將參數傳遞給後端
    });
}
// ▲▲▲ 【修改結束】 ▲▲▲


export async function fetchSubTableData(mainTableId) {
    if (!mainTableId) throw new Error("Main table ID is required.");
    return invokeSupabaseFunction('query-sub-data', { mainTableId });
}


export async function generateShareLink(state) {
    return invokeSupabaseFunction('generate-share-link', { state });
}

export async function getPublicReport(reportId) {
    if (!reportId) throw new Error("Report ID is required.");
    return invokeSupabaseFunction('public-report', { reportId });
}
