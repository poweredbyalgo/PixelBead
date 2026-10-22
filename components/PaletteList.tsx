
import React from 'react';
import { AnalysisResult, BeadColor } from '@/types';

interface PaletteListProps {
  data: AnalysisResult | null;
}

interface ColorCount {
  count: number;
  color: BeadColor;
}

export const PaletteList: React.FC<PaletteListProps> = ({ data }) => {
  if (!data) return null;

  const sortedCounts = (Object.values(data.colorCounts) as ColorCount[]).sort((a, b) => b.count - a.count);
  const totalBeads = sortedCounts.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="p-6 bg-slate-800 border-l border-slate-700 overflow-y-auto h-full">
      <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-1">材料清单</h2>
          <p className="text-slate-400 text-sm">总豆数: <span className="text-indigo-400 font-mono">{totalBeads}</span></p>
      </div>

      <div className="space-y-3">
        {sortedCounts.map((item) => (
          <div key={item.color.id} className="flex items-center justify-between bg-slate-700/50 p-2 rounded-md border border-slate-600/50">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full shadow-inner border border-white/10 ring-1 ring-black/20"
                style={{ backgroundColor: item.color.hex }}
              />
              <div>
                <div className="text-sm font-semibold text-slate-200">{item.color.name}</div>
                <div className="text-xs text-slate-500 font-mono">{item.color.id}</div>
              </div>
            </div>
            <span className="font-mono text-indigo-300 font-bold bg-indigo-500/10 px-2 py-1 rounded">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
