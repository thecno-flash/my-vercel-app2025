import React, { useState, useCallback, useEffect } from 'react';
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
  const [apiKey, setApiKey] = useState<string>('');
  const [isApiKeySet, setIsApiKeySet] = useState<boolean>(false);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('geminiApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsApiKeySet(true);
    }
  }, []);

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
  
  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('geminiApiKey', apiKey.trim());
      setIsApiKeySet(true);
      setError(null);
    } else {
      setError('يرجى إدخال مفتاح API.');
    }
  };

  const handleChangeApiKey = () => {
    setIsApiKeySet(false);
    localStorage.removeItem('geminiApiKey');
  };

  const handleGenerateClick = async () => {
    if (!isApiKeySet) {
      setError('يرجى حفظ مفتاح API الخاص بك أولاً.');
      return;
    }
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
        selectedStyle,
        apiKey
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

  const maskApiKey = (key: string) => {
    if (key.length < 8) return '****';
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white antialiased p-4 md:p-8">
      {isLoading && <LoadingSpinner />}
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Controls Column */}
          <div className="flex flex-col gap-6 p-6 bg-slate-800/50 rounded-xl shadow-2xl border border-slate-700">
            <div>
              <h3 className="text-lg font-semibold text-slate-300 mb-4">مفتاح Google Gemini API</h3>
              {isApiKeySet ? (
                <div className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
                  <span className="font-mono text-green-400">{maskApiKey(apiKey)}</span>
                  <button onClick={handleChangeApiKey} className="text-sm bg-slate-600 hover:bg-slate-500 text-slate-300 font-bold py-1 px-3 rounded">
                    تغيير
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="أدخل مفتاح API الخاص بك هنا"
                    className="flex-grow bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    aria-label="Google Gemini API Key"
                  />
                  <button onClick={handleSaveApiKey} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    حفظ المفتاح
                  </button>
                </div>
              )}
              <p className="text-xs text-slate-500 mt-2">
                مفتاحك يُحفظ في متصفحك فقط. <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-400">احصل على مفتاح API</a>.
              </p>
            </div>

            <hr className="border-slate-700" />

            <div>
                <h3 className="text-lg font-semibold text-slate-300 mb-4">١. حمّل صورة لغرفتك</h3>
                <ImageUploader onImageUpload={handleImageUpload} imageUrl={originalImageUrl} />
            </div>
            
            <StyleSelector selectedStyle={selectedStyle} onStyleChange={setSelectedStyle} />
            
            <button
              onClick={handleGenerateClick}
              disabled={!originalImage || !selectedStyle || isLoading || !isApiKeySet}
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