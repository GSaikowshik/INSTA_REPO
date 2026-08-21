/**
 * Massive Combinatorial Theme Matrix - 200+ Unique Tailwind Class Configurations
 */

const baseThemes = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk 2077',
    appBackground: 'bg-zinc-950 text-cyan-300',
    cardStyle: 'bg-zinc-900/90 border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)] rounded-lg p-6',
    typography: 'font-mono text-cyan-300',
    accentChip: 'bg-yellow-400 text-black font-mono font-bold px-2.5 py-0.5 rounded text-[11px]'
  },
  {
    id: 'tokyo-minimal',
    name: 'Tokyo Minimal',
    appBackground: 'bg-slate-50 text-slate-900',
    cardStyle: 'bg-white border border-gray-200 shadow-sm rounded-xl p-6',
    typography: 'font-sans text-slate-900',
    accentChip: 'bg-slate-100 text-slate-700 border border-gray-200 px-2.5 py-0.5 rounded text-[11px]'
  },
  {
    id: 'vercel-dark',
    name: 'Vercel Dark',
    appBackground: 'bg-black text-white',
    cardStyle: 'bg-zinc-950 border border-zinc-800 shadow-2xl rounded-xl p-6',
    typography: 'font-sans text-slate-100',
    accentChip: 'bg-zinc-800 text-zinc-200 border border-zinc-700 px-2.5 py-0.5 rounded text-[11px]'
  },
  {
    id: 'neo-brutalist',
    name: 'Neo-Brutalist Acid',
    appBackground: 'bg-lime-300 text-black',
    cardStyle: 'bg-white border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-none p-6',
    typography: 'font-mono text-black',
    accentChip: 'bg-black text-white font-mono font-bold px-2.5 py-0.5 text-[11px]'
  },
  {
    id: 'notion-clean',
    name: 'Notion Clean',
    appBackground: 'bg-white text-stone-900',
    cardStyle: 'bg-stone-50 border border-stone-200 rounded-md p-6',
    typography: 'font-serif text-stone-900',
    accentChip: 'bg-stone-200 text-stone-800 px-2.5 py-0.5 rounded text-[11px]'
  },
  {
    id: 'nordic-frost',
    name: 'Nordic Frost',
    appBackground: 'bg-slate-900 text-slate-100',
    cardStyle: 'bg-slate-800/80 border border-cyan-800/60 shadow-lg rounded-2xl p-6',
    typography: 'font-sans text-slate-100',
    accentChip: 'bg-cyan-900/60 text-cyan-200 border border-cyan-700/50 px-2.5 py-0.5 rounded-full text-[11px]'
  },
  {
    id: 'amber-terminal',
    name: 'Amber Terminal',
    appBackground: 'bg-black text-amber-400',
    cardStyle: 'bg-amber-950/40 border border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)] rounded-md p-6',
    typography: 'font-mono text-amber-400',
    accentChip: 'bg-amber-500 text-black font-bold px-2.5 py-0.5 rounded text-[11px]'
  },
  {
    id: 'swiss-editorial',
    name: 'Swiss Editorial',
    appBackground: 'bg-red-50 text-slate-950',
    cardStyle: 'bg-white border-b-4 border-red-600 shadow-sm rounded-none p-6',
    typography: 'font-serif text-slate-950',
    accentChip: 'bg-red-600 text-white font-bold px-2.5 py-0.5 rounded-none text-[11px]'
  },
  {
    id: 'emerald-zen',
    name: 'Emerald Zen',
    appBackground: 'bg-emerald-950 text-emerald-100',
    cardStyle: 'bg-emerald-900/50 border border-emerald-500/30 shadow-lg rounded-3xl p-6',
    typography: 'font-sans text-emerald-100',
    accentChip: 'bg-emerald-800 text-emerald-200 border border-emerald-600 px-2.5 py-0.5 rounded-full text-[11px]'
  },
  {
    id: 'fuchsia-synthwave',
    name: 'Fuchsia Synthwave',
    appBackground: 'bg-fuchsia-950 text-fuchsia-200',
    cardStyle: 'bg-fuchsia-900/40 border-2 border-fuchsia-500/50 shadow-[0_0_20px_rgba(217,70,239,0.3)] rounded-2xl p-6',
    typography: 'font-sans text-fuchsia-100',
    accentChip: 'bg-fuchsia-500 text-white font-bold px-2.5 py-0.5 rounded-full text-[11px]'
  },
  {
    id: 'rose-minimal',
    name: 'Rose Minimal',
    appBackground: 'bg-rose-50 text-rose-950',
    cardStyle: 'bg-white border border-rose-200/80 shadow-sm rounded-xl p-6',
    typography: 'font-sans text-rose-950',
    accentChip: 'bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-md text-[11px]'
  },
  {
    id: 'teal-glass',
    name: 'Teal Glassmorphism',
    appBackground: 'bg-teal-950 text-teal-100',
    cardStyle: 'bg-teal-900/40 border border-teal-500/30 backdrop-blur-md rounded-2xl p-6 shadow-xl',
    typography: 'font-mono text-teal-200',
    accentChip: 'bg-teal-500/30 text-teal-300 border border-teal-400/40 px-2.5 py-0.5 rounded-full text-[11px]'
  }
];

