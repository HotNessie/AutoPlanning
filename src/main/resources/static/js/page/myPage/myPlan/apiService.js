import { getHeaders } from '../../../core/apiService.js';

/**
 * Title - 사용자 로그인 상태를 확인합니다.
 * @returns {Promise<boolean>}
 */
export async function checkLoginStatus() {
    const response = await fetch('/status', {
        method: 'GET',
        headers: getHeaders({ 'Content-Type': 'application/json' })
    });
    return response.ok;
}

/**
 * Title - 내 여행 계획 목록을 페이징하여 가져옵니다.
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 * @returns {Promise<any>}
 */
export async function fetchMyPlans(page = 0, size = 10) {
    const response = await fetch(`/api/private/my-plans?page=${page}&size=${size}&sort=createdDate,desc`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch plans');
    return await response.json();
}

/**
 * Title - 특정 여행 계획의 상세 정보를 가져옵니다.
 * @param {number} planId - 계획 ID
 * @returns {Promise<any>}
 */
export async function fetchPlanDetails(planId) {
    const response = await fetch(`/api/public/plan/${planId}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch plan details');
    return await response.json();
}

/**
 * Title - 특정 여행 계획의 경로 정보를 가져옵니다.
 * @param {number} planId - 계획 ID
 * @returns {Promise<any>}
 */
export async function fetchPlanRoutes(planId) {
    const response = await fetch(`/api/public/routes/${planId}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch plan routes');
    return await response.json();
}
