import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-80 flex flex-col justify-center items-center z-50">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
      <p className="text-white text-xl mt-4">...جاري إنشاء تصميمك</p>
      <p className="text-slate-400 text-sm mt-2">قد تستغرق هذه العملية دقيقة أو دقيقتين</p>
    </div>
  );
};

export default LoadingSpinner;
