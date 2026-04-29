import { create } from 'zustand';
import { regulations, teams, drivers, tracks } from '../data/database';
import { getEra, simulateWeekend } from '../engine/simulation';
import type { DevelopmentProject, Difficulty, DriverStatus, RealityType, SaveGame, StrategyPreset, Team } from '../types/game';

const KEY='f1-legacy-manager-save';

interface GameState {
  save?: SaveGame;
  startCareer: (year:number,teamId:string,realityType:RealityType,chaosLevel:SaveGame['chaosLevel'],difficulty:Difficulty)=>void;
  load:()=>void; persist:()=>void; advanceRound:()=>void; runRace:(strategy:StrategyPreset)=>void;
  startDevelopment:(teamId:string, part:string)=>void; marketAction:(action:'hire'|'renew'|'fire'|'promote',driverId:string,targetTeamId:string)=>void; endSeason:()=>void;
}

const rank = (save:SaveGame) => {
  const dMap = new Map<string, number>(); const tMap = new Map<string, number>();
  save.driverStandings = save.driverStandings.sort((a,b)=>b.points-a.points);
  save.driverStandings.forEach((d,i)=>dMap.set(d.id,i+1));
  save.teamStandings = save.teamStandings.sort((a,b)=>b.points-a.points);
  save.teamStandings.forEach((t,i)=>tMap.set(t.id,i+1));
  return {dMap,tMap};
};

export const useGameStore = create<GameState>((set,get)=>(
{
  load:()=>{ const raw=localStorage.getItem(KEY); if(raw) set({save:JSON.parse(raw)}); },
  persist:()=>{ const s=get().save; if(s) localStorage.setItem(KEY,JSON.stringify(s)); },
  startCareer:(year,teamId,realityType,chaosLevel,difficulty)=>{
    const save:SaveGame={year,currentRound:0,selectedTeamId:teamId,realityType,chaosLevel,difficulty,teams:structuredClone(teams),drivers:structuredClone(drivers),tracks:structuredClone(tracks),regulations:structuredClone(regulations),developments:[],driverStandings:drivers.filter(d=>d.status==='starter').map(d=>({id:d.id,name:d.name,points:0,wins:0})),teamStandings:teams.map(t=>({id:t.id,name:t.name,points:0,wins:0})),championHistory:[]};
    set({save}); get().persist();
  },
  runRace:(strategy)=>{ const save=get().save; if(!save) return; const track=save.tracks[save.currentRound%save.tracks.length]; const era=getEra(save.year,save.regulations);
    const sim=simulateWeekend(save.teams,save.drivers,track,strategy,era); save.lastRace={trackId:track.id,results:sim.results,events:sim.events};
    sim.results.forEach((r,i)=>{const d=save.driverStandings.find((x)=>x.id===r.driverId); const t=save.teamStandings.find((x)=>x.id===r.teamId); if(d){d.points+=r.points; if(i===0)d.wins++;} if(t){t.points+=r.points; if(i===0)t.wins++;}});
    rank(save); set({save}); get().persist();
  },
  advanceRound:()=>{ const save=get().save; if(!save) return; save.currentRound++; if(save.currentRound>=save.tracks.length) get().endSeason(); else {set({save});get().persist();}},
  startDevelopment:(teamId,part)=>{ const save=get().save; if(!save) return; const team=save.teams.find((t)=>t.id===teamId); if(!team) return; const era=getEra(save.year,save.regulations);
    const cost=Math.floor((8+Math.random()*12)*1_000_000*era.devCostMultiplier); if(team.budget*1_000_000<cost) return;
    team.budget-=Math.round(cost/1_000_000);
    const p:DevelopmentProject={id:crypto.randomUUID(),part,cost,weeks:2+Math.floor(Math.random()*6),estimatedGain:1+Math.floor(Math.random()*5),failRisk:Math.floor(Math.random()*35),budgetCapImpact:Math.floor(cost/100000),teamId,status:'ongoing'};
    save.developments.push(p); const fail=Math.random()*100<p.failRisk; if(!fail){ team.car.aerodynamics+=p.estimatedGain; team.car.reliability+=Math.max(1,Math.floor(p.estimatedGain/2)); p.status='done'; } else p.status='failed';
    set({save}); get().persist();
  },
  marketAction:(action,driverId,targetTeamId)=>{ const save=get().save; if(!save) return; const d=save.drivers.find((x)=>x.id===driverId); const t=save.teams.find((x)=>x.id===targetTeamId); if(!d||!t) return;
    if(action==='hire' && d.status==='free'){ d.status='reserve'; d.teamId=t.id; d.salary=Math.floor(d.salary*(1+t.reputation/300)); }
    if(action==='renew'){ d.contractUntil+=2; d.salary=Math.floor(d.salary*1.15); }
    if(action==='fire'){ d.status='free'; d.teamId=undefined; }
    if(action==='promote'){ d.status='starter'; if(!t.driverIds.includes(d.id)) t.driverIds[1]=d.id; }
    set({save}); get().persist();
  },
  endSeason:()=>{ const save=get().save; if(!save) return; rank(save); const champD=save.driverStandings[0]?.name??'N/A'; const champT=save.teamStandings[0]?.name??'N/A'; save.championHistory.push({year:save.year,drivers:champD,constructors:champT});
    save.teams.forEach((t,i)=>{t.budget+=Math.max(10,40-i*2); t.reputation=Math.min(99,t.reputation+(i<3?2:-1));});
    save.drivers.forEach((d)=>{ const delta=d.age<26?2:d.age>33?-2:0; d.overall=Math.max(50,Math.min(99,d.overall+delta+Math.floor(Math.random()*3-1))); d.age+=1; if(d.age>37 && Math.random()<0.15){d.status='free';d.teamId=undefined;} });
    save.year +=1; save.currentRound=0; save.driverStandings.forEach((d)=>{d.points=0;d.wins=0;}); save.teamStandings.forEach((t)=>{t.points=0;t.wins=0;});
    set({save}); get().persist();
  }
}
));
