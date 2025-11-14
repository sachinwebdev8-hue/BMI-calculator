export type Unit = 'metric' | 'imperial';

export interface BmiResult {
  bmi: number;
  category: string;
  color: string;
}
