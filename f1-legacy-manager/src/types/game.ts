export type RealityType = 'historical' | 'semi-realistic' | 'free';
export type ChaosLevel = 'low' | 'medium' | 'high';
export type Difficulty = 'easy' | 'normal' | 'hard' | 'realistic';
export type DriverStatus = 'starter' | 'reserve' | 'academy' | 'free';
export type StrategyPreset = 'aggressive' | 'balanced' | 'conservative';

export interface Driver {
  id: string; name: string; age: number; nationality: string; overall: number;
  qualifyingPace: number; racePace: number; start: number; defense: number; overtake: number;
  rain: number; tireManagement: number; consistency: number; technicalFeedback: number;
  potential: number; ego: number; pressure: number; salary: number; contractUntil: number;
  status: DriverStatus; teamId?: string;
}

export interface CarStats { aerodynamics:number; chassis:number; engine:number; suspension:number; cooling:number; weight:number; reliability:number; tireManagement:number; straightLine:number; slowCorner:number; mediumCorner:number; fastCorner:number; }
export interface Team { id:string; name:string; nationality:string; budget:number; reputation:number; motor:string; morale:number; car:CarStats; driverIds:string[]; reserveId:string; }
export interface Track { id:string; name:string; country:string; laps:number; tireWear:number; rainChance:number; engineImportance:number; aeroImportance:number; overtakeDifficulty:number; safetyCarChance:number; }
export interface RegulationEra { id:string; label:string; startYear:number; endYear:number|null; engineWeight:number; aeroWeight:number; reliabilityWeight:number; tireWeight:number; devCostMultiplier:number; shuffleChance:number; }
export interface DevelopmentProject { id:string; part:string; cost:number; weeks:number; estimatedGain:number; failRisk:number; budgetCapImpact:number; teamId:string; status:'ongoing'|'done'|'failed'; }
export interface StandingLine { id:string; name:string; points:number; wins:number; }
export interface RaceEvent { lap:number; message:string; }
export interface RaceResultLine { position:number; driverId:string; teamId:string; tire:string; gap:string; status:string; points:number; }

export interface SaveGame {
  year:number; currentRound:number; selectedTeamId:string; realityType:RealityType; chaosLevel:ChaosLevel; difficulty:Difficulty;
  teams:Team[]; drivers:Driver[]; tracks:Track[]; regulations:RegulationEra[]; developments:DevelopmentProject[];
  driverStandings:StandingLine[]; teamStandings:StandingLine[]; championHistory:{year:number; drivers:string; constructors:string;}[];
  lastRace?:{ trackId:string; results:RaceResultLine[]; events:RaceEvent[] };
}