// Expanded Palette & Card Style Collections for 200+ Combinations
const backgrounds = [
  'bg-slate-900 text-slate-100',
  'bg-zinc-950 text-zinc-100',
  'bg-gray-900 text-gray-100',
  'bg-slate-50 text-slate-900',
  'bg-stone-900 text-stone-100',
  'bg-indigo-950 text-indigo-100',
  'bg-teal-950 text-teal-100',
  'bg-neutral-900 text-neutral-100',
  'bg-blue-950 text-blue-100',
  'bg-emerald-950 text-emerald-100',
  'bg-rose-950 text-rose-100',
  'bg-cyan-950 text-cyan-100',
  'bg-fuchsia-950 text-fuchsia-100',
  'bg-amber-950 text-amber-100',
  'bg-violet-950 text-violet-100',
  'bg-stone-50 text-stone-900',
  'bg-sky-950 text-sky-100',
  'bg-purple-950 text-purple-100'
];

const cardStyles = [
  'bg-white border border-gray-200 shadow-md rounded-lg p-6',
  'bg-slate-800 border border-slate-700 shadow-xl rounded-2xl p-6',
  'bg-white border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-none p-6',
  'bg-zinc-900 border border-emerald-500/30 rounded-xl p-6',
  'bg-stone-900 border border-amber-500/40 rounded-lg p-6',
  'bg-white border-b-2 border-blue-600 rounded-sm p-6',
  'bg-slate-900/60 border border-slate-700/50 backdrop-blur-md rounded-2xl p-6 shadow-xl',
  'bg-indigo-900/60 border border-cyan-400/40 shadow-lg rounded-xl p-6',
  'bg-neutral-800 border border-neutral-700 shadow-sm rounded-md p-6',
  'bg-white border border-slate-300 shadow-sm rounded-md p-6',
  'bg-rose-900/40 border border-rose-500/40 backdrop-blur-sm rounded-2xl p-6',
  'bg-cyan-900/50 border-2 border-cyan-400/60 shadow-[0_0_15px_rgba(34,211,238,0.25)] rounded-xl p-6',
  'bg-fuchsia-900/40 border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] rounded-none p-6',
  'bg-stone-800/90 border border-stone-600 shadow-md rounded-lg p-6',
  'bg-white/90 border border-indigo-200 backdrop-blur-md rounded-3xl p-6'
];

const typographies = [
  'font-sans text-slate-100',
  'font-mono text-emerald-400',
  'font-serif text-slate-900',
  'font-sans text-zinc-200',
  'font-mono text-amber-300',
  'font-sans text-slate-900',
  'font-mono text-cyan-300',
  'font-serif text-amber-900',
  'font-sans text-stone-100',
  'font-mono text-teal-300',
  'font-sans text-rose-200',
  'font-mono text-fuchsia-300',
  'font-serif text-stone-900',
  'font-sans text-sky-200'
];

const accentChips = [
  'bg-blue-500 text-white rounded-full px-2.5 py-0.5 text-[11px]',
  'font-mono bg-black text-white px-2.5 py-0.5 text-[11px] font-bold',
  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded text-[11px]',
  'bg-purple-600 text-white font-semibold px-2.5 py-0.5 rounded text-[11px]',
  'bg-amber-400 text-black font-bold px-2.5 py-0.5 rounded text-[11px]',
  'bg-cyan-500 text-black font-bold px-2.5 py-0.5 rounded-full text-[11px]',
  'bg-slate-200 text-slate-800 font-mono px-2.5 py-0.5 rounded text-[11px]',
  'bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded text-[11px]',
  'bg-indigo-500 text-white font-sans px-2.5 py-0.5 rounded text-[11px]',
  'bg-stone-800 text-stone-200 border border-stone-700 px-2.5 py-0.5 rounded text-[11px]',
  'bg-fuchsia-500 text-white font-bold px-2.5 py-0.5 rounded-full text-[11px]',
  'bg-teal-500/30 text-teal-200 border border-teal-400/40 px-2.5 py-0.5 rounded text-[11px]'
];

const generatedThemes = [...baseThemes];

let count = generatedThemes.length;
for (let i = 0; i < 190; i++) {
  count++;
  const bg = backgrounds[i % backgrounds.length];
  const card = cardStyles[i % cardStyles.length];
  const typo = typographies[i % typographies.length];
  const chip = accentChips[i % accentChips.length];

  generatedThemes.push({
    id: `theme-${count}`,
    name: `Permutation #${count} (${typo.split(' ')[0]})`,
    appBackground: bg,
    cardStyle: card,
    typography: typo,
    accentChip: chip
  });
}

export const themeMatrix = generatedThemes;
export default themeMatrix;
