// src/lib/data/ivfSuccessFormulas.ts
import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'

export interface IVFFormula {
  cdc_formula: string
  formula_intercept: string
  formula_age_linear_coefficient: string
  formula_age_power_coefficient: string
  formula_age_power_factor: string
  formula_bmi_linear_coefficient: string
  formula_bmi_power_coefficient: string
  formula_bmi_power_factor: string
  formula_tubal_factor_true_value: string
  formula_tubal_factor_false_value: string
  formula_male_factor_infertility_true_value: string
  formula_male_factor_infertility_false_value: string
  formula_endometriosis_true_value: string
  formula_endometriosis_false_value: string
  formula_ovulatory_disorder_true_value: string
  formula_ovulatory_disorder_false_value: string
  formula_diminished_ovarian_reserve_true_value: string
  formula_diminished_ovarian_reserve_false_value: string
  formula_uterine_factor_true_value: string
  formula_uterine_factor_false_value: string
  formula_other_reason_true_value: string
  formula_other_reason_false_value: string
  formula_unexplained_infertility_true_value: string
  formula_unexplained_infertility_false_value: string
  formula_prior_pregnancies_0_value: string
  formula_prior_pregnancies_1_value: string
  'formula_prior_pregnancies_2+_value': string
  formula_prior_live_births_0_value: string
  formula_prior_live_births_1_value: string
  'formula_prior_live_births_2+_value': string
}

// the nested lookup table
const ivfFormulas: Record<
  string, // param_using_own_eggs: "TRUE"|"FALSE"
  Record<
    string, // param_attempted_ivf_previously: "TRUE"|"FALSE"|"N/A"
    Record<
      string, // param_is_reason_for_infertility_known: "TRUE"|"FALSE"
      IVFFormula
    >
  >
> = {}

export async function loadIVFData(): Promise<void> {
  const csvFilePath = path.join(process.cwd(), 'src/lib/data/ivf_success_formulas.csv')
  const rows: Record<string, any>[] = []

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', row => rows.push(row))
      .on('end', () => resolve())
      .on('error', err => reject(err))
  })

  // build nested object
  for (const row of rows) {
    const egg   = row.param_using_own_eggs
    const prev  = row.param_attempted_ivf_previously
    const known = row.param_is_reason_for_infertility_known

    // ensure each level exists
    if (!ivfFormulas[egg])          ivfFormulas[egg] = {}
    if (!ivfFormulas[egg][prev])    ivfFormulas[egg][prev] = {}
    // assign the stripped-down formula object
    ivfFormulas[egg][prev][known] = {
      cdc_formula: row.cdc_formula,
      formula_intercept: row.formula_intercept,
      formula_age_linear_coefficient: row.formula_age_linear_coefficient,
      formula_age_power_coefficient: row.formula_age_power_coefficient,
      formula_age_power_factor: row.formula_age_power_factor,
      formula_bmi_linear_coefficient: row.formula_bmi_linear_coefficient,
      formula_bmi_power_coefficient: row.formula_bmi_power_coefficient,
      formula_bmi_power_factor: row.formula_bmi_power_factor,
      formula_tubal_factor_true_value: row.formula_tubal_factor_true_value,
      formula_tubal_factor_false_value: row.formula_tubal_factor_false_value,
      formula_male_factor_infertility_true_value: row.formula_male_factor_infertility_true_value,
      formula_male_factor_infertility_false_value: row.formula_male_factor_infertility_false_value,
      formula_endometriosis_true_value: row.formula_endometriosis_true_value,
      formula_endometriosis_false_value: row.formula_endometriosis_false_value,
      formula_ovulatory_disorder_true_value: row.formula_ovulatory_disorder_true_value,
      formula_ovulatory_disorder_false_value: row.formula_ovulatory_disorder_false_value,
      formula_diminished_ovarian_reserve_true_value: row.formula_diminished_ovarian_reserve_true_value,
      formula_diminished_ovarian_reserve_false_value: row.formula_diminished_ovarian_reserve_false_value,
      formula_uterine_factor_true_value: row.formula_uterine_factor_true_value,
      formula_uterine_factor_false_value: row.formula_uterine_factor_false_value,
      formula_other_reason_true_value: row.formula_other_reason_true_value,
      formula_other_reason_false_value: row.formula_other_reason_false_value,
      formula_unexplained_infertility_true_value: row.formula_unexplained_infertility_true_value,
      formula_unexplained_infertility_false_value: row.formula_unexplained_infertility_false_value,
      formula_prior_pregnancies_0_value: row.formula_prior_pregnancies_0_value,
      formula_prior_pregnancies_1_value: row.formula_prior_pregnancies_1_value,
      'formula_prior_pregnancies_2+_value': row['formula_prior_pregnancies_2+_value'],
      formula_prior_live_births_0_value: row.formula_prior_live_births_0_value,
      formula_prior_live_births_1_value: row.formula_prior_live_births_1_value,
      'formula_prior_live_births_2+_value': row['formula_prior_live_births_2+_value'],
    }
  }
}

await loadIVFData();
export function getIVFFormula({
  usingOwnEggs,
  previousIVF,
  reasonKnown
} :
{
  usingOwnEggs: string
  previousIVF: string
  reasonKnown: string
}): IVFFormula {
  return ivfFormulas[usingOwnEggs]?.[previousIVF]?.[reasonKnown]
}
