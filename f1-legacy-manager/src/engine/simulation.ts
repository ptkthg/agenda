import type { Driver, RaceEvent, RaceResultLine, RegulationEra, StrategyPreset, Team, Track } from '../types/game';

const pointsTable = [25,18,15,12,10,8,6,4,2,1];
const rand=(n=1)=>Math.random()*n;

export const getEra = (year:number, eras:RegulationEra[]) => eras.find((e)=> year>=e.startYear && (e.endYear===null || year<=e.endYear)) ?? eras[0];

const driverScore = (d:Driver,t:Team,tr:Track,rain:boolean,quali:boolean,era:RegulationEra)=> {
  const car = t.car;
  const carPerf = (car.engine*era.engineWeight + car.aerodynamics*era.aeroWeight + car.reliability*era.reliabilityWeight + car.tireManagement*era.tireWeight);
  const pace = quali ? d.qualifyingPace : d.racePace;
  const adapt = (tr.engineImportance*car.engine + tr.aeroImportance*car.aerodynamics)/200;
  const rainBonus = rain ? d.rain*0.22 : 0;
  return pace*0.52 + d.consistency*0.16 + carPerf*0.25 + adapt*0.07 + rainBonus - rand(4);
};

export function simulateWeekend(teams:Team[], drivers:Driver[], track:Track, strategy:StrategyPreset, era:RegulationEra) {
  const rain = rand(100) < track.rainChance;
  const entries = teams.flatMap((team)=>team.driverIds.map((id)=>({driver:drivers.find((d)=>d.id===id)!, team})));
  const quali = entries.map((e)=>({...e,score:driverScore(e.driver,e.team,track,rain,true,era)})).sort((a,b)=>b.score-a.score);

  const events: RaceEvent[] = [{lap:0,message:`Condição inicial: ${rain ? 'chuva leve':'seco'}` }];
  const paceMod = strategy==='aggressive'?1.03:strategy==='conservative'?0.98:1;

  const race = quali.map((q,i)=>{
    const retire = rand(100) > q.team.car.reliability + 5;
    const pit = 1+Math.floor(rand(2));
    const stints = pit===1?'M-H':'S-M-H';
    const chaos = rand(10)-5;
    const score = (driverScore(q.driver,q.team,track,rain,false,era)*paceMod) + (20-i)*0.7 + chaos - pit;
    if (rand(100)<track.safetyCarChance) events.push({lap:10+Math.floor(rand(track.laps-10)),message:'Safety car na pista'});
    if (rand(100)<7) events.push({lap:5+Math.floor(rand(track.laps-5)),message:`Erro de ${q.driver.name}`});
    return {...q,retire,pit,stints,score};
  }).sort((a,b)=> Number(a.retire)-Number(b.retire) || b.score-a.score);

  const results: RaceResultLine[] = race.map((r,i)=>({position:i+1,driverId:r.driver.id,teamId:r.team.id,tire:r.stints,gap:i===0?'Líder':`+${(i*3.2+rand(3)).toFixed(1)}s`,status:r.retire?'DNF':'OK',points:r.retire?0:(pointsTable[i]??0)}));
  events.push({lap:track.laps,message:`Volta rápida: ${race[Math.floor(rand(Math.min(10,race.length)))].driver.name}`});

  return {quali:quali.map((q,i)=>({position:i+1,driverId:q.driver.id,teamId:q.team.id})),results,events:events.sort((a,b)=>a.lap-b.lap)};
}
