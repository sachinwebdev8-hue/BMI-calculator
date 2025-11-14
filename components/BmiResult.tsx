import React from 'react';
import { BmiResult as BmiResultType } from '../types';

interface BmiResultProps {
  result: BmiResultType | null;
}

const BmiResult: React.FC<BmiResultProps> = ({ result }) => {
  if (!result) {
    return (
      <div className="p-6 rounded-lg bg-gray-100 text-center w-full">
        <p className="text-gray-500">Enter your height and weight to see your BMI result.</p>
      </div>
    );
  }

  return (
    <div
      className={`p-6 rounded-lg text-white text-center shadow-xl transition-all duration-500 w-full ${result.color}`}
      role="alert"
      aria-live="assertive"
    >
      <p className="text-lg">Your BMI is</p>
      <p className="text-5xl font-bold my-2">{result.bmi.toFixed(1)}</p>
      <p className="text-2xl font-semibold">{result.category}</p>
      <p className="text-sm mt-4 font-light">A healthy BMI range is considered to be between 18.5 and 24.9.</p>
    </div>
  );
};

export default BmiResult;
