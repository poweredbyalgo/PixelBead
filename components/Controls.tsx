
import React from 'react';
import { ProjectSettings } from '../types';
import { PALETTES } from '../constants';

interface ControlsProps {
  settings: ProjectSettings;
  onSettingsChange: (newSettings: ProjectSettings) => void;
  originalDimensions: { w: number, h: number } | null;
  showGrid: boolean;
  onToggleGrid: (val: boolean) => void;
  showRulers: boolean;
  onToggleRulers: (val: boolean) => void;
  showOriginal: boolean;
  onToggleOriginal: (val: boolean) => void;
  onExport: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ 
  settings, 
  onSettingsChange, 
  originalDimensions,
  showGrid,
  onToggleGrid,
  showRulers,
  onToggleRulers,
  showOriginal,
  onToggleOriginal,
  onExport
}) => {
  const update = (key: keyof ProjectSettings, val: any) => {
    onSettingsChange({ ...settings, [key]: val });
  };

  const calcHeight = originalDimensions
    ? Math.round(settings.width * (originalDimensions.h / originalDimensions.w))
    : 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-4 pb-2 shrink-0">
        <div className="flex items-center gap-2 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-indigo-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
            <h2 className="text-lg font-bold">设置</h2>
        </div>
      </div>

      {/* Scrollable Settings Area */}
      <div className="flex-1 overflow-y-auto px-6 py-2 space-y-6 custom-scrollbar">
        
        {/* Section: View Options */}
        <section>
           <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">视图显示</h3>
           <div className="space-y-3">
              {/* Pixel/Original Toggle */}
              <div className="bg-slate-800 p-1 rounded-lg flex relative">
                  <div 
                    className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-indigo-600 rounded-md shadow-sm transition-all duration-300 ease-out ${showOriginal ? 'left-[calc(50%+2px)]' : 'left-1'}`}
                  />
                  <button 
                    onClick={() => onToggleOriginal(false)}
                    disabled={!originalDimensions}
                    className={`flex-1 relative z-10 text-xs font-medium py-1.5 text-center transition-colors ${!showOriginal ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    像素预览
                  </button>
                  <button 
                    onClick={() => onToggleOriginal(true)}
                    disabled={!originalDimensions}
                    className={`flex-1 relative z-10 text-xs font-medium py-1.5 text-center transition-colors ${showOriginal ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    原始图片
                  </button>
              </div>

              {/* Grid & Rulers Buttons */}
              <div className="grid grid-cols-2 gap-3">
                  <button
                      onClick={() => onToggleGrid(!showGrid)}
                      disabled={showOriginal || !originalDimensions}
                      className={`flex items-center justify-center gap-2 py-2 rounded-lg border text-xs font-medium transition-all 
                        ${showGrid 
                          ? 'bg-slate-700 border-indigo-500/50 text-indigo-300 shadow-inner' 
                          : 'bg-slate-800 border-transparent text-slate-400 hover:bg-slate-700'
                        } disabled:opacity-40`}
                  >
                       <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
                       网格线
                  </button>
                  <button
                       onClick={() => onToggleRulers(!showRulers)}
                       disabled={showOriginal || !originalDimensions}
                       className={`flex items-center justify-center gap-2 py-2 rounded-lg border text-xs font-medium transition-all 
                        ${showRulers 
                          ? 'bg-slate-700 border-indigo-500/50 text-indigo-300 shadow-inner' 
                          : 'bg-slate-800 border-transparent text-slate-400 hover:bg-slate-700'
                        } disabled:opacity-40`}
                  >
                       <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M7 21v-2"/><path d="M11 21v-4"/><path d="M15 21v-2"/><path d="M19 21v-4"/><path d="M3 7h2"/><path d="M3 11h4"/><path d="M3 15h2"/><path d="M3 19h4"/></svg>
                       标尺
                  </button>
              </div>
           </div>
        </section>

        <div className="h-px bg-slate-800" />

        {/* Section: Project Parameters */}
        <section className="space-y-5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">图纸参数</h3>
          
          {/* Width Control */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="text-sm text-slate-300 font-medium">宽度设置</label>
              <span className="text-xs text-indigo-400 font-mono bg-indigo-900/30 px-1.5 py-0.5 rounded">
                {settings.width} × {calcHeight}
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={150}
              value={settings.width}
              onChange={(e) => update('width', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
            />
          </div>

          {/* Palette Control */}
          <div>
            <label className="block text-sm text-slate-300 font-medium mb-2">材料色板</label>
            <select 
              value={settings.paletteId}
              onChange={(e) => update('paletteId', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 hover:border-slate-600 transition-colors"
            >
              {Object.entries(PALETTES).map(([key, p]) => (
                <option key={key} value={key}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Conditional Max Colors Control */}
          {settings.paletteId === 'none' && (
            <div className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/50 animate-in fade-in slide-in-from-top-2 duration-300">
               <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-slate-300">提取颜色数</span>
                <span className="text-xs font-bold text-indigo-400">{settings.maxColors} 色</span>
              </div>
               <input
                type="range"
                min={2}
                max={64}
                value={settings.maxColors}
                onChange={(e) => update('maxColors', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          )}
        </section>
      </div>

      {/* Footer: Export Action */}
      <div className="p-6 border-t border-slate-800 bg-slate-900 shrink-0">
        <button
            onClick={onExport}
            disabled={!originalDimensions}
            className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-900/20 transition-all transform active:scale-[0.98] ${!originalDimensions ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M12 12.75l-3.25-3.25m0 0 3.25-3.25M12 3v9" />
            </svg>
            导出像素图纸
        </button>
      </div>
    </div>
  );
};
