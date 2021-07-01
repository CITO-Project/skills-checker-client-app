
export interface ChallengingScenario {
    name: string;
    aspect: Array<{name: string, skill: string}>;
    level: string;
    fluency: number;
    confidence: number;
    independence: number;
  }