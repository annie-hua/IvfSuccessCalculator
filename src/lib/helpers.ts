export function getFormulaValue(condition: boolean, trueValue: string, falseValue: string): number {
    return parseFloat(condition ? trueValue : falseValue);
  }
  
  export function getPregnancyFormulaValue(priorPregnancies: number, formula: any): number {
    if (priorPregnancies === 0) {
      return parseFloat(formula.formula_prior_pregnancies_0_value);
    } else if (priorPregnancies === 1) {
      return parseFloat(formula.formula_prior_pregnancies_1_value);
    } else {
      return parseFloat(formula['formula_prior_pregnancies_2+_value']);
    }
  }
  
  export function getLiveBirthFormulaValue(priorLiveBirths: number, formula: any): number {
    if (priorLiveBirths === 0) {
      return parseFloat(formula.formula_prior_live_births_0_value);
    } else if (priorLiveBirths === 1) {
      return parseFloat(formula.formula_prior_live_births_1_value);
    } else {
      return parseFloat(formula['formula_prior_live_births_2+_value']);
    }
  }