
import React, { useState, useCallback } from 'react';
import CoachingTest from './components/CoachingTest';
import ResultPage from './components/ResultPage';
import { Score } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'test' | 'result'>('test');
  const [scores, setScores] = useState<Score[] | null>(null);

  const handleTestComplete = useCallback((finalScores: Score[]) => {
    setScores(finalScores);
    setView('result');
    window.scrollTo(0, 0);
  }, []);

  const handleRetakeTest = useCallback(() => {
    setScores(null);
    setView('test');
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-5">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 text-center">나의 코칭 스타일 진단</h1>
          <p className="text-center text-slate-600 mt-1">당신의 강점을 발견하고 코칭 효과를 극대화하세요.</p>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        {view === 'test' && <CoachingTest onComplete={handleTestComplete} />}
        {view === 'result' && scores && <ResultPage scores={scores} onRetake={handleRetakeTest} />}
      </main>
       <footer className="text-center py-6 text-sm text-slate-500">
          <p>&copy; 2024 Coaching Style Analyzer. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
