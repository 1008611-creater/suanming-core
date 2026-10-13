/** Presentation-only snapshots. Removed or locked fields are never restored. */
export function preserveDrafts(get,roots){
const saved=roots.flatMap(id=>[...get(id).querySelectorAll('input[id],select[id],textarea[id],details[id]')].map(n=>{const key=n.tagName==='DETAILS'?'open':'value';return [n.id,key,n[key]];}));
return ()=>{for(const [id,key,value] of saved){const n=get(id);if(n&&!n.disabled)n[key]=value;}};
}
