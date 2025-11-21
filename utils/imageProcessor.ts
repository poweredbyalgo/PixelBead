
import { BeadColor, PixelData, AnalysisResult, RGB } from '../types';

// Weighted Euclidean distance for better human color perception
// Adjusted weights to prioritize color distinctiveness
const getColorDistance = (c1: RGB, c2: RGB): number => {
  const rmean = (c1.r + c2.r) / 2;
  const r = c1.r - c2.r;
  const g = c1.g - c2.g;
  const b = c1.b - c2.b;
  return Math.sqrt((((512 + rmean) * r * r) >> 8) + 4 * g * g + (((768 - rmean) * b * b) >> 8));
};

const findClosestColor = (r: number, g: number, b: number, palette: BeadColor[]): BeadColor => {
  let minDistance = Infinity;
  let closest = palette[0];

  if (!palette.length) return { id: '000', name: 'Unknown', hex: '#000000', rgb: {r:0,g:0,b:0} };

  for (const color of palette) {
    const distance = getColorDistance({ r, g, b }, color.rgb);
    if (distance < minDistance) {
      minDistance = distance;
      closest = color;
    }
  }
  return closest;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const getChroma = (rgb: RGB): number => {
    const max = Math.max(rgb.r, rgb.g, rgb.b);
    const min = Math.min(rgb.r, rgb.g, rgb.b);
    return max - min;
};

// Improved Quantization: K-Means with distinctiveness enforcement
const performQuantization = (pixels: RGB[], maxColors: number): BeadColor[] => {
    if (pixels.length === 0) return [];
    
    let centroids: RGB[] = [];
    const distinctColorsMap = new Map<string, RGB>();
    
    // Sampling
    const step = Math.max(1, Math.floor(pixels.length / 4000)); 
    for (let i = 0; i < pixels.length; i += step) {
        const p = pixels[i];
        const key = `${p.r},${p.g},${p.b}`;
        if (!distinctColorsMap.has(key)) {
            distinctColorsMap.set(key, p);
        }
    }
    
    const distinctColors = Array.from(distinctColorsMap.values());
    // Sort by Vibrancy (Chroma) to ensure main colors are picked
    distinctColors.sort((a, b) => getChroma(b) - getChroma(a));

    const minDistanceSq = 40 * 40; // Increased distance threshold for more distinct palette

    // 1. Pick Centroids
    for (const candidate of distinctColors) {
        if (centroids.length >= maxColors) break;

        let isDistinct = true;
        for (const c of centroids) {
             // Simple Euclidean dist check for speed
             const distSq = (candidate.r - c.r)**2 + (candidate.g - c.g)**2 + (candidate.b - c.b)**2;
             if (distSq < minDistanceSq) {
                 isDistinct = false;
                 break;
             }
        }
        
        if (isDistinct) {
            centroids.push(candidate);
        }
    }

    // Fill remaining if needed
    if (centroids.length < maxColors) {
         const remaining = distinctColors.filter(d => !centroids.includes(d));
         // Sort remaining by luminosity to get some variety in brightness (blacks/whites)
         remaining.sort((a, b) => (a.r+a.g+a.b) - (b.r+b.g+b.b));
         
         // Take from ends (darkest and lightest) and middle
         if (remaining.length > 0) centroids.push(remaining[0]); // Darkest
         if (remaining.length > 1) centroids.push(remaining[remaining.length-1]); // Lightest
         
         // Random fill rest
         for (let i = 0; i < remaining.length; i+=10) {
            if (centroids.length >= maxColors) break;
             centroids.push(remaining[i]);
         }
    }
    
    if (centroids.length === 0 && pixels.length > 0) centroids.push(pixels[0]);

    // 2. Iterate K-Means
    const iterations = 8; 
    for (let i = 0; i < iterations; i++) {
        const clusters: RGB[][] = Array.from({ length: centroids.length }, () => []);
        
        for (const pixel of pixels) {
            let minInfo = { dist: Infinity, idx: 0 };
            for (let cIdx = 0; cIdx < centroids.length; cIdx++) {
                const c = centroids[cIdx];
                // Regular Euclidean for clustering assignment
                const dist = (pixel.r - c.r) ** 2 + (pixel.g - c.g) ** 2 + (pixel.b - c.b) ** 2;
                if (dist < minInfo.dist) {
                    minInfo = { dist, idx: cIdx };
                }
            }
            clusters[minInfo.idx].push(pixel);
        }

        const newCentroids: RGB[] = [];
        for (let cIdx = 0; cIdx < centroids.length; cIdx++) {
            const cluster = clusters[cIdx];
            if (cluster.length === 0) {
                newCentroids.push(centroids[cIdx]); 
                continue;
            }
            let sumR = 0, sumG = 0, sumB = 0;
            for (const p of cluster) { sumR += p.r; sumG += p.g; sumB += p.b; }
            newCentroids.push({
                r: Math.round(sumR / cluster.length),
                g: Math.round(sumG / cluster.length),
                b: Math.round(sumB / cluster.length)
            });
        }
        centroids = newCentroids;
    }

    return centroids.map((c, index) => ({
        id: `AUTO-${index + 1}`,
        name: `自动色 ${index + 1}`,
        hex: rgbToHex(c.r, c.g, c.b),
        rgb: c
    }));
};

/**
 * Cleans up "noise" in the grid using a majority vote (cellular automata) approach.
 * This eliminates single stray pixels by forcing them to match their neighbors.
 */
const applyDenoising = (grid: PixelData[][], width: number, height: number): PixelData[][] => {
    // Create a deep copy for the next generation
    const nextGrid = grid.map(row => row.map(p => ({ ...p })));
    
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const current = grid[y][x];
            
            // Get neighbors (Moore neighborhood)
            const neighbors = [
                grid[y-1][x], grid[y+1][x], grid[y][x-1], grid[y][x+1],
                grid[y-1][x-1], grid[y-1][x+1], grid[y+1][x-1], grid[y+1][x+1]
            ];

            // Count color occurrences
            const counts: Record<string, number> = {};
            let maxCount = 0;
            let dominantColor = current.color;

            neighbors.forEach(n => {
                const id = n.color.id;
                counts[id] = (counts[id] || 0) + 1;
                if (counts[id] > maxCount) {
                    maxCount = counts[id];
                    dominantColor = n.color;
                }
            });

            // Filter Logic:
            // If the current pixel is "lonely" (matches fewer than 2 neighbors)
            // AND there is a strong dominant neighbor (at least 4 out of 8),
            // Switch current pixel to dominant color.
            const currentMatches = counts[current.color.id] || 0;
            
            if (currentMatches <= 2 && maxCount >= 4) {
                nextGrid[y][x].color = dominantColor;
            }
        }
    }
    return nextGrid;
};

