export interface RequestBody {
    usingOwnEggs: boolean;
    previousIVF: boolean;
    reasonKnown: boolean;
    age: string;
    weight: string;
    heightFeet: string;
    heightInches: string;
    priorPregnancies: number;
    priorLiveBirths: number;
    hasTubalFactor: boolean;
    hasEndometriosis: boolean;
    hasOvulatoryDisorder: boolean;
    hasDiminishedOvarianReserve: boolean;
    hasUterineFactor: boolean;
    hasOtherReason: boolean;
    hasUnexplainedInfertility: boolean;
    hasMaleFactorInfertility: boolean;
  }
  
  export interface FormulaData {
    [key: string]: string;
  }