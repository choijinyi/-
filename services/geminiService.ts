
import { GoogleGenAI } from "@google/genai";
import { Score } from '../types';

export const analyzeCoachingStyle = async (scores: Score[]): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const scoreSummary = scores.map(s => `${s.name}: ${s.score}점`).join('\n');

  const prompt = `
    당신은 개인의 코칭 스타일을 분석하는 전문 코칭 컨설턴트입니다. 주어진 코칭 스타일 검사 점수를 바탕으로 개인의 복합적인 코칭 스타일을 심도 있게 분석해주세요.

    코칭 스타일 유형:
    - D형 (Director: 지시형): 지배적, 결과 지향적, 빠른 속도, 도전을 즐김.
    - S형 (Strategist: 분석형): 철저함, 분석적, 규칙 준수, 완벽주의.
    - P형 (Presenter: 사교형): 활기참, 자발적, 사교적, 주목받는 것을 즐김.
    - M형 (Mediator: 우호형): 우호적, 지지적, 인내심, 조화를 추구.

    사용자의 점수:
    ${scoreSummary}

    분석 요청사항:
    1.  **복합 코칭 스타일 분석**: 가장 높은 점수를 받은 스타일을 주된 스타일로 언급하되, 다른 스타일 점수들이 어떻게 영향을 미치는지 종합적으로 분석하여 사용자의 독특한 '복합 코칭 스타일'을 정의해주세요.
    2.  **강점 분석**: 이 복합적인 스타일이 코칭 상황에서 발휘할 수 있는 구체적인 강점들을 설명해주세요.
    3.  **약점 및 보완점 분석**: 잠재적인 약점이나 주의해야 할 점을 지적하고, 이를 보완하기 위한 구체적인 조언을 제공해주세요.

    출력 형식:
    - 전체 답변은 한국어로 작성해주세요.
    - Markdown 형식을 사용하여 가독성을 높여주세요.
    - 다음의 세 가지 소제목을 반드시 사용해주세요: '### 복합 코칭 스타일 분석', '### 강점', '### 약점 및 보완점'.
    - 각 항목에 대해 2-3개의 문단으로 상세하게 설명해주세요.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing coaching style with Gemini:", error);
    return "결과를 분석하는 동안 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};
