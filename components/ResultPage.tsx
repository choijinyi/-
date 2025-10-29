import React, { useState, useEffect, useMemo } from 'react';
import { Score, CoachingStyle, CoachingStyleInfo } from '../types';
import { COACHING_STYLE_INFO } from '../constants';
import { analyzeCoachingStyle } from '../services/geminiService';
import { SpinnerIcon } from './icons';
import ScoreChart from './ScoreChart';

interface ResultPageProps {
  scores: Score[];
  onRetake: () => void;
}

const ResultPage: React.FC<ResultPageProps> = ({ scores, onRetake }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const primaryStyleData = useMemo(() => {
    if (!scores || scores.length === 0) {
      return { style: null, info: null };
    }
    const primary = scores.reduce((max, current) => (current.score > max.score ? current : max));
    return {
      style: primary.style,
      info: COACHING_STYLE_INFO[primary.style as CoachingStyle]
    };
  }, [scores]);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setIsLoading(true);
      setError('');
      try {
        const result = await analyzeCoachingStyle(scores);
        setAnalysis(result);
      } catch (e: any) {
        setError(e.message || '분석 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scores]);

  const { style: primaryStyle, info: primaryStyleInfo } = primaryStyleData;

  const handleSaveAsPdf = async () => {
    const jspdf = (window as any).jspdf;
    const html2canvas = (window as any).html2canvas;

    if (!jspdf || !html2canvas) {
      setError("PDF 생성 라이브러리를 로드할 수 없습니다. 페이지를 새로고침 해주세요.");
      return;
    }

    const primaryEl = document.getElementById('primary-style-analysis');
    const geminiEl = document.getElementById('gemini-analysis');

    if (!primaryEl || !geminiEl) {
      setError("PDF로 변환할 콘텐츠를 찾을 수 없습니다.");
      return;
    }

    setIsGeneratingPdf(true);
    setError('');

    try {
      const { jsPDF } = jspdf;
      const doc = new jsPDF('p', 'mm', 'a4');
      const A4_WIDTH = 210;
      const MARGIN = 15;
      const CONTENT_WIDTH = A4_WIDTH - MARGIN * 2;
      let yPos = MARGIN;

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(20);
      doc.text("나의 코칭 스타일 진단 결과", MARGIN, yPos);
      yPos += 15;

      const addElementToPdf = async (element: HTMLElement) => {
        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        const finalHeight = CONTENT_WIDTH / ratio;

        if (yPos + finalHeight > doc.internal.pageSize.getHeight() - MARGIN) {
          doc.addPage();
          yPos = MARGIN;
        }
        doc.addImage(imgData, 'PNG', MARGIN, yPos, CONTENT_WIDTH, finalHeight);
        yPos += finalHeight + 10;
      };

      await addElementToPdf(primaryEl);
      await addElementToPdf(geminiEl);
      
      doc.save('coaching-style-analysis.pdf');
    } catch (err) {
      console.error("PDF generation failed:", err);
      setError("PDF 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const renderAnalysis = (text: string) => {
    const sections = text.split(/(###\s.*)/g).filter(Boolean);
    return sections.map((section, index) => {
      if (section.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-bold mt-6 mb-3 text-slate-800">{section.replace('### ', '')}</h3>;
      }
      return <p key={index} className="text-slate-700 leading-relaxed whitespace-pre-wrap">{section}</p>;
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">검사 결과</h2>
          <p className="text-slate-600 mt-1">당신의 코칭 스타일 분석 결과입니다.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSaveAsPdf}
              disabled={isGeneratingPdf || isLoading}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-400 flex items-center justify-center"
            >
              {isGeneratingPdf ? (
                <><SpinnerIcon className="w-5 h-5 mr-2" /> 저장 중...</>
              ) : (
                'PDF로 저장'
              )}
            </button>
            <button
              onClick={onRetake}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
            >
              다시 검사하기
            </button>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold mb-6 text-slate-800">코칭스타일별 점수</h3>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {scores.map(({ style, name, score }) => (
            <div key={style} className="text-center p-4 rounded-lg bg-slate-50 min-w-[120px] border border-slate-200">
              <p className="font-semibold text-slate-700">{name}</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{score}점</p>
            </div>
          ))}
        </div>
        {primaryStyle && <ScoreChart scores={scores} primaryStyle={primaryStyle} />}
      </div>

      {primaryStyleInfo && (
        <div id="primary-style-analysis" className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-slate-800">가장 유효한 코칭스타일: {primaryStyleInfo.name}</h3>
          <p className="text-slate-600 mb-6">{primaryStyleInfo.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-lg text-green-700 mb-3">강점</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {primaryStyleInfo.strengths.map(s => <li key={s}>{s}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg text-red-700 mb-3">약점</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {primaryStyleInfo.weaknesses.map(w => <li key={w}>{w}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div id="gemini-analysis" className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold mb-4 text-slate-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
          Gemini AI 기반 복합 스타일 분석
        </h3>
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-10">
            <SpinnerIcon className="w-12 h-12 text-blue-600" />
            <p className="mt-4 text-slate-600 font-semibold">AI가 당신의 결과를 분석하고 있습니다...</p>
          </div>
        )}
        {error && <div className="text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>}
        {!isLoading && !error && (
            <div className="prose prose-slate max-w-none">
              {renderAnalysis(analysis)}
            </div>
        )}
      </div>
    </div>
  );
};

export default ResultPage;