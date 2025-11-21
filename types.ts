
export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface BeadColor {
  id: string;
  name: string;
  hex: string;
  rgb: RGB;
}

export interface PixelData {
  x: number;
  y: number;
  color: BeadColor;
}

export interface ProjectSettings {
  width: number; // in beads
  paletteId: string;
  maxColors: number;
}

export interface AnalysisResult {
  grid: PixelData[][];
  width: number;
  height: number;
  colorCounts: Record<string, { count: number; color: BeadColor }>;
}

export enum TabState {
  UPLOAD = 'UPLOAD',
  GENERATE = 'GENERATE',
}
