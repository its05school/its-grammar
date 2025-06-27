/**
 * Gemini API를 호출하여 주어진 프롬프트에 맞는 문제를 생성하는 범용 함수
 * @param {string} apiKey - 사용자의 Gemini API 키
 * @param {string} prompt - 문제 생성을 위한 구체적인 프롬프트
 * @returns {Promise<Array>} - 생성된 문제 객체들의 배열. 실패 시 빈 배열 반환.
 */
export async function generateProblems(apiKey, prompt) {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                "generationConfig": {
                    "temperature": 0.9,
                    "responseMimeType": "application/json",
                }
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('API 요청 실패:', errorBody);
            throw new Error(`API 요청에 실패했습니다. (상태 코드: ${response.status})`);
        }

        const data = await response.json();
        // Gemini가 생성한 JSON 텍스트를 실제 JavaScript 배열로 파싱합니다.
        const problems = JSON.parse(data.candidates[0].content.parts[0].text);
        return problems;

    } catch (error) {
        // 네트워크 오류나 기타 예외 발생 시 처리
        console.error('문제 생성 중 오류 발생:', error);
        alert(`문제 생성 중 오류가 발생했습니다: ${error.message}`);
        return []; 
    }
}
