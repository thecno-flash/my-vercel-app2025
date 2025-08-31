import React from 'react';

interface ResultDisplayProps {
  redesignedUrl: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ redesignedUrl }) => {
  return (
    <div className="w-full h-64 md:h-full border-2 border-slate-700 rounded-lg flex justify-center items-center text-slate-400 bg-black/20">
      {redesignedUrl ? (
        <img src={redesignedUrl} alt="Redesigned Room" className="w-full h-full object-contain rounded-lg p-2" />
      ) : (
        <div className="text-center p-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M12 21v-1m-4-4a4 4 0 118 0 4 4 0 01-8 0z" />
          </svg>
          <p className="mt-2 font-semibold">سيظهر تصميمك الجديد هنا</p>
          <p className="text-sm text-slate-500">أكمل الخطوات على اليمين للبدء</p>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
