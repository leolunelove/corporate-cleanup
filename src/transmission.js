// Brief field intelligence stays in the live gameplay view; no separate cutscene state.
export function transmissionFor(mode,floor=0){
 const floors=[['SERVICE PARKING','Clear the parking sections. Restore power, then board the service lift.'],['RETAIL CONCOURSE','Push through the shutters. A survivor is calling from the security room.'],['UPPER RETAIL','The survivor’s bio-signal is unstable. Keep your distance.'],['AFTERMATH','Clear a route to the next lift. Watch the shop entrances.'],['ROOFTOP','Hold until the helicopter arrives, then reach the landing zone.']];
 if(mode==='mall-rescue')return {speaker:'SURVIVOR',channel:'LOCAL / OPEN',title:'NOT ALONE',text:'I thought nobody was coming back. The gun store is across the concourse. Get me to the service lift — I’ll cover you.'};
 if(mode==='mall-transform')return {speaker:'DISPATCH',channel:'BIOHAZARD / PRIORITY',title:'SIGNAL LOST',text:'That is no longer your survivor. Stay clear of the charge. Break its armor, then finish it.'};
 const [title,text]=floors[Math.max(0,Math.min(4,floor))];
 return {speaker:'DISPATCH',channel:'140.85 / SECURE',title,text:mode==='mall-before'?'The mall went silent during lockdown. We have a survivor signal inside. Clear the lot and restore power to the service lift.':text};
}
