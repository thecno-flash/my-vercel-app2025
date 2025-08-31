import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-4 md:p-6">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600 mb-2">
        مصمم الديكور بالذكاء الاصطناعي
      </h1>
      <p className="text-slate-400 text-lg">
        حوّل مساحتك بنقرة واحدة. حمّل صورة لغرفتك، اختر طرازك المفضل، ودع الذكاء الاصطناعي يبدع.
      </p>
    </header>
  );
};

export default Header;
