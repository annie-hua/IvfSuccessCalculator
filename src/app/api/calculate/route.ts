import { NextRequest, NextResponse } from 'next/server';
import  { getIVFFormula } from '@/lib/loadIVFData';
import { calculateIVFSuccessRate } from '@/lib/calculations';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    usingOwnEggs,
    previousIVF,
    reasonKnown,
    age,
    weight,
    heightFeet,
    heightInches,
    priorPregnancies,
    hasTubalFactor,
    hasEndometriosis,
    hasOvulatoryDisorder,
    hasDiminishedOvarianReserve,
    hasUterineFactor,
    hasOtherReason,
    hasUnexplainedInfertility,
    hasMaleFactorInfertility,
    priorLiveBirths,

  } = body;


  const weightLbs = parseFloat(weight);
  const feet = parseInt(heightFeet || "0");
  const inches = parseInt(heightInches || "0");

  // Access IVF data
  const formula = getIVFFormula({usingOwnEggs, previousIVF, reasonKnown});

  let formulaPriorPregnanciesValue = 0
  if (priorPregnancies === 0) {
    formulaPriorPregnanciesValue = parseFloat(formula.formula_prior_pregnancies_0_value);
  } else if (priorPregnancies === 1) {
    formulaPriorPregnanciesValue = parseFloat(formula.formula_prior_pregnancies_1_value);
  } else if (priorPregnancies >= 2) {
    formulaPriorPregnanciesValue = parseFloat(formula['formula_prior_pregnancies_2+_value']);
  }

  let formulaPriorLiveBirthsValue = 0
  if (priorLiveBirths === 0) {
    formulaPriorLiveBirthsValue = parseFloat(formula.formula_prior_live_births_0_value);
  } else if (priorLiveBirths === 1) {
    formulaPriorLiveBirthsValue = parseFloat(formula.formula_prior_live_births_1_value);
  } else if (priorLiveBirths >= 2) {
    formulaPriorLiveBirthsValue = parseFloat(formula['formula_prior_live_births_2+_value']);
  }
  // Call the IVF calculation function
  const result = calculateIVFSuccessRate({
    formulaIntercept: parseFloat(formula.formula_intercept),
    formulaAgeLinearCoefficient: parseFloat(formula.formula_age_linear_coefficient),
    age: parseFloat(age),
    formulaAgePowerCoefficient: parseFloat(formula.formula_age_power_coefficient),
    formulaAgePowerFactor: parseFloat(formula.formula_age_power_factor),
    formulaBMILinearCoefficient: parseFloat(formula.formula_bmi_linear_coefficient),
    formulaBMIPowerCoefficient: parseFloat(formula.formula_bmi_power_coefficient),
    formulaBMIPowerFactor: parseFloat(formula.formula_bmi_power_factor),
    weightLbs,
    heightFeet: feet,
    heightInches: inches,
    formulaTubalFactorValue: hasTubalFactor ? parseFloat(formula.formula_tubal_factor_true_value) : parseFloat(formula.formula_tubal_factor_false_value),
    formulaMaleFactorInfertilityValue: hasMaleFactorInfertility ? parseFloat(formula.formula_male_factor_infertility_true_value) : parseFloat(formula.formula_male_factor_infertility_false_value),
    formulaEndometriosisValue: hasEndometriosis ? parseFloat(formula.formula_endometriosis_true_value) : parseFloat(formula.formula_endometriosis_false_value),
    formulaOvulatoryDisorderValue: hasOvulatoryDisorder? parseFloat(formula.formula_ovulatory_disorder_true_value): parseFloat(formula.formula_ovulatory_disorder_false_value),
    formulaDiminishedOvarianReserveValue: hasDiminishedOvarianReserve ? parseFloat(formula.formula_diminished_ovarian_reserve_true_value) : parseFloat(formula.formula_diminished_ovarian_reserve_false_value),
    formulaUterineFactorValue: hasUterineFactor ? parseFloat(formula.formula_uterine_factor_true_value) : parseFloat(formula.formula_uterine_factor_false_value),
    formulaOtherReasonValue: hasOtherReason ? parseFloat(formula.formula_other_reason_true_value) : parseFloat(formula.formula_other_reason_false_value),
    formulaUnexplainedInfertilityValue: hasUnexplainedInfertility ? parseFloat(formula.formula_unexplained_infertility_true_value) : parseFloat(formula.formula_unexplained_infertility_false_value),
    formulaPriorPregnanciesValue,
    formulaPriorLiveBirthsValue,
  });

  return NextResponse.json({
    result,
    message: `IVF calculation completed for a ${age}-year-old with height ${feet}'${inches}" and weight ${weight} lbs.`,
  });
}