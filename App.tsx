import React, { useState, useMemo } from 'react';
import UnitToggle from './components/UnitToggle';
import BmiResult from './components/BmiResult';
import { Unit, BmiResult as BmiResultType } from './types';

const App: React.FC = () => {
  const [unit, setUnit] = useState<Unit>('metric');
  const [result, setResult] = useState<BmiResultType | null>(null);
  const [error, setError] = useState<string>('');

  const handleUnitChange = (newUnit: Unit) => {
    setUnit(newUnit);
    setResult(null);
    setError('');
    const form = document.getElementById('bmi-form') as HTMLFormElement;
    if (form) {
      form.reset();
    }
  };

  const getBmiCategory = (bmi: number): { category: string; color: string } => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'bg-blue-500' };
    if (bmi >= 18.5 && bmi <= 24.9) return { category: 'Normal weight', color: 'bg-green-500' };
    if (bmi >= 25 && bmi <= 29.9) return { category: 'Overweight', color: 'bg-yellow-500' };
    return { category: 'Obesity', color: 'bg-red-600' };
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const formData = new FormData(e.currentTarget);
    let bmi = 0;

    try {
      if (unit === 'metric') {
        const height = parseFloat(formData.get('metric-height') as string);
        const weight = parseFloat(formData.get('metric-weight') as string);
        if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
          throw new Error('Please enter valid positive numbers for height and weight.');
        }
        const heightInMeters = height / 100;
        bmi = weight / (heightInMeters * heightInMeters);
      } else {
        const heightFt = parseFloat(formData.get('imperial-height-ft') as string) || 0;
        const heightIn = parseFloat(formData.get('imperial-height-in') as string) || 0;
        const weight = parseFloat(formData.get('imperial-weight') as string);

        if (isNaN(weight) || weight <= 0) {
          throw new Error('Please enter a valid positive weight.');
        }
        if (isNaN(heightFt) || isNaN(heightIn) || (heightFt < 0 || heightIn < 0)) {
          throw new Error('Height values cannot be negative.');
        }
        const totalInches = (heightFt * 12) + heightIn;
        if (totalInches <= 0) {
          throw new Error('Please enter a valid positive height.');
        }
        bmi = (weight / (totalInches * totalInches)) * 703;
      }

      if (bmi > 0 && isFinite(bmi)) {
        const { category, color } = getBmiCategory(bmi);
        setResult({ bmi, category, color });
      } else {
        throw new Error('Could not calculate BMI. Please check your inputs.');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };
  
  const footerYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="min-h-screen text-gray-800 antialiased">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-indigo-600">BMI Calculator</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <section id="calculator" className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-semibold mb-1">Check Your BMI</h2>
              <p className="text-gray-600 mb-6">Enter your details below to calculate your Body Mass Index.</p>

              <div className="mb-6">
                <UnitToggle unit={unit} setUnit={handleUnitChange} />
              </div>

              <form id="bmi-form" noValidate onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {unit === 'metric' ? (
                    <div id="metric-inputs" className="space-y-4">
                      <div>
                        <label htmlFor="metric-height" className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                        <div className="relative">
                          <input type="number" name="metric-height" id="metric-height" className="bg-white block w-full pl-4 pr-12 py-3 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 175" min="0" required />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">cm</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="metric-weight" className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                        <div className="relative">
                          <input type="number" name="metric-weight" id="metric-weight" className="bg-white block w-full pl-4 pr-12 py-3 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 70" min="0" required />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">kg</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div id="imperial-inputs" className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="relative">
                            <input type="number" name="imperial-height-ft" id="imperial-height-ft" className="bg-white block w-full pl-4 pr-12 py-3 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 5" min="0" required />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">ft</span>
                            </div>
                          </div>
                          <div className="relative">
                            <input type="number" name="imperial-height-in" id="imperial-height-in" className="bg-white block w-full pl-4 pr-12 py-3 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 9" min="0" />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">in</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="imperial-weight" className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                        <div className="relative">
                          <input type="number" name="imperial-weight" id="imperial-weight" className="bg-white block w-full pl-4 pr-12 py-3 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., 155" min="0" required />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">lbs</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <p id="error-message" className="text-red-500 text-sm h-5" role="alert" aria-live="polite">
                    {error}
                  </p>

                  <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300">
                    Calculate BMI
                  </button>
                </div>
              </form>
            </div>

            <div id="result-container" className="min-h-[250px] flex items-center justify-center">
              <BmiResult result={result} />
            </div>
          </div>
        </section>

        <section id="information" className="mt-12 space-y-8">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">What is BMI?</h2>
            <p className="text-gray-600 leading-relaxed">
              Body Mass Index (BMI) is a measure that uses your height and weight to work out if your weight is healthy. The BMI calculation divides an adult's weight in kilograms by their height in metres squared. For most adults, an ideal BMI is in the 18.5 to 24.9 range.
            </p>
          </div>
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">BMI Categories</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li><span className="font-semibold">Below 18.5:</span> Underweight</li>
              <li><span className="font-semibold">18.5 – 24.9:</span> Healthy Weight</li>
              <li><span className="font-semibold">25.0 – 29.9:</span> Overweight</li>
              <li><span className="font-semibold">30.0 and above:</span> Obesity</li>
            </ul>
          </div>
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Limitations of BMI</h2>
            <p className="text-gray-600 leading-relaxed">
              BMI is a useful measurement for most people over 18, but it's only an estimate and has some limitations. It doesn't distinguish between fat and muscle mass, which means very muscular people (like athletes) may have a high BMI even if their body fat is low. It also doesn't account for factors like age, sex, or ethnicity. Always consult a healthcare professional for personalized advice.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-white mt-12 py-6">
        <div className="max-w-4xl mx-auto text-center text-gray-500 text-sm px-4 sm:px-6 lg:px-8">
          <p>&copy; {footerYear} BMI Calculator. All rights reserved.</p>
          <p className="mt-1">This tool is for informational purposes only. Consult with a medical professional for health advice.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
