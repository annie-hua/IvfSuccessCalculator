// Types for parameters
interface BMIParams {
  weightLbs: number;
  heightFeet: number;
  heightInches: number;
}

interface AgeScoreParams {
  formulaAgeLinearCoefficient: number;
  userAge: number;
  formulaAgePowerCoefficient: number;
  formulaAgePowerFactor: number;
}

interface BMIScoreParams {
  userBMI: number;
  formulaBMILinearCoefficient: number;
  formulaBMIPowerCoefficient: number;
  formulaBMIPowerFactor: number;
}

interface IVFParams {
  formulaIntercept: number;
  ageScore: number;
  bmiScore: number;
  formulaTubalFactorValue: number;
  formulaMaleFactorInfertilityValue: number;
  formulaEndometriosisValue: number;
  formulaOvulatoryDisorderValue: number;
  formulaDiminishedOvarianReserveValue: number;
  formulaUterineFactorValue: number;
  formulaOtherReasonValue: number;
  formulaUnexplainedInfertilityValue: number;
  formulaPriorPregnanciesValue: number;
  formulaPriorLiveBirthsValue: number;
}

// Helper function to calculate BMI
export function calculateBMI({ weightLbs, heightFeet, heightInches }: BMIParams): number {
  const totalInches = heightFeet * 12 + heightInches;
  return parseFloat(((weightLbs / (totalInches ** 2)) * 703).toFixed(1));
}

// Helper function to calculate age score
export function calculateAgeScore(params: AgeScoreParams): number {
  const { formulaAgeLinearCoefficient, userAge, formulaAgePowerCoefficient, formulaAgePowerFactor } = params;
  return (
    formulaAgeLinearCoefficient * userAge +
    formulaAgePowerCoefficient * Math.pow(userAge, formulaAgePowerFactor)
  );
}

// Helper function to calculate BMI score
export function calculateBMIScore(params: BMIScoreParams): number {
  const { userBMI, formulaBMILinearCoefficient, formulaBMIPowerCoefficient, formulaBMIPowerFactor } = params;
  return (
    formulaBMILinearCoefficient * userBMI +
    formulaBMIPowerCoefficient * Math.pow(userBMI, formulaBMIPowerFactor)
  );
}

// Helper function to calculate success rate
function calculateSuccessRate(score: number): number {
  const exponent = Math.exp(score);
  const successRate = (exponent / (1 + exponent)) * 100;
  return parseFloat(Math.max(0, Math.min(successRate, 100)).toFixed(2));
}

// Main function to calculate IVF success rate
export function calculateIVFSuccessRate({
  formulaIntercept,
  formulaAgeLinearCoefficient,
  age,
  formulaAgePowerCoefficient,
  formulaAgePowerFactor,
  formulaBMILinearCoefficient,
  formulaBMIPowerCoefficient,
  formulaBMIPowerFactor,
  weightLbs,
  heightFeet,
  heightInches,
  formulaTubalFactorValue,
  formulaMaleFactorInfertilityValue,
  formulaEndometriosisValue,
  formulaOvulatoryDisorderValue,
  formulaDiminishedOvarianReserveValue,
  formulaUterineFactorValue,
  formulaOtherReasonValue,
  formulaUnexplainedInfertilityValue,
  formulaPriorPregnanciesValue,
  formulaPriorLiveBirthsValue,
}: {
  formulaIntercept: number;
  formulaAgeLinearCoefficient: number;
  age: number;
  formulaAgePowerCoefficient: number;
  formulaAgePowerFactor: number;
  formulaBMILinearCoefficient: number;
  formulaBMIPowerCoefficient: number;
  formulaBMIPowerFactor: number;
  weightLbs: number;
  heightFeet: number;
  heightInches: number;
  formulaTubalFactorValue: number;
  formulaMaleFactorInfertilityValue: number;
  formulaEndometriosisValue: number;
  formulaOvulatoryDisorderValue: number;
  formulaDiminishedOvarianReserveValue: number;
  formulaUterineFactorValue: number;
  formulaOtherReasonValue: number;
  formulaUnexplainedInfertilityValue: number;
  formulaPriorPregnanciesValue: number;
  formulaPriorLiveBirthsValue: number;
}) {
  // Calculate BMI
  const bmi = calculateBMI({ weightLbs, heightFeet, heightInches });

  // Calculate age score
  const ageScore = calculateAgeScore({
    formulaAgeLinearCoefficient,
    userAge: age,
    formulaAgePowerCoefficient,
    formulaAgePowerFactor,
  });

  // Calculate BMI score
  const bmiScore = calculateBMIScore({
    userBMI: bmi,
    formulaBMILinearCoefficient,
    formulaBMIPowerCoefficient,
    formulaBMIPowerFactor,
  });

  // Calculate the final IVF score
  const score = formulaIntercept +
    ageScore +
    bmiScore +
    formulaTubalFactorValue +
    formulaMaleFactorInfertilityValue +
    formulaEndometriosisValue +
    formulaOvulatoryDisorderValue +
    formulaDiminishedOvarianReserveValue +
    formulaUterineFactorValue +
    formulaOtherReasonValue +
    formulaUnexplainedInfertilityValue +
    formulaPriorPregnanciesValue +
    formulaPriorLiveBirthsValue;

  // Calculate and return the success rate
  return calculateSuccessRate(score);
}