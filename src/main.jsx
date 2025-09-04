import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';

// Add custom CSS for enhanced styling
const customStyles = `
  .slider-thumb::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #4f46e5;
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .slider-thumb::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
  }
  .slider-thumb::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #4f46e5;
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
  }
  .slider-thumb::-moz-range-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
  }
`;

// Inject custom styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = customStyles;
  document.head.appendChild(styleSheet);
}

const STORAGE_KEY = 'display-lab-config-v1';

const IconBase = ({ children, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>
);
const CopyIcon = ({ className }) => (<IconBase className={className}><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></IconBase>);
const CheckIcon = ({ className }) => (<IconBase className={className}><path d="M20 6 9 17 4 12" /></IconBase>);
const Code2Icon = ({ className }) => (<IconBase className={className}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /><line x1="12" y1="2" x2="12" y2="22" /></IconBase>);
const LayoutIcon = ({ className }) => (<IconBase className={className}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></IconBase>);
const Grid3X3Icon = ({ className }) => (<IconBase className={className}>{[0,1,2].flatMap(r=>[0,1,2].map(c=>(<rect key={`${r}-${c}`} x={3+c*7} y={3+r*7} width="5" height="5" rx="1" />)))}</IconBase>);
const Rows3Icon = ({ className }) => (<IconBase className={className}><rect x="3" y="5" width="18" height="4" rx="1" /><rect x="3" y="10" width="18" height="4" rx="1" /><rect x="3" y="15" width="18" height="4" rx="1" /></IconBase>);

const Section = ({ title, children, icon: Icon, className = "" }) => (
  <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 p-8 ${className}`}>
    <div className="flex items-center gap-4 pb-6 border-b border-slate-200 mb-8">
      {Icon && <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg"><Icon className="w-6 h-6 text-white"/></div>}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <div className="w-12 h-0.5 bg-gradient-to-r from-indigo-500 to-indigo-600 mt-1"></div>
      </div>
    </div>
    {children}
  </div>
);
const Toggle = ({ options, value, onChange }) => (
  <div className="flex flex-wrap gap-3">
    {options.map((opt) => (
      <button 
        key={opt.value} 
        onClick={() => onChange(opt.value)} 
        className={`px-6 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-indigo-500 focus:ring-offset-2 ${
          value === opt.value
            ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-600 shadow-lg shadow-indigo-200/50'
            : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-800 hover:shadow-sm'
        }`}
        aria-pressed={value === opt.value}
        role="radio"
        aria-checked={value === opt.value}
        title={opt.title || opt.label} 
        type="button"
      >
        {opt.label}
      </button>
    ))}
  </div>
);
const Slider = ({ label, value, min=1, max=12, step=1, onChange, suffix='', id }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <label htmlFor={id} className="text-sm font-semibold text-slate-800">{label}</label>
      <div className="text-sm font-mono text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">{value}{suffix}</div>
    </div>
    <div className="relative">
      <input 
        id={id} 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={value} 
        onChange={(e) => onChange(parseInt(e.target.value))} 
        className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-thumb"
        style={{
          background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${((value - min) / (max - min)) * 100}%, #e2e8f0 ${((value - min) / (max - min)) * 100}%, #e2e8f0 100%)`
        }}
      />
    </div>
  </div>
);
const NumberField = ({ label, value, onChange, min=0, max=999, step=1, suffix='', id }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-sm font-semibold text-slate-800">{label}</label>
    <div className="flex items-center gap-3">
      <input 
        id={id} 
        type="number" 
        value={value} 
        min={min} 
        max={max} 
        step={step} 
        onChange={(e) => onChange(parseInt(e.target.value || 0))} 
        className="flex-1 border border-slate-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-200 transition-all duration-200 font-mono text-slate-800"
        aria-describedby={suffix ? `${id}-suffix` : undefined}
      />
      {suffix && <span className="text-slate-500 font-semibold text-sm">{suffix}</span>}
    </div>
  </div>
);
const Select = ({ label, value, onChange, options, id }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-sm font-semibold text-slate-800">{label}</label>
    <select 
      id={id} 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="w-full border border-slate-300 rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-200 transition-all duration-200 text-slate-800 font-medium"
      aria-label={label}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

function CodeBlock({ htmlCode, cssCode, tailwindHtml, onExportCodePen, onExportJSFiddle, onDownloadZip }){
  const [copied, setCopied] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  
  const copy = async (type) => {
    try {
      const map = {
        html: htmlCode,
        css: cssCode,
        tw: tailwindHtml,
        full: `<!-- HTML -->\n${htmlCode}\n\n/* CSS */\n${cssCode}`
      };
      await navigator.clipboard.writeText(map[type]);
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  const handleExport = async (exportFn, type) => {
    setIsExporting(true);
    try {
      await exportFn();
    } finally {
      setTimeout(() => setIsExporting(false), 1000);
    }
  };

  const CodePanel = ({ title, code, type, icon: Icon = Code2Icon }) => (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Icon className="w-4 h-4 text-indigo-600" />
          {title}
        </div>
        <button 
          onClick={() => copy(type)} 
          className={`text-sm px-3 py-1.5 rounded-lg border flex items-center gap-2 transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            copied === type 
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
          }`} 
          type="button"
        >
          {copied === type ? (
            <><CheckIcon className="w-3.5 h-3.5" /> Copied!</>
          ) : (
            <><CopyIcon className="w-3.5 h-3.5" /> Copy</>
          )}
        </button>
      </div>
      <pre className="p-4 text-xs overflow-auto leading-6 bg-slate-900 text-slate-100 font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <CodePanel title="HTML" code={htmlCode} type="html" />
        <CodePanel title="CSS" code={cssCode} type="css" />
      </div>
      
      <CodePanel title="Tailwind HTML" code={tailwindHtml} type="tw" />
      
      <div className="flex flex-wrap gap-3 justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
        <button 
          onClick={() => copy('full')} 
          className={`text-sm px-4 py-2 rounded-lg border flex items-center gap-2 font-medium transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            copied === 'full'
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
          }`} 
          type="button"
        >
          {copied === 'full' ? (
            <><CheckIcon className="w-4 h-4" /> Copied Complete Code!</>
          ) : (
            <><CopyIcon className="w-4 h-4" /> Copy HTML + CSS</>
          )}
        </button>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => handleExport(onExportCodePen, 'codepen')} 
            disabled={isExporting}
            className="text-sm px-4 py-2 rounded-lg border bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium" 
            type="button"
          >
            {isExporting ? 'Exporting...' : 'Export to CodePen'}
          </button>
          <button 
            onClick={() => handleExport(onExportJSFiddle, 'jsfiddle')} 
            disabled={isExporting}
            className="text-sm px-4 py-2 rounded-lg border bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium" 
            type="button"
          >
            {isExporting ? 'Exporting...' : 'Export to JSFiddle'}
          </button>
          <button 
            onClick={() => handleExport(onDownloadZip, 'download')} 
            disabled={isExporting}
            className="text-sm px-4 py-2 rounded-lg border bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium" 
            type="button"
          >
            {isExporting ? 'Downloading...' : 'Download ZIP'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DisplayLab(){
  // Core
  const [display, setDisplay] = useState('flex');
  const [items, setItems] = useState(3);
  // Gaps
  const [gap, setGap] = useState(12);
  const [rowGap, setRowGap] = useState(12);
  const [colGap, setColGap] = useState(12);
  // Flex
  const [flexDirection, setFlexDirection] = useState('row');
  const [flexWrap, setFlexWrap] = useState('nowrap');
  const [justifyContent, setJustifyContent] = useState('flex-start');
  const [alignItems, setAlignItems] = useState('stretch');
  const [alignContentFlex, setAlignContentFlex] = useState('stretch');
  // Grid
  const [gridCols, setGridCols] = useState(3);
  const [gridAutoRows, setGridAutoRows] = useState(120);
  const [alignContentGrid, setAlignContentGrid] = useState('stretch');
  const [justifyContentGrid, setJustifyContentGrid] = useState('stretch');
  const [gridAlignItems, setGridAlignItems] = useState('stretch');
  const [gridJustifyItems, setGridJustifyItems] = useState('stretch');
  const [gridColMode, setGridColMode] = useState('fixed');
  const [gridMinCol, setGridMinCol] = useState(160);
  // Spans
  const [spanColValue, setSpanColValue] = useState(2);
  const [spanRowValue, setSpanRowValue] = useState(2);
  const [spanColIndices, setSpanColIndices] = useState('');
  const [spanRowIndices, setSpanRowIndices] = useState('');
  const [usePerItemSpans, setUsePerItemSpans] = useState(false);
  const [itemSpans, setItemSpans] = useState([{col:1, row:1}, {col:1, row:1}, {col:1, row:1}]);
  // Box visuals
  const [boxMinW, setBoxMinW] = useState(80);
  const [boxMinH, setBoxMinH] = useState(80);
  const [borderRadius, setBorderRadius] = useState(12);
  const [shadow, setShadow] = useState(false);
  const [showIndex, setShowIndex] = useState(true);
  // Background
  const [bgMode, setBgMode] = useState('gradient');
  const [bgFixed, setBgFixed] = useState('#f3f4f6');
  const [bgGrad1, setBgGrad1] = useState('#f9fafb');
  const [bgGrad2, setBgGrad2] = useState('#f3f4f6');
  const [bgAngle, setBgAngle] = useState(180);
  // Preview
  const [viewport, setViewport] = useState('auto');
  // History
  const [history, setHistory] = useState([]);
  const [histIndex, setHistIndex] = useState(-1);
  // Modal
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('presets');
  // Import/Export
  const fileInputRef = useRef(null);
  // Errors
  const [spanColError, setSpanColError] = useState('');
  const [spanRowError, setSpanRowError] = useState('');

  const getState = () => ({
    display, items, gap, rowGap, colGap, flexDirection, flexWrap, justifyContent, alignItems, alignContentFlex,
    gridCols, gridAutoRows, alignContentGrid, justifyContentGrid, gridAlignItems, gridJustifyItems, gridColMode, gridMinCol,
    spanColValue, spanRowValue, spanColIndices, spanRowIndices, usePerItemSpans, itemSpans,
    boxMinW, boxMinH, borderRadius, shadow, showIndex, bgMode, bgFixed, bgGrad1, bgGrad2, bgAngle, viewport
  });

  const applyState = (s) => {
    if (!s) return;
    setDisplay(s.display); setItems(s.items); setGap(s.gap); setRowGap(s.rowGap); setColGap(s.colGap);
    setFlexDirection(s.flexDirection); setFlexWrap(s.flexWrap); setJustifyContent(s.justifyContent);
    setAlignItems(s.alignItems); setAlignContentFlex(s.alignContentFlex); setGridCols(s.gridCols);
    setGridAutoRows(s.gridAutoRows); setAlignContentGrid(s.alignContentGrid); setJustifyContentGrid(s.justifyContentGrid);
    setGridAlignItems(s.gridAlignItems); setGridJustifyItems(s.gridJustifyItems); setGridColMode(s.gridColMode);
    setGridMinCol(s.gridMinCol); setSpanColValue(s.spanColValue); setSpanRowValue(s.spanRowValue);
    setSpanColIndices(s.spanColIndices); setSpanRowIndices(s.spanRowIndices); setUsePerItemSpans(s.usePerItemSpans);
    setItemSpans(s.itemSpans); setBoxMinW(s.boxMinW); setBoxMinH(s.boxMinH); setBorderRadius(s.borderRadius);
    setShadow(s.shadow); setShowIndex(s.showIndex); setBgMode(s.bgMode); setBgFixed(s.bgFixed);
    setBgGrad1(s.bgGrad1); setBgGrad2(s.bgGrad2); setBgAngle(s.bgAngle); setViewport(s.viewport);
  };

  // Load from storage
  useEffect(() => {
    try {
      const str = localStorage.getItem(STORAGE_KEY);
      if (str) applyState(JSON.parse(str));
    } catch {}
  }, []);

  // Persist + history
  const stateJSON = JSON.stringify(getState());
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, stateJSON);
    } catch {}
    const prev = history[histIndex];
    if (!prev || JSON.stringify(prev) !== stateJSON) {
      const next = [...history.slice(0, histIndex + 1), JSON.parse(stateJSON)];
      if (next.length > 50) next.shift();
      setHistory(next);
      setHistIndex(next.length - 1);
    }
  }, [stateJSON]);

  const undo = () => {
    if (histIndex > 0) {
      const idx = histIndex - 1;
      applyState(history[idx]);
      setHistIndex(idx);
    }
  };
  const redo = () => {
    if (histIndex < history.length - 1) {
      const idx = histIndex + 1;
      applyState(history[idx]);
      setHistIndex(idx);
    }
  };

  // Sync items length with per-item spans
  useEffect(() => {
    setItemSpans(prev => {
      const a = prev.slice(0, items);
      while (a.length < items) a.push({ col: 1, row: 1 });
      return a;
    });
  }, [items]);

  // Resets
  const resetDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    applyState({
      display: 'flex', items: 3, gap: 12, rowGap: 12, colGap: 12, flexDirection: 'row', flexWrap: 'nowrap',
      justifyContent: 'flex-start', alignItems: 'stretch', alignContentFlex: 'stretch',
      gridCols: 3, gridAutoRows: 120, alignContentGrid: 'stretch', justifyContentGrid: 'stretch',
      gridAlignItems: 'stretch', gridJustifyItems: 'stretch', gridColMode: 'fixed', gridMinCol: 160,
      spanColValue: 2, spanRowValue: 2, spanColIndices: '', spanRowIndices: '', usePerItemSpans: false,
      itemSpans: [{ col: 1, row: 1 }, { col: 1, row: 1 }, { col: 1, row: 1 }],
      boxMinW: 80, boxMinH: 80, borderRadius: 12, shadow: false, showIndex: true,
      bgMode: 'gradient', bgFixed: '#f3f4f6', bgGrad1: '#f9fafb', bgGrad2: '#f3f4f6', bgAngle: 180, viewport: 'auto'
    });
  };

  // Tips
  const tips = useMemo(() => {
    const t = [];
    if (display === 'flex') {
      if (flexWrap === 'nowrap' && alignContentFlex !== 'stretch') {
        t.push('align-content သက်ရောက်ရန် flex-wrap ကို wrap ပြောင်းပါ');
      }
    }
    if (display === 'grid') {
      if ((alignContentGrid !== 'stretch' || justifyContentGrid !== 'stretch')) {
        t.push('align/justify-content သက်ရောက်ရန် container ထဲတွင် အာကာသလိုအပ်');
      }
      if ((gridAlignItems !== 'stretch' || gridJustifyItems !== 'stretch')) {
        t.push('align/justify-items သက်ရောက်ရန် cell > item အချိုးချိုင့်စမ်းပါ');
      }
    }
    return t;
  }, [display, flexWrap, alignContentFlex, alignContentGrid, justifyContentGrid, gridAlignItems, gridJustifyItems]);

  const parseIndices = (s, setError) => {
    const trimmed = (s || '').trim();
    if (!trimmed) {
      setError('');
      return [];
    }
    const nums = trimmed.split(',').map(x => parseInt(x.trim(), 10));
    const valid = nums.filter(n => Number.isFinite(n) && n >= 1 && n <= items);
    const invalidCount = nums.length - valid.length;
    if (invalidCount > 0 || nums.some(isNaN)) {
      setError(`Invalid indices: ${invalidCount} invalid entries. Use comma-separated numbers between 1 and ${items}.`);
    } else {
      setError('');
    }
    return valid;
  };

  const colorForIndex = (i) => `hsl(${(i * 47) % 360} 70% 75%)`;
  const backgroundForIndex = (i) => bgMode === 'fixed' ? bgFixed : (bgMode === 'gradient' ? `linear-gradient(${bgAngle}deg, ${bgGrad1}, ${bgGrad2})` : colorForIndex(i + 1));

  useEffect(() => {
    if (display === 'grid') {
      setFlexDirection('row');
      setFlexWrap('nowrap');
      setJustifyContent('flex-start');
      setAlignItems('stretch');
      setAlignContentFlex('stretch');
    }
  }, [display]);

  const containerStyle = useMemo(() => {
    const s = {
      display,
      padding: '12px',
      borderRadius: '16px',
      minHeight: '200px',
      background: '#ffffff',
      border: '1px solid #e5e7eb',
    };
    if (display === 'flex') {
      Object.assign(s, {
        gap: `${gap}px`,
        flexDirection,
        flexWrap,
        justifyContent,
        alignItems,
        alignContent: alignContentFlex,
      });
    }
    if (display === 'grid') {
      const columns = gridColMode === 'fixed' ? `repeat(${gridCols}, minmax(0, 1fr))` : `repeat(${gridColMode}, minmax(${gridMinCol}px, 1fr))`;
      Object.assign(s, {
        gridTemplateColumns: columns,
        gridAutoRows: `${gridAutoRows}px`,
        rowGap: `${rowGap}px`,
        columnGap: `${colGap}px`,
        alignContent: alignContentGrid,
        justifyContent: justifyContentGrid,
        alignItems: gridAlignItems,
        justifyItems: gridJustifyItems,
      });
    }
    return s;
  }, [display, gap, flexDirection, flexWrap, justifyContent, alignItems, alignContentFlex, gridCols, gridColMode, gridMinCol, gridAutoRows, rowGap, colGap, alignContentGrid, justifyContentGrid, gridAlignItems, gridJustifyItems]);

  const viewportWidth = useMemo(() => {
    switch (viewport) {
      case 'iphone': return 375;
      case 'tablet': return 768;
      case 'desktop': return 1200;
      default: return '100%';
    }
  }, [viewport]);

  const boxBaseStyle = useMemo(() => ({
    minWidth: `${boxMinW}px`,
    minHeight: `${boxMinH}px`,
    borderRadius: `${borderRadius}px`,
    border: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    boxShadow: shadow ? '0 8px 24px rgba(2,6,23,0.08), 0 2px 6px rgba(2,6,23,0.06)' : 'none',
  }), [boxMinW, boxMinH, borderRadius, shadow]);

  const htmlCode = useMemo(() => {
    const boxes = Array.from({ length: items }).map((_, i) => {
      const idx = i + 1;
      const rs = bgMode === 'random' ? ` style="--box-bg: ${colorForIndex(idx)};"` : '';
      return `  <div class="box"${rs}>${showIndex ? `Box ${idx}` : ''}</div>`;
    }).join('\n');
    return `<div class="playground">\n${boxes}\n</div>`;
  }, [items, showIndex, bgMode]);

  const cssCode = useMemo(() => {
    const lines = [`.playground {`];
    if (display === 'flex') {
      lines.push(
        `  display: flex;`,
        `  gap: ${gap}px;`,
        `  flex-direction: ${flexDirection};`,
        `  flex-wrap: ${flexWrap};`,
        `  justify-content: ${justifyContent};`,
        `  align-items: ${alignItems};`,
        `  align-content: ${alignContentFlex};`
      );
    } else if (display === 'grid') {
      const columns = gridColMode === 'fixed' ? `repeat(${gridCols}, minmax(0, 1fr))` : `repeat(${gridColMode}, minmax(${gridMinCol}px, 1fr))`;
      lines.push(
        `  display: grid;`,
        `  grid-template-columns: ${columns};`,
        `  grid-auto-rows: ${gridAutoRows}px;`,
        `  row-gap: ${rowGap}px;`,
        `  column-gap: ${colGap}px;`,
        `  align-content: ${alignContentGrid};`,
        `  justify-content: ${justifyContentGrid};`,
        `  align-items: ${gridAlignItems};`,
        `  justify-items: ${gridJustifyItems};`
      );
    } else {
      lines.push(`  display: ${display};`);
    }
    lines.push(`}`);
    const backgroundCSS = bgMode === 'fixed' ? `  background: ${bgFixed};` : (bgMode === 'gradient' ? `  background: linear-gradient(${bgAngle}deg, ${bgGrad1}, ${bgGrad2});` : `  background: var(--box-bg, ${bgFixed});`);
    const boxCss = [
      `.box {`,
      `  min-width: ${boxMinW}px;`,
      `  min-height: ${boxMinH}px;`,
      `  border-radius: ${borderRadius}px;`,
      `  border: 1px solid #e5e7eb;`,
      `  display: flex;`,
      `  align-items: center;`,
      `  justify-content: center;`,
      backgroundCSS,
      shadow ? `  box-shadow: 0 8px 24px rgba(2,6,23,0.08), 0 2px 6px rgba(2,6,23,0.06);` : '',
      `}`
    ].filter(Boolean);
    const spanCss = [];
    if (display === 'grid') {
      if (usePerItemSpans) {
        itemSpans.forEach((sp, i) => {
          const idx = i + 1;
          if (sp.col > 1) spanCss.push(`.playground > .box:nth-child(${idx}) { grid-column: span ${sp.col}; }`);
          if (sp.row > 1) spanCss.push(`.playground > .box:nth-child(${idx}) { grid-row: span ${sp.row}; }`);
        });
      } else {
        parseIndices(spanColIndices, setSpanColError).forEach(n => spanCss.push(`.playground > .box:nth-child(${n}) { grid-column: span ${spanColValue}; }`));
        parseIndices(spanRowIndices, setSpanRowError).forEach(n => spanCss.push(`.playground > .box:nth-child(${n}) { grid-row: span ${spanRowValue}; }`));
      }
    }
    return [...lines, '', ...boxCss, ...(spanCss.length ? ['', ...spanCss] : [])].join('\n');
  }, [display, gap, flexDirection, flexWrap, justifyContent, alignItems, alignContentFlex, gridCols, gridColMode, gridMinCol, gridAutoRows, rowGap, colGap, alignContentGrid, justifyContentGrid, gridAlignItems, gridJustifyItems, boxMinW, boxMinH, borderRadius, shadow, bgMode, bgFixed, bgGrad1, bgGrad2, bgAngle, usePerItemSpans, itemSpans, spanColIndices, spanRowIndices, spanColValue, spanRowValue]);

  const tailwindHtml = useMemo(() => {
    const container = [];
    if (display === 'flex') {
      container.push('flex', `gap-[${gap}px]`, 
        flexDirection === 'row' ? 'flex-row' : flexDirection === 'row-reverse' ? 'flex-row-reverse' : flexDirection === 'column' ? 'flex-col' : 'flex-col-reverse',
        flexWrap === 'nowrap' ? 'flex-nowrap' : flexWrap === 'wrap' ? 'flex-wrap' : 'flex-wrap-reverse');
      const jx = { 'flex-start': 'justify-start', center: 'justify-center', 'flex-end': 'justify-end', 'space-between': 'justify-between', 'space-around': 'justify-around', 'space-evenly': 'justify-evenly' };
      container.push(jx[justifyContent] || `justify-[${justifyContent}]`);
      const ax = { stretch: 'items-stretch', 'flex-start': 'items-start', center: 'items-center', 'flex-end': 'items-end', baseline: 'items-baseline' };
      container.push(ax[alignItems] || `items-[${alignItems}]`);
      const cx = { stretch: 'content-stretch', 'flex-start': 'content-start', center: 'content-center', 'flex-end': 'content-end', 'space-between': 'content-between', 'space-around': 'content-around', 'space-evenly': 'content-evenly' };
      container.push(cx[alignContentFlex] || `content-[${alignContentFlex}]`);
    } else if (display === 'grid') {
      container.push('grid');
      if (gridColMode === 'fixed' && gridCols >= 1 && gridCols <= 12) container.push(`grid-cols-${gridCols}`);
      else container.push(`grid-cols-[repeat(${gridColMode},minmax(${gridMinCol}px,1fr))]`);
      container.push(`[grid-auto-rows:${gridAutoRows}px]`, `gap-y-[${rowGap}px]`, `gap-x-[${colGap}px]`);
      const cc = { stretch: 'content-stretch', start: 'content-start', center: 'content-center', end: 'content-end', 'space-between': 'content-between', 'space-around': 'content-around', 'space-evenly': 'content-evenly' };
      container.push(cc[alignContentGrid] || `content-[${alignContentGrid}]`);
      const jc = { stretch: 'justify-stretch', start: 'justify-start', center: 'justify-center', end: 'justify-end', 'space-between': 'justify-between', 'space-around': 'justify-around', 'space-evenly': 'justify-evenly' };
      container.push(jc[justifyContentGrid] || `justify-[${justifyContentGrid}]`);
      const ia = { stretch: 'items-stretch', start: 'items-start', center: 'items-center', end: 'items-end' };
      container.push(ia[gridAlignItems] || `items-[${gridAlignItems}]`);
      const ij = { stretch: 'justify-items-stretch', start: 'justify-items-start', center: 'justify-items-center', end: 'justify-items-end' };
      container.push(ij[gridJustifyItems] || `justify-items-[${gridJustifyItems}]`);
    } else {
      container.push(`[display:${display}]`);
    }
    const box = [`min-w-[${boxMinW}px]`, `min-h-[${boxMinH}px]`, `rounded-[${borderRadius}px]`, 'border', 'border-gray-200', 'flex', 'items-center', 'justify-center'];
    if (shadow) box.push('shadow');
    const boxes = Array.from({ length: items }).map((_, i) => {
      const idx = i + 1;
      const extra = [];
      if (display === 'grid') {
        if (usePerItemSpans) {
          const sp = itemSpans[i] || { col: 1, row: 1 };
          if (sp.col > 1) extra.push(`[grid-column:span_${sp.col}]`);
          if (sp.row > 1) extra.push(`[grid-row:span_${sp.row}]`);
        } else {
          if (parseIndices(spanColIndices, setSpanColError).includes(idx)) extra.push(`[grid-column:span_${spanColValue}]`);
          if (parseIndices(spanRowIndices, setSpanRowError).includes(idx)) extra.push(`[grid-row:span_${spanRowValue}]`);
        }
      }
      return `  <div class="box ${box.concat(extra).join(' ')}" style="background:${backgroundForIndex(i)}">${showIndex ? `Box ${idx}` : ''}</div>`;
    }).join('\n');
    return `<div class="playground ${container.join(' ')}">\n${boxes}\n</div>`;
  }, [display, gap, flexDirection, flexWrap, justifyContent, alignItems, alignContentFlex, gridCols, gridColMode, gridMinCol, gridAutoRows, rowGap, colGap, alignContentGrid, justifyContentGrid, gridAlignItems, gridJustifyItems, items, boxMinW, boxMinH, borderRadius, shadow, showIndex, spanColIndices, spanRowIndices, spanColValue, spanRowValue, usePerItemSpans, itemSpans, bgMode, bgFixed, bgGrad1, bgGrad2, bgAngle]);

  const exportToCodePen = () => {
    const data = { title: 'Display‑Lab', html: htmlCode, css: cssCode, editors: '110', layout: 'left' };
    const f = document.createElement('form');
    f.method = 'POST';
    f.action = 'https://codepen.io/pen/define';
    f.target = '_blank';
    const i = document.createElement('input');
    i.type = 'hidden';
    i.name = 'data';
    i.value = JSON.stringify(data);
    f.appendChild(i);
    document.body.appendChild(f);
    f.submit();
    document.body.removeChild(f);
  };

  const exportToJSFiddle = () => {
    const f = document.createElement('form');
    f.method = 'POST';
    f.action = 'https://jsfiddle.net/api/post/library/pure/';
    f.target = '_blank';
    const add = (n, v) => {
      const t = document.createElement('textarea');
      t.name = n;
      t.value = v;
      f.appendChild(t);
    };
    add('title', 'Display‑Lab');
    add('html', htmlCode);
    add('css', cssCode);
    document.body.appendChild(f);
    f.submit();
    document.body.removeChild(f);
  };

  const downloadZip = async () => {
    if (!window.JSZip) {
      try {
        await new Promise((res, rej) => {
          const s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
          s.onload = res;
          s.onerror = rej;
          document.head.appendChild(s);
        });
      } catch (e) {
        alert('Failed to load JSZip for ZIP download.');
        return;
      }
    }
    const zip = new window.JSZip();
    const html = `<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8"/>\n  <meta name="viewport" content="width=device-width, initial-scale=1"/>\n  <title>Display‑Lab Export</title>\n  <link rel="stylesheet" href="./styles.css"/>\n</head>\n<body style="padding:24px;background:#f8fafc;color:#0f172a">\n${htmlCode}\n</body>\n</html>`;
    zip.file('index.html', html);
    zip.file('styles.css', cssCode);
    const blob = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'display-lab.zip';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const exportConfig = () => {
    const s = stateJSON;
    const blob = new Blob([s], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'display-lab-config.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importConfig = () => fileInputRef.current?.click();

  const onImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const s = JSON.parse(String(r.result || '{}'));
        applyState(s);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
      } catch {
        alert('Invalid config file.');
      }
      e.target.value = '';
    };
    r.readAsText(file);
  };

  // Modal UX
  const modalRef = useRef(null);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) {
      modalRef.current?.focus();
    }
  }, [open]);

  const spanColSet = useMemo(() => new Set(parseIndices(spanColIndices, setSpanColError)), [spanColIndices, items]);
  const spanRowSet = useMemo(() => new Set(parseIndices(spanRowIndices, setSpanRowError)), [spanRowIndices, items]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-indigo-600 text-white px-4 py-2 rounded-lg z-50 focus:outline-none focus:ring-3 focus:ring-indigo-300"
      >
        Skip to main content
      </a>
      
      <div className="max-w-1xl mx-2 p-6 lg:p-8 space-y-8" role="main" id="main-content">
        <header className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg">
                <LayoutIcon className="w-6 h-6"/>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent leading-tight">Css-Labs</h1>
                <p className="text-base text-slate-600 font-medium mt-1">Interactive CSS Layout Playground</p>
              </div>
            </div>  
            <div className="flex flex-wrap gap-3 items-center">
              <button 
                type="button" 
                onClick={() => setOpen(true)} 
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold shadow-lg shadow-indigo-200/50 hover:from-indigo-700 hover:to-indigo-800 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
              >
                Settings
              </button>
              <button 
                type="button" 
                onClick={undo} 
                disabled={histIndex <= 0} 
                className="px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-400 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
              >
                Undo
              </button>
              <button 
                type="button" 
                onClick={redo} 
                disabled={histIndex >= history.length - 1} 
                className="px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-400 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
              >
                Redo
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Main Preview Area */}
          <div className="xl:col-span-8 space-y-8">
            <Section title="Live Preview" icon={LayoutIcon} className="bg-gradient-to-b from-white to-slate-50">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold text-slate-800">Preview Viewport</div>
                  <div className="text-xs text-slate-500 hidden sm:block">Choose screen size simulation</div>
                </div>
                <Toggle 
                  value={viewport} 
                  onChange={setViewport} 
                  options={[
                    { label: 'Auto', value: 'auto' },
                    { label: 'Mobile', value: 'iphone' },
                    { label: 'Tablet', value: 'tablet' },
                    { label: 'Desktop', value: 'desktop' }
                  ]} 
                />
              </div>
              
              <div className="p-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl border border-slate-300">
                <div className="flex justify-center">
                  <div 
                    className="border-2 border-slate-400 rounded-xl bg-white shadow-2xl overflow-hidden transition-all duration-300" 
                    style={{ width: viewportWidth, maxWidth: '100%', minWidth: '320px' }}
                  >
                    <div className="bg-slate-300 px-4 py-2 text-xs text-slate-700 font-semibold border-b-2 border-slate-400 flex justify-between items-center">
                      <span>{viewport === 'auto' ? 'Responsive' : `${viewportWidth}px`}</span>
                      <span className="text-slate-600">{display.toUpperCase()} Layout</span>
                    </div>
                  <div style={containerStyle}>
                    {Array.from({ length: items }).map((_, i) => {
                      const idx = i + 1;
                      const style = { 
                        ...boxBaseStyle, 
                        background: backgroundForIndex(i),
                        transition: 'all 0.3s ease',
                        cursor: 'default'
                      };
                      if (display === 'grid') {
                        if (usePerItemSpans) {
                          const sp = itemSpans[i] || { col: 1, row: 1 };
                          if (sp.col > 1) style.gridColumn = `span ${sp.col}`;
                          if (sp.row > 1) style.gridRow = `span ${sp.row}`;
                        } else {
                          if (spanColSet.has(idx)) style.gridColumn = `span ${spanColValue}`;
                          if (spanRowSet.has(idx)) style.gridRow = `span ${spanRowValue}`;
                        }
                      }
                      return (
                        <div 
                          key={i} 
                          style={style}
                          className="hover:scale-105 transition-transform duration-200"
                        >
                          {showIndex ? (
                            <div className="text-center">
                              <div className="font-semibold text-slate-800">Box {idx}</div>
                              {display === 'grid' && (spanColSet.has(idx) || spanRowSet.has(idx) || (usePerItemSpans && (itemSpans[i]?.col > 1 || itemSpans[i]?.row > 1))) && (
                                <div className="text-xs text-slate-600 mt-1">
                                  {usePerItemSpans 
                                    ? `${itemSpans[i]?.col || 1}×${itemSpans[i]?.row || 1}`
                                    : `${spanColSet.has(idx) ? spanColValue : 1}×${spanRowSet.has(idx) ? spanRowValue : 1}`
                                  }
                                </div>
                              )}
                            </div>
                          ) : ''}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-1 h-1 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <div className="text-sm text-slate-700">
                    <span className="font-semibold text-slate-800">Pro Tip:</span> 
                    <span>Use the settings panel to experiment with different CSS properties. All changes are applied instantly to help you understand layout behavior.</span>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
          </Section>
          
          <Section title="Generated Code" icon={Code2Icon} className="bg-gradient-to-b from-white to-slate-50">
            <CodeBlock htmlCode={htmlCode} cssCode={cssCode} tailwindHtml={tailwindHtml} onExportCodePen={exportToCodePen} onExportJSFiddle={exportToJSFiddle} onDownloadZip={downloadZip} />
          </Section>
        </div>
        
        {/* Quick Controls Sidebar */}
        <div className="xl:col-span-4 space-y-6">
          <Section title="Quick Controls" className="bg-gradient-to-b from-white to-slate-50 sticky top-8">
            <div className="space-y-6">
              {/* Display Mode */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-3">Display Mode</label>
                <Toggle value={display} onChange={setDisplay} options={[
                  { label: 'Flex', value: 'flex' },
                  { label: 'Grid', value: 'grid' },
                  { label: 'Block', value: 'block' }
                ]} />
              </div>
              
              {/* Items Count */}
              <Slider 
                id="quick-items-slider" 
                label="Number of Items" 
                value={items} 
                min={1} 
                max={12} 
                onChange={setItems} 
              />
              
              {/* Gap Control */}
              {display !== 'grid' ? (
                <NumberField 
                  id="quick-gap-input" 
                  label="Gap" 
                  value={gap} 
                  onChange={setGap} 
                  min={0} 
                  max={64} 
                  step={4} 
                  suffix="px" 
                />
              ) : (
                <>
                  <NumberField 
                    id="quick-row-gap-input" 
                    label="Row Gap" 
                    value={rowGap} 
                    onChange={setRowGap} 
                    min={0} 
                    max={64} 
                    step={4} 
                    suffix="px" 
                  />
                  <NumberField 
                    id="quick-col-gap-input" 
                    label="Column Gap" 
                    value={colGap} 
                    onChange={setColGap} 
                    min={0} 
                    max={64} 
                    step={4} 
                    suffix="px" 
                  />
                </>
              )}
              
              {/* Flex Controls */}
              {display === 'flex' && (
                <>
                  <Select 
                    id="quick-justify-select" 
                    label="Justify Content" 
                    value={justifyContent} 
                    onChange={setJustifyContent} 
                    options={[
                      { label: 'Start', value: 'flex-start' },
                      { label: 'Center', value: 'center' },
                      { label: 'End', value: 'flex-end' },
                      { label: 'Space Between', value: 'space-between' },
                      { label: 'Space Around', value: 'space-around' },
                      { label: 'Space Evenly', value: 'space-evenly' }
                    ]} 
                  />
                  <Select 
                    id="quick-align-select" 
                    label="Align Items" 
                    value={alignItems} 
                    onChange={setAlignItems} 
                    options={[
                      { label: 'Stretch', value: 'stretch' },
                      { label: 'Start', value: 'flex-start' },
                      { label: 'Center', value: 'center' },
                      { label: 'End', value: 'flex-end' },
                      { label: 'Baseline', value: 'baseline' }
                    ]} 
                  />
                </>
              )}
              
              {/* Grid Controls */}
              {display === 'grid' && (
                <>
                  <Slider 
                    id="quick-grid-cols-slider" 
                    label="Grid Columns" 
                    value={gridCols} 
                    min={1} 
                    max={6} 
                    onChange={setGridCols} 
                  />
                  <NumberField 
                    id="quick-row-height-input" 
                    label="Row Height" 
                    value={gridAutoRows} 
                    onChange={setGridAutoRows} 
                    min={60} 
                    max={200} 
                    step={10} 
                    suffix="px" 
                  />
                </>
              )}
              
              {/* Advanced Settings Button */}
              <div className="pt-4 border-t border-slate-200">
                <button 
                  onClick={() => setOpen(true)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold rounded-lg shadow-lg shadow-slate-200 hover:from-slate-700 hover:to-slate-800 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Advanced Settings
                </button>
              </div>
            </div>
          </Section>
        </div>
      </div>

        <footer className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200">
                <LayoutIcon className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-semibold text-slate-800">Css-Labs</p>
                <p className="text-xs text-slate-600">Made for learning CSS layouts</p>
              </div>
            </div>
            
            <div className="text-center sm:text-right">
              <p className="text-xs text-slate-600">
                © 2025 Created by 
                <a 
                  href="https://arkaryan.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 font-semibold ml-1 transition-colors"
                >
                  Arkar Yan
                </a>
              </p>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Open Source Educational Tool
              </p>
            </div>
          </div>
        </footer>

        {/* Settings Modal */}
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="settings-title">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden="true" />
            <div ref={modalRef} tabIndex={-1} className="relative w-full max-w-6xl max-h-[90vh] rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden focus:outline-none transform transition-all duration-300">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-white to-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg">
                    <LayoutIcon className="w-5 h-5"/>
                  </div>
                  <div>
                    <div id="settings-title" className="font-bold text-xl text-slate-800">Settings</div>
                    <div className="text-sm text-slate-600">Configure your layout playground</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    type="button" 
                    onClick={undo} 
                    disabled={histIndex <= 0} 
                    className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-400 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    Undo
                  </button>
                  <button 
                    type="button" 
                    onClick={redo} 
                    disabled={histIndex >= history.length - 1} 
                    className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-400 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    Redo
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setOpen(false)} 
                    className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-400 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>

                {/* Tabs */}
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                  <div className="flex flex-wrap gap-2">
                    {[
                      ['presets', 'Presets'],
                      ['display', 'Display'],
                      ['common', 'Common'],
                      ['flex', 'Flexbox'],
                      ['grid', 'Grid'],
                      ['spans', 'Grid Spans'],
                      ['box', 'Styling'],
                      ['responsive', 'Responsive'],
                      ['tips', 'Tips'],
                    ].map(([key, label]) => (
                      <button 
                        key={key} 
                        onClick={() => setTab(key)} 
                        className={`px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                          tab === key 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200/50' 
                            : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-800'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[60vh] overflow-auto space-y-6 bg-gradient-to-b from-white to-slate-50">
                  {tab === 'presets' && (
                    <Section title="Presets" icon={Rows3Icon}>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { name: 'Flex row basic', apply: () => applyState({ ...getState(), display: 'flex', items: 5, gap: 12, flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'flex-start', alignItems: 'center', alignContentFlex: 'stretch' }) },
                          { name: 'Flex wrap center', apply: () => applyState({ ...getState(), display: 'flex', items: 12, flexWrap: 'wrap', justifyContent: 'center', alignContentFlex: 'center', boxMinW: 120 }) },
                          { name: 'Grid 3 cols', apply: () => applyState({ ...getState(), display: 'grid', gridColMode: 'fixed', gridCols: 3, gridAutoRows: 120, rowGap: 12, colGap: 12, items: 9 }) },
                          { name: 'Grid auto-fit cards', apply: () => applyState({ ...getState(), display: 'grid', gridColMode: 'auto-fit', gridMinCol: 180, gridAutoRows: 160, rowGap: 12, colGap: 12, items: 12 }) },
                        ].map(p => (<button key={p.name} type="button" onClick={p.apply} className="text-sm px-4 py-2 rounded-md border focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">{p.name}</button>))}
                      </div>
                    </Section>
                  )}

                  {tab === 'display' && (
                    <Section title="Display Mode" icon={Rows3Icon}>
                      <Toggle value={display} onChange={setDisplay} options={[{ label: 'block', value: 'block' }, { label: 'inline', value: 'inline' }, { label: 'inline-block', value: 'inline-block' }, { label: 'flex', value: 'flex' }, { label: 'grid', value: 'grid' }]} />
                    </Section>
                  )}

                  {tab === 'common' && (
                    <Section title="Common Options">
                      <div className="space-y-3">
                        <Slider id="items-slider" label="Items (boxes)" value={items} min={1} max={48} onChange={setItems} />
                        {display !== 'grid' ? (
                          <NumberField id="gap-input" label="Gap" value={gap} onChange={setGap} min={0} max={64} step={2} suffix="px" />
                        ) : (
                          <>
                            <NumberField id="row-gap-input" label="Row gap" value={rowGap} onChange={setRowGap} min={0} max={64} step={2} suffix="px" />
                            <NumberField id="col-gap-input" label="Column gap" value={colGap} onChange={setColGap} min={0} max={64} step={2} suffix="px" />
                          </>
                        )}
                        <NumberField id="box-min-w-input" label="Box min‑width" value={boxMinW} onChange={setBoxMinW} min={20} max={300} step={10} suffix="px" />
                        <NumberField id="box-min-h-input" label="Box min‑height" value={boxMinH} onChange={setBoxMinH} min={20} max={300} step={10} suffix="px" />
                        <Slider id="border-radius-slider" label="Border radius" value={borderRadius} min={0} max={32} step={1} onChange={setBorderRadius} suffix="px" />
                        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={shadow} onChange={(e) => setShadow(e.target.checked)} />Box shadow</label>
                        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showIndex} onChange={(e) => setShowIndex(e.target.checked)} />Label boxes (Box 1, Box 2, ...)</label>
                      </div>
                    </Section>
                  )}

                  {tab === 'flex' && display === 'flex' && (
                    <Section title="Flex Options" icon={LayoutIcon}>
                      <div className="space-y-2">
                        <Select id="flex-direction-select" label="flex-direction" value={flexDirection} onChange={setFlexDirection} options={[{ label: 'row', value: 'row' }, { label: 'row-reverse', value: 'row-reverse' }, { label: 'column', value: 'column' }, { label: 'column-reverse', value: 'column-reverse' }]} />
                        <Select id="flex-wrap-select" label="flex-wrap" value={flexWrap} onChange={setFlexWrap} options={[{ label: 'nowrap', value: 'nowrap' }, { label: 'wrap', value: 'wrap' }, { label: 'wrap-reverse', value: 'wrap-reverse' }]} />
                        <Select id="justify-content-select" label="justify-content" value={justifyContent} onChange={setJustifyContent} options={[{ label: 'flex-start', value: 'flex-start' }, { label: 'center', value: 'center' }, { label: 'flex-end', value: 'flex-end' }, { label: 'space-between', value: 'space-between' }, { label: 'space-around', value: 'space-around' }, { label: 'space-evenly', value: 'space-evenly' }]} />
                        <Select id="align-items-select" label="align-items" value={alignItems} onChange={setAlignItems} options={[{ label: 'stretch', value: 'stretch' }, { label: 'flex-start', value: 'flex-start' }, { label: 'center', value: 'center' }, { label: 'flex-end', value: 'flex-end' }, { label: 'baseline', value: 'baseline' }]} />
                        <Select id="align-content-select" label="align-content" value={alignContentFlex} onChange={setAlignContentFlex} options={[{ label: 'stretch', value: 'stretch' }, { label: 'flex-start', value: 'flex-start' }, { label: 'center', value: 'center' }, { label: 'flex-end', value: 'flex-end' }, { label: 'space-between', value: 'space-between' }, { label: 'space-around', value: 'space-around' }, { label: 'space-evenly', value: 'space-evenly' }]} />
                      </div>
                    </Section>
                  )}

                  {tab === 'grid' && display === 'grid' && (
                    <Section title="Grid Options" icon={Grid3X3Icon}>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-sm"><span className="w-40 text-gray-600">Columns mode</span><div className="flex gap-2"><button type="button" onClick={() => setGridColMode('fixed')} className={`px-4 py-2 rounded-full text-sm border focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 ${gridColMode === 'fixed' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}`}>Fixed</button><button type="button" onClick={() => setGridColMode('auto-fit')} className={`px-4 py-2 rounded-full text-sm border focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 ${gridColMode === 'auto-fit' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}`}>auto-fit</button><button type="button" onClick={() => setGridColMode('auto-fill')} className={`px-4 py-2 rounded-full text-sm border focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 ${gridColMode === 'auto-fill' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}`}>auto-fill</button></div></div>
                        {gridColMode === 'fixed' ? (
                          <Slider id="grid-cols-slider" label="Columns" value={gridCols} min={1} max={12} onChange={setGridCols} />
                        ) : (
                          <NumberField id="grid-min-col-input" label="Min column width" value={gridMinCol} onChange={setGridMinCol} min={80} max={400} step={10} suffix="px" />
                        )}
                        <NumberField id="grid-auto-rows-input" label="Row height (auto-rows)" value={gridAutoRows} onChange={setGridAutoRows} min={40} max={300} step={10} suffix="px" />
                        <Select id="align-content-grid-select" label="align-content" value={alignContentGrid} onChange={setAlignContentGrid} options={[{ label: 'stretch', value: 'stretch' }, { label: 'start', value: 'start' }, { label: 'center', value: 'center' }, { label: 'end', value: 'end' }, { label: 'space-between', value: 'space-between' }, { label: 'space-around', value: 'space-around' }, { label: 'space-evenly', value: 'space-evenly' }]} />
                        <Select id="justify-content-grid-select" label="justify-content" value={justifyContentGrid} onChange={setJustifyContentGrid} options={[{ label: 'stretch', value: 'stretch' }, { label: 'start', value: 'start' }, { label: 'center', value: 'center' }, { label: 'end', value: 'end' }, { label: 'space-between', value: 'space-between' }, { label: 'space-around', value: 'space-around' }, { label: 'space-evenly', value: 'space-evenly' }]} />
                        <Select id="align-items-grid-select" label="align-items" value={gridAlignItems} onChange={setGridAlignItems} options={[{ label: 'stretch', value: 'stretch' }, { label: 'start', value: 'start' }, { label: 'center', value: 'center' }, { label: 'end', value: 'end' }]} />
                        <Select id="justify-items-grid-select" label="justify-items" value={gridJustifyItems} onChange={setGridJustifyItems} options={[{ label: 'stretch', value: 'stretch' }, { label: 'start', value: 'start' }, { label: 'center', value: 'center' }, { label: 'end', value: 'end' }]} />
                      </div>
                    </Section>
                  )}

                  {tab === 'spans' && display === 'grid' && (
                    <Section title="Grid Item Spans">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={usePerItemSpans} onChange={(e) => setUsePerItemSpans(e.target.checked)} />Use per‑item spans</label>
                        {!usePerItemSpans ? (
                          <>
                            <div className="flex items-center gap-3 text-sm"><span className="w-40 text-gray-600">Span columns value</span><input type="number" min={2} max={12} value={spanColValue} onChange={(e) => setSpanColValue(parseInt(e.target.value || 2))} className="border rounded-lg px-2 py-1 w-28 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"/></div>
                            <label className="flex items-center gap-3 text-sm"><span className="w-40 text-gray-600">Indices (e.g. 1,4,7)</span><input type="text" value={spanColIndices} onChange={(e) => { setSpanColIndices(e.target.value); parseIndices(e.target.value, setSpanColError); }} className="border rounded-lg px-2 py-1 w-full focus:border-gray-900 focus:ring-1 focus:ring-gray-900"/></label>
                            {spanColError && <p className="text-red-600 text-xs ml-44">{spanColError}</p>}
                            <div className="flex items-center gap-3 text-sm"><span className="w-40 text-gray-600">Span rows value</span><input type="number" min={2} max={12} value={spanRowValue} onChange={(e) => setSpanRowValue(parseInt(e.target.value || 2))} className="border rounded-lg px-2 py-1 w-28 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"/></div>
                            <label className="flex items-center gap-3 text-sm"><span className="w-40 text-gray-600">Indices (e.g. 2,5)</span><input type="text" value={spanRowIndices} onChange={(e) => { setSpanRowIndices(e.target.value); parseIndices(e.target.value, setSpanRowError); }} className="border rounded-lg px-2 py-1 w-full focus:border-gray-900 focus:ring-1 focus:ring-gray-900"/></label>
                            {spanRowError && <p className="text-red-600 text-xs ml-44">{spanRowError}</p>}
                          </>
                        ) : (
                          <div className="border rounded-lg p-2 max-h-64 overflow-auto">
                            <div className="grid grid-cols-6 gap-2 text-xs text-gray-600 px-1 mb-1"><div className="col-span-2">Item</div><div className="col-span-2">Col span</div><div className="col-span-2">Row span</div></div>
                            {itemSpans.map((sp, i) => (
                              <div key={i} className="grid grid-cols-6 gap-2 items-center py-1">
                                <div className="col-span-2">#{i + 1}</div>
                                <div className="col-span-2"><input type="number" min={1} max={12} value={sp.col} onChange={(e) => { const v = Math.max(1, parseInt(e.target.value || 1)); setItemSpans(arr => { const c = arr.slice(); c[i] = { ...c[i], col: v }; return c; }); }} className="border rounded-lg px-2 py-1 w-20 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"/></div>
                                <div className="col-span-2"><input type="number" min={1} max={12} value={sp.row} onChange={(e) => { const v = Math.max(1, parseInt(e.target.value || 1)); setItemSpans(arr => { const c = arr.slice(); c[i] = { ...c[i], row: v }; return c; }); }} className="border rounded-lg px-2 py-1 w-20 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"/></div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </Section>
                  )}

                  {tab === 'box' && (
                    <Section title="Box Styling">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm"><span className="w-40 text-gray-600">Background</span><div className="flex gap-2"><button type="button" onClick={() => setBgMode('fixed')} className={`px-4 py-2 rounded-full text-sm border focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 ${bgMode === 'fixed' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}`}>Fixed</button><button type="button" onClick={() => setBgMode('random')} className={`px-4 py-2 rounded-full text-sm border focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 ${bgMode === 'random' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}`}>Random</button><button type="button" onClick={() => setBgMode('gradient')} className={`px-4 py-2 rounded-full text-sm border focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 ${bgMode === 'gradient' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}`}>Gradient</button></div></div>
                        {bgMode === 'fixed' && (<label className="flex items-center gap-3 text-sm"><span className="w-40 text-gray-600">Color</span><input type="color" value={bgFixed} onChange={(e) => setBgFixed(e.target.value)} className="w-10 h-8 p-0 border rounded focus:border-gray-900 focus:ring-1 focus:ring-gray-900"/></label>)}
                        {bgMode === 'gradient' && (
                          <>
                            <label className="flex items-center gap-3 text-sm"><span className="w-40 text-gray-600">Start color</span><input type="color" value={bgGrad1} onChange={(e) => setBgGrad1(e.target.value)} className="w-10 h-8 p-0 border rounded focus:border-gray-900 focus:ring-1 focus:ring-gray-900"/></label>
                            <label className="flex items-center gap-3 text-sm"><span className="w-40 text-gray-600">End color</span><input type="color" value={bgGrad2} onChange={(e) => setBgGrad2(e.target.value)} className="w-10 h-8 p-0 border rounded focus:border-gray-900 focus:ring-1 focus:ring-gray-900"/></label>
                            <Slider id="bg-angle-slider" label="Angle" value={bgAngle} min={0} max={360} step={5} onChange={setBgAngle} suffix="°"/>
                          </>
                        )}
                      </div>
                    </Section>
                  )}

                  {tab === 'responsive' && (
                    <Section title="Responsive Preview">
                      <Toggle value={viewport} onChange={setViewport} options={[{ label: 'Auto', value: 'auto' }, { label: 'iPhone (375)', value: 'iphone' }, { label: 'Tablet (768)', value: 'tablet' }, { label: 'Desktop (1200)', value: 'desktop' }]} />
                    </Section>
                  )}

                  {tab === 'tips' && tips.length > 0 && (
                    <Section title="Tips">
                      <ul className="text-xs text-gray-600 list-disc pl-5 space-y-1">{tips.map((t, i) => (<li key={i}>{t}</li>))}</ul>
                    </Section>
                  )}
                </div>

                {/* Footer actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                  <div className="flex flex-wrap gap-3">
                    <button 
                      type="button" 
                      onClick={exportConfig} 
                      className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-400 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      Export Config
                    </button>
                    <button 
                      type="button" 
                      onClick={importConfig} 
                      className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-400 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      Import Config
                    </button>
                    <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={onImportFile} />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button 
                      type="button" 
                      onClick={resetDefaults} 
                      className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-400 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      Reset Defaults
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setOpen(false)} 
                      className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold shadow-lg shadow-indigo-200/50 hover:from-indigo-700 hover:to-indigo-800 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            </div>

        )}
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<DisplayLab />);