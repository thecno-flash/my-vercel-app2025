import React from 'react';
import { DesignStyle } from '../types';

interface StyleSelectorProps {
  selectedStyle: DesignStyle | null;
  onStyleChange: (style: DesignStyle) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onStyleChange }) => {
  const styles = Object.values(DesignStyle);

  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-300 mb-4">٢. اختر نمط التصميم</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {styles.map((style) => (
          <button
            key={style}
            onClick={() => onStyleChange(style)}
            className={`p-4 rounded-lg text-center font-medium transition-all duration-200 ease-in-out transform hover:scale-105 ${
              selectedStyle === style
                ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-offset-2 ring-offset-slate-900 ring-indigo-500'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {style}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;
