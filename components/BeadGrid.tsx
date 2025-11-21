
import React, { useRef, useEffect, useState, useMemo, useLayoutEffect, forwardRef, useImperativeHandle } from 'react';
import { AnalysisResult, PixelData } from '../types';

export interface BeadGridHandle {
    exportImage: () => void;
}

interface BeadGridProps {
  data: AnalysisResult | null;
  sourceImage: HTMLImageElement | null;
  showOriginal: boolean;
  showGrid: boolean;
  showRulers: boolean;
}

export const BeadGrid = forwardRef<BeadGridHandle, BeadGridProps>(({ data, sourceImage, showOriginal, showGrid, showRulers }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredPixel, setHoveredPixel] = useState<PixelData | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // State to track container size
  const [containerSize, setContainerSize] = useState<{ w: number, h: number }>({ w: 0, h: 0 });
  
  const RULER_SIZE = 25; // Width/Height of the ruler bars

  useImperativeHandle(ref, () => ({
      exportImage: () => {
          if (canvasRef.current) {
              const link = document.createElement('a');
              link.download = `pixelbead-pattern-${Date.now()}.png`;
              link.href = canvasRef.current.toDataURL('image/png');
              link.click();
          }
      }
  }));

  // Use useLayoutEffect to get dimensions immediately before paint to prevent flicker
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    
    const updateSize = () => {
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            setContainerSize(prev => {
                if (prev.w === width && prev.h === height) return prev;
                return { w: width, h: height };
            });
        }
    };

    updateSize();
    
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, [sourceImage]);

  // Calculate scale synchronously based on current data and container size.
  const scale = useMemo(() => {
    if (!data || containerSize.w === 0 || containerSize.h === 0) return 0;
    
    const padding = 40; // Space for shadow/margins
    
    // If rulers are on, we need to reserve space for them within the container
    const rulerOffset = showRulers ? RULER_SIZE : 0;
    
    const availableWidth = containerSize.w - padding - rulerOffset;
    const availableHeight = containerSize.h - padding - rulerOffset;
    
    const scaleX = availableWidth / data.width;
    const scaleY = availableHeight / data.height;
    
    // Fit strictly within the container
    return Math.min(scaleX, scaleY);
  }, [data, containerSize, showRulers]);

  // Drawing Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || scale === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const offset = showRulers ? RULER_SIZE : 0;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Only draw borders if pixels are large enough to justify it
    const drawBorder = showGrid && scale > 3; 
    const borderThickness = Math.max(0.5, scale * 0.05);

    // Font settings for rulers
    if (showRulers) {
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
    }

    // Draw Rulers Background
    if (showRulers) {
        ctx.fillStyle = '#f8fafc'; // Light slate background
        ctx.fillRect(0, 0, canvas.width, RULER_SIZE); // Top Bar
        ctx.fillRect(0, 0, RULER_SIZE, canvas.height); // Left Bar
        
        // Corner fill
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(0, 0, RULER_SIZE, RULER_SIZE);
        
        ctx.fillStyle = '#64748b'; // Text color
        
        // Draw Top Ruler Numbers
        for (let x = 0; x < data.width; x++) {
            // Draw every 5th number, and the first/last one
            if ((x + 1) % 5 === 0 || x === 0) {
                const textX = offset + x * scale + scale / 2;
                // Don't draw if it overlaps with corner
                if (textX > RULER_SIZE) {
                    ctx.fillText(`${x + 1}`, textX, RULER_SIZE / 2);
                    // Tick mark
                    ctx.beginPath();
                    ctx.moveTo(textX, RULER_SIZE - 4);
                    ctx.lineTo(textX, RULER_SIZE);
                    ctx.stroke();
                }
            }
        }

        // Draw Left Ruler Numbers
        for (let y = 0; y < data.height; y++) {
            if ((y + 1) % 5 === 0 || y === 0) {
                const textY = offset + y * scale + scale / 2;
                if (textY > RULER_SIZE) {
                    ctx.fillText(`${y + 1}`, RULER_SIZE / 2, textY);
                    // Tick mark
                    ctx.beginPath();
                    ctx.moveTo(RULER_SIZE - 4, textY);
                    ctx.lineTo(RULER_SIZE, textY);
                    ctx.stroke();
                }
            }
        }
        
        // Draw Ruler Dividing Lines
        ctx.beginPath();
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.moveTo(0, RULER_SIZE);
        ctx.lineTo(canvas.width, RULER_SIZE);
        ctx.moveTo(RULER_SIZE, 0);
        ctx.lineTo(RULER_SIZE, canvas.height);
        ctx.stroke();
    }

    // Draw Grid
    data.grid.forEach((row, y) => {
      row.forEach((pixel, x) => {
        const posX = offset + x * scale;
        const posY = offset + y * scale;
        
        // Fill Square
        ctx.fillStyle = pixel.color.hex;
        // Use slightly overlapping rects to avoid sub-pixel rendering gaps
        ctx.fillRect(posX, posY, Math.ceil(scale), Math.ceil(scale));

        // Draw Border
        if (drawBorder) {
            ctx.strokeStyle = '#000000'; // Black grid lines
            ctx.lineWidth = borderThickness;
            ctx.strokeRect(posX, posY, scale, scale);
        }
      });
    });
  }, [data, scale, showGrid, showRulers]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!data || !canvasRef.current || showOriginal || scale === 0) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ratioX = canvasRef.current.width / rect.width;
    const ratioY = canvasRef.current.height / rect.height;

    const canvasX = x * ratioX;
    const canvasY = y * ratioY;

    const offset = showRulers ? RULER_SIZE : 0;

    // Adjust for ruler offset
    const gridX = Math.floor((canvasX - offset) / scale);
    const gridY = Math.floor((canvasY - offset) / scale);

    if (gridY >= 0 && gridY < data.height && gridX >= 0 && gridX < data.width) {
      setHoveredPixel(data.grid[gridY][gridX]);
      setMousePos({ x: e.clientX, y: e.clientY });
    } else {
      setHoveredPixel(null);
    }
  };

  const handleMouseLeave = () => setHoveredPixel(null);

  // Calculate canvas dimensions including rulers
  const canvasWidth = data ? (data.width * scale) + (showRulers ? RULER_SIZE : 0) : 0;
  const canvasHeight = data ? (data.height * scale) + (showRulers ? RULER_SIZE : 0) : 0;

  return (
    <div 
        ref={containerRef}
        className="relative w-full h-full overflow-hidden flex justify-center items-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-900 p-4"
    >
      <div className="relative shadow-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10">
         {/* Main Canvas for Beads */}
         <canvas
            ref={canvasRef}
            // Setting width/height props ensures DOM updates before paint, preventing flicker/scaling issues
            width={canvasWidth}
            height={canvasHeight}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="cursor-crosshair bg-white block"
            style={{ 
                display: showOriginal ? 'none' : 'block',
                maxWidth: '100%', 
                maxHeight: '100%' 
            }}
        />
        
        {/* Overlay Original Image */}
        {showOriginal && (
            <img 
                src={sourceImage.src} 
                alt="Original"
                className="block object-contain bg-white"
                style={{ 
                    // Try to match the visual size of the grid (excluding rulers for purity, or including if preferred)
                    // Here we match the BEAD area size
                    width: data ? data.width * scale : '100%',
                    height: data ? data.height * scale : '100%',
                    maxWidth: '100%',
                    maxHeight: '100%'
                }}
            />
        )}
      </div>

      {/* Tooltip */}
      {hoveredPixel && !showOriginal && (
        <div
          className="fixed z-50 bg-slate-800 text-white text-xs p-2 rounded shadow-xl border border-slate-600 pointer-events-none flex items-center gap-2"
          style={{ top: mousePos.y + 15, left: mousePos.x + 15 }}
        >
          <div className="w-4 h-4 border border-white/20" style={{ backgroundColor: hoveredPixel.color.hex }}></div>
          <div>
            <div className="font-bold">{hoveredPixel.color.name} ({hoveredPixel.color.id})</div>
            <div className="text-gray-400">坐标: {hoveredPixel.x + 1}, {hoveredPixel.y + 1}</div>
          </div>
        </div>
      )}
    </div>
  );
});
