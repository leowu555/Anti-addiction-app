/**
 * Stimulus - Displays a letter or shape for the 2-back game.
 */

import type { StimulusType } from '../../utils/gameLogic';

const SHAPES = ['circle', 'square', 'triangle', 'star', 'diamond'];

interface StimulusProps {
  value: StimulusType | null;
}

function ShapeIcon({ name }: { name: string }) {
  const n = name.toLowerCase();
  if (n === 'circle') {
    return <div className="h-24 w-24 rounded-full border-4 border-stone-500" />;
  }
  if (n === 'square') {
    return <div className="h-24 w-24 rounded-lg border-4 border-stone-500" />;
  }
  if (n === 'triangle') {
    return (
      <div
        className="border-0 border-transparent"
        style={{
          width: 0,
          height: 0,
          borderLeft: '48px solid transparent',
          borderRight: '48px solid transparent',
          borderBottom: '96px solid #78716c',
        }}
      />
    );
  }
  if (n === 'diamond') {
    return (
      <div
        className="h-24 w-24 border-4 border-stone-500"
        style={{ transform: 'rotate(45deg)' }}
      />
    );
  }
  // star - use unicode
  return <span className="text-8xl text-stone-600">★</span>;
}

export function Stimulus({ value }: StimulusProps) {
  if (!value) return null;

  const isShape = SHAPES.includes(value.toLowerCase());

  return (
    <div className="flex min-h-[140px] items-center justify-center">
      {isShape ? (
        <ShapeIcon name={value} />
      ) : (
        <span className="text-7xl font-bold text-stone-700 drop-shadow-lg">
          {value}
        </span>
      )}
    </div>
  );
}
