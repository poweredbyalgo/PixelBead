
import React, { useState, useEffect, useRef } from 'react';
import { PALETTES } from './constants';
import { ProjectSettings, AnalysisResult } from './types';
import { processImage } from './utils/imageProcessor';
import { Controls } from './components/Controls';
import { BeadGrid, BeadGridHandle } from './components/BeadGrid';
import { PaletteList } from './components/PaletteList';

const INITIAL_SETTINGS: ProjectSettings = {
  width: 50,
  paletteId: 'none',
  maxColors: 20,
};

const App: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [settings, setSettings] = useState<ProjectSettings>(INITIAL_SETTINGS);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  
  // View States
  const [showOriginal, setShowOriginal] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(false);
  
  const beadGridRef = useRef<BeadGridHandle>(null);

  // When settings or image changes, re-process
  useEffect(() => {
    if (sourceImage) {
      try {
        const selectedPalette = PALETTES[settings.paletteId]?.colors || [];
        
        const result = processImage(
          sourceImage,
          settings.width,
          selectedPalette,
          settings.maxColors
        );
        setAnalysis(result);
      } catch (e) {
        console.error("Processing error", e);
      }
    }
  }, [sourceImage, settings]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        setImageSrc(src);
        const img = new Image();
        img.onload = () => {
             setSourceImage(img);
             setShowOriginal(false); 
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = () => {
    beadGridRef.current?.exportImage();
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Header */}
      <header className="h-16 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-6 shrink-0 z-10 shadow-md">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">P</div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">像素拼豆工作室</h1>
        </div>
        <div className="flex gap-6 items-center">
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Controls / Input */}
        <aside className="w-80 bg-slate-900 flex flex-col border-r border-slate-700 z-20">

            <div className="flex-col flex h-full">
                {/* Top Section: Tools */}
                <div className="p-6 pb-8 border-b border-slate-700/50 shrink-0">
                    {/* Upload Section */}
                    <div>
                        <label className="block w-full aspect-video rounded-xl border-2 border-dashed border-slate-600 hover:border-indigo-400 hover:bg-slate-800/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group relative overflow-hidden bg-slate-800/20">
                            {sourceImage && (
                                <img src={sourceImage.src} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="preview" />
                            )}
                            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-500 group-hover:text-indigo-400 transition-colors z-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                            </svg>
                            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 z-10 drop-shadow-md uppercase tracking-wide">
                                {sourceImage ? '更换图片' : '上传图片'}
                            </span>
                        </label>
                    </div>
                </div>

                {/* Bottom Section: Settings */}
                <Controls
                    settings={settings}
                    onSettingsChange={setSettings}
                    originalDimensions={sourceImage ? { w: sourceImage.width, h: sourceImage.height } : null}
                    showGrid={showGrid}
                    onToggleGrid={setShowGrid}
                    showRulers={showRulers}
                    onToggleRulers={setShowRulers}
                    showOriginal={showOriginal}
                    onToggleOriginal={setShowOriginal}
                    onExport={handleExport}
                />
            </div>
        </aside>

        {/* Main Content: Grid */}
        <main className="flex-1 bg-slate-900 relative flex flex-col min-w-0">
            <BeadGrid 
                ref={beadGridRef}
                data={analysis} 
                sourceImage={sourceImage}
                showOriginal={showOriginal}
                showGrid={showGrid}
                showRulers={showRulers}
            />
        </main>

        {/* Right Sidebar: Palette List */}
        <aside className="w-72 bg-slate-900 border-l border-slate-700 z-20 hidden lg:block">
            <PaletteList data={analysis} />
        </aside>
      </div>
    </div>
  );
};

export default App;
