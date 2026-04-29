import type { Driver, RegulationEra, Team, Track } from '../types/game';

const baseCar = (x:number)=>({aerodynamics:x,chassis:x,engine:x,suspension:x,cooling:x,weight:x,reliability:x,tireManagement:x,straightLine:x,slowCorner:x,mediumCorner:x,fastCorner:x});

export const teams: Team[] = [
{id:'aurora',name:'Aurora Velocity',nationality:'UK',budget:280,reputation:92,motor:'Apex Power',morale:85,car:baseCar(88),driverIds:['d1','d2'],reserveId:'d21'},
{id:'titan',name:'Titan Heritage',nationality:'Italy',budget:240,reputation:88,motor:'Voltar',morale:79,car:baseCar(84),driverIds:['d3','d4'],reserveId:'d22'},
{id:'nova',name:'Nova Orion Racing',nationality:'Germany',budget:230,reputation:80,motor:'Apex Power',morale:74,car:baseCar(81),driverIds:['d5','d6'],reserveId:'d23'},
{id:'falcon',name:'Falcon Prime',nationality:'France',budget:200,reputation:76,motor:'Helix',morale:73,car:baseCar(79),driverIds:['d7','d8'],reserveId:'d24'},
{id:'atlas',name:'Atlas Dynamics',nationality:'USA',budget:175,reputation:70,motor:'Helix',morale:68,car:baseCar(76),driverIds:['d9','d10'],reserveId:'d25'},
{id:'zephyr',name:'Zephyr GP',nationality:'Japan',budget:168,reputation:67,motor:'Nami Hybrid',morale:67,car:baseCar(75),driverIds:['d11','d12'],reserveId:'d26'},
{id:'cobalt',name:'Cobalt Arrow',nationality:'Canada',budget:150,reputation:63,motor:'Voltar',morale:61,car:baseCar(72),driverIds:['d13','d14'],reserveId:'d27'},
{id:'vertex',name:'Vertex United',nationality:'Spain',budget:135,reputation:58,motor:'Nami Hybrid',morale:60,car:baseCar(70),driverIds:['d15','d16'],reserveId:'d28'},
{id:'solar',name:'Solar Crest',nationality:'Brazil',budget:120,reputation:54,motor:'Raven Engines',morale:58,car:baseCar(68),driverIds:['d17','d18'],reserveId:'d29'},
{id:'rookie',name:'Rookie Comet',nationality:'Australia',budget:105,reputation:48,motor:'Raven Engines',morale:56,car:baseCar(66),driverIds:['d19','d20'],reserveId:'d30'},
];

const makeDriver=(id:string,name:string,age:number,teamId?:string,status:'starter'|'reserve'|'academy'|'free'='starter'):Driver=>({id,name,age,nationality:['UK','Italy','Germany','France','Spain','Brazil','Japan','USA'][Math.floor(Math.random()*8)],overall:65+Math.floor(Math.random()*30),qualifyingPace:65+Math.floor(Math.random()*30),racePace:65+Math.floor(Math.random()*30),start:60+Math.floor(Math.random()*35),defense:60+Math.floor(Math.random()*35),overtake:60+Math.floor(Math.random()*35),rain:55+Math.floor(Math.random()*40),tireManagement:58+Math.floor(Math.random()*37),consistency:58+Math.floor(Math.random()*37),technicalFeedback:58+Math.floor(Math.random()*37),potential:65+Math.floor(Math.random()*30),ego:40+Math.floor(Math.random()*40),pressure:50+Math.floor(Math.random()*40),salary:1_200_000+Math.floor(Math.random()*8_000_000),contractUntil:2027,status,teamId});

export const drivers: Driver[] = Array.from({length:30},(_,i)=>makeDriver(`d${i+1}`,`Driver ${i+1}`,19+(i%18), i<20 ? teams[Math.floor(i/2)].id : i<30?undefined:undefined, i<20?'starter':'free')).map((d,i)=> i>=20 && i<30 ? {...d,status:'reserve' as const,teamId:teams[i-20].id} : d);

export const tracks: Track[] = [
{id:'neon-bay',name:'Neon Bay Circuit',country:'Singapore',laps:58,tireWear:80,rainChance:35,engineImportance:72,aeroImportance:88,overtakeDifficulty:78,safetyCarChance:42},
{id:'iron-park',name:'Iron Park Raceway',country:'UK',laps:52,tireWear:65,rainChance:45,engineImportance:68,aeroImportance:79,overtakeDifficulty:55,safetyCarChance:30},
{id:'andes-ring',name:'Andes Ring',country:'Argentina',laps:60,tireWear:74,rainChance:25,engineImportance:75,aeroImportance:70,overtakeDifficulty:60,safetyCarChance:26},
{id:'dune-gp',name:'Dune Grand Prix Track',country:'UAE',laps:56,tireWear:58,rainChance:2,engineImportance:86,aeroImportance:64,overtakeDifficulty:48,safetyCarChance:20},
{id:'forest-loop',name:'Forest Loop',country:'Finland',laps:63,tireWear:77,rainChance:38,engineImportance:61,aeroImportance:74,overtakeDifficulty:67,safetyCarChance:28},
{id:'coastal-arc',name:'Coastal Arc',country:'Portugal',laps:50,tireWear:62,rainChance:30,engineImportance:80,aeroImportance:69,overtakeDifficulty:53,safetyCarChance:22},
{id:'summit-speed',name:'Summit Speed Arena',country:'Austria',laps:71,tireWear:83,rainChance:20,engineImportance:78,aeroImportance:76,overtakeDifficulty:50,safetyCarChance:24},
{id:'metro-run',name:'Metro Run Street',country:'USA',laps:62,tireWear:68,rainChance:18,engineImportance:66,aeroImportance:82,overtakeDifficulty:82,safetyCarChance:47}
];

export const regulations: RegulationEra[] = [
{id:'v8',label:'Era V8 clássica',startYear:2006,endYear:2008,engineWeight:0.24,aeroWeight:0.24,reliabilityWeight:0.22,tireWeight:0.16,devCostMultiplier:0.8,shuffleChance:0.09},
{id:'aero',label:'Mudança aerodinâmica',startYear:2009,endYear:2013,engineWeight:0.2,aeroWeight:0.32,reliabilityWeight:0.18,tireWeight:0.18,devCostMultiplier:0.9,shuffleChance:0.12},
{id:'hybrid',label:'Era híbrida',startYear:2014,endYear:2021,engineWeight:0.34,aeroWeight:0.24,reliabilityWeight:0.2,tireWeight:0.12,devCostMultiplier:1.1,shuffleChance:0.08},
{id:'ground',label:'Efeito solo moderno',startYear:2022,endYear:2025,engineWeight:0.26,aeroWeight:0.3,reliabilityWeight:0.18,tireWeight:0.16,devCostMultiplier:1.05,shuffleChance:0.11},
{id:'nextgen',label:'Nova geração técnica',startYear:2026,endYear:null,engineWeight:0.28,aeroWeight:0.28,reliabilityWeight:0.2,tireWeight:0.14,devCostMultiplier:1.2,shuffleChance:0.15}
];
