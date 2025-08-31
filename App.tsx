import React, { useState, useCallback } from 'react';
import { DesignStyle } from './types';
import { toBase64 } from './utils/fileUtils';
import { redesignRoom } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import StyleSelector from './components/StyleSelector';
import ResultDisplay from './components/ResultDisplay';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [redesignedImageUrl, setRedesignedImageUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((file: File) => {
    setOriginalImage(file);
    setRedesignedImageUrl(null);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleGenerateClick = async () => {
    if (!originalImage || !selectedStyle) {
      setError('يرجى تحميل صورة واختيار نمط تصميم.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRedesignedImageUrl(null);

    try {
      const base64Image = await toBase64(originalImage);
      const newImageBase64 = await redesignRoom(
        base64Image,
        originalImage.type,
        selectedStyle
      );
      setRedesignedImageUrl(`data:image/jpeg;base64,${newImageBase64}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('حدث خطأ غير متوقع.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white antialiased p-4 md:p-8">
      {isLoading && <LoadingSpinner />}
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Controls Column */}
          <div className="flex flex-col gap-8 p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            <div>
                <h3 className="text-lg font-semibold text-slate-300 mb-4">١. حمّل صورة لغرفتك</h3>
                <ImageUploader onImageUpload={handleImageUpload} imageUrl={originalImageUrl} />
            </div>
            
            <StyleSelector selectedStyle={selectedStyle} onStyleChange={setSelectedStyle} />
            
            <button
              onClick={handleGenerateClick}
              disabled={!originalImage || !selectedStyle || isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? '...جاري المعالجة' : 'أنشئ التصميم الجديد'}
            </button>
            {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-lg text-center">{error}</div>}
          </div>

          {/* Result Column */}
          <div className="flex flex-col p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
             <h3 className="text-lg font-semibold text-slate-300 mb-4">النتيجة</h3>
             <ResultDisplay redesignedUrl={redesignedImageUrl} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
