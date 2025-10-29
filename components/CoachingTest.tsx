
import React, { useState, useCallback } from 'react';
import { COACHING_QUESTIONS } from '../constants';
import { Score } from '../types';
import { CheckIcon } from './icons';

interface CoachingTestProps {
  onComplete: (scores: Score[]) => void;
}

const CoachingTest: React.FC<CoachingTestProps> = ({ onComplete }) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const handleToggle = useCallback((characteristic: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(characteristic)) {
        newSet.delete(characteristic);
      } else {
        newSet.add(characteristic);
      }
      return newSet;
    });
  }, []);

  const handleSubmit = () => {
    const scores: Score[] = COACHING_QUESTIONS.map(part => {
      const score = part.characteristics.reduce((acc, char) => {
        return acc + (selectedItems.has(char) ? 1 : 0);
      }, 0);
      return { style: part.id, name: part.title.split(':')[1].trim(), score: score };
    });
    onComplete(scores);
  };

  const totalSelected = selectedItems.size;

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">코칭스타일 검사지</h2>
        <p className="text-slate-600 mt-2">다음의 특성들을 살펴보고 당신에게 해당된다고 생각되는 모든 곳에 체크(○)해 주십시오.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {COACHING_QUESTIONS.map((part) => (
          <div key={part.id} className="border border-slate-200 rounded-lg p-5 bg-slate-50/50">
            <h3 className="font-bold text-lg text-blue-700 mb-4">{part.title}</h3>
            <div className="space-y-3">
              {part.characteristics.map((char) => {
                const isSelected = selectedItems.has(char);
                return (
                  <label key={char} className="flex items-center cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isSelected}
                        onChange={() => handleToggle(char)}
                      />
                      <div className={`w-5 h-5 border-2 rounded-md transition-colors duration-200 ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 group-hover:border-blue-400'}`}>
                        {isSelected && <CheckIcon className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                    <span className={`ml-3 text-sm transition-colors duration-200 ${isSelected ? 'text-slate-800 font-medium' : 'text-slate-600'}`}>
                      {char}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-10 text-center sticky bottom-4">
        <button
          onClick={handleSubmit}
          disabled={totalSelected === 0}
          className="w-full md:w-auto px-12 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transform hover:-translate-y-1 transition-all duration-300 ease-in-out disabled:transform-none"
        >
          {totalSelected > 0 ? `${totalSelected}개 선택됨 - 결과 보기` : '항목을 선택해주세요'}
        </button>
      </div>
    </div>
  );
};

export default CoachingTest;
