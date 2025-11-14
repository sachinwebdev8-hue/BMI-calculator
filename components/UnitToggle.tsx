import React from 'react';
import { Unit } from '../types';

interface UnitToggleProps {
  unit: Unit;
  setUnit: (unit: Unit) => void;
}

const UnitToggle: React.FC<UnitToggleProps> = ({ unit, setUnit }) => {
  const getButtonClasses = (buttonUnit: Unit) => {
    const baseClasses = 'w-1/2 py-2 px-4 text-sm font-medium focus:outline-none transition-colors duration-300';
    if (unit === buttonUnit) {
      return `${baseClasses} bg-indigo-600 text-white shadow-md`;
    }
    return `${baseClasses} bg-white text-gray-700 hover:bg-gray-100 border border-gray-200`;
  };

  return (
    <div className="flex rounded-lg shadow-sm" role="group">
      <button
        type="button"
        onClick={() => setUnit('metric')}
        className={`${getButtonClasses('metric')} rounded-l-lg`}
        aria-pressed={unit === 'metric'}
      >
        Metric (kg, cm)
      </button>
      <button
        type="button"
        onClick={() => setUnit('imperial')}
        className={`${getButtonClasses('imperial')} rounded-r-lg`}
        aria-pressed={unit === 'imperial'}
      >
        Imperial (lbs, ft, in)
      </button>
    </div>
  );
};

export default UnitToggle;