export const processImage = (
  image: HTMLImageElement,
  width: number,
  palette: BeadColor[],
  maxColors: number = 20,
): AnalysisResult => {
  const aspectRatio = image.height / image.width;
  const height = Math.round(width * aspectRatio);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Canvas not supported');

  // 1. Draw resized image
  // Smoothing enabled to reduce aliasing noise from raw resize
  ctx.imageSmoothingEnabled = true; 
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(image, 0, 0, width, height);

  const imgData = ctx.getImageData(0, 0, width, height);
  const rawPixels = imgData.data;

  // Determine Palette
  let effectivePalette = palette;
  if (effectivePalette.length === 0) {
      const allRGBs: RGB[] = [];
      // Sampling for palette generation
      for (let i = 0; i < rawPixels.length; i += 4) {
          allRGBs.push({ r: rawPixels[i], g: rawPixels[i + 1], b: rawPixels[i + 2] });
      }
      effectivePalette = performQuantization(allRGBs, maxColors);
  }

  // 2. Initial Mapping
  let grid: PixelData[][] = [];

  for (let y = 0; y < height; y++) {
    const row: PixelData[] = [];
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = rawPixels[i];
      const g = rawPixels[i + 1];
      const b = rawPixels[i + 2];
      
      // Increase contrast slightly during mapping
      // (Simple heuristic: push values away from 127)
      // const factor = 1.1;
      // const rC = Math.min(255, Math.max(0, 128 + (r - 128) * factor));
      // ... omitted for now, stick to clean mapping

      const matchedColor = findClosestColor(r, g, b, effectivePalette);
      row.push({ x, y, color: matchedColor });
    }
    grid.push(row);
  }

  // 3. Post-Processing: Denoise / Clean up
  // Run multiple passes to consolidate shapes
  grid = applyDenoising(grid, width, height); // Pass 1
  grid = applyDenoising(grid, width, height); // Pass 2
  
  // 4. Recalculate counts after denoising
  const colorCounts: Record<string, { count: number; color: BeadColor }> = {};
  for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
          const p = grid[y][x];
          if (!colorCounts[p.color.id]) {
              colorCounts[p.color.id] = { count: 0, color: p.color };
          }
          colorCounts[p.color.id].count++;
      }
  }

  return { grid, width, height, colorCounts };
};
