import { BRANCHES, JOYS, MAX_ENERGY } from "./data.js";
import * as G from "./game.js";
let state = G.loadState() || G.createNewState();
let milkHits = [];
let needleTimer = null;
const $ = (id) => document.getElementById(id);
function toast(msg){ if(msg){ state.log=[msg,...state.log.filter(x=>x!==msg)].slice(0,16);} render(); }
function apply(res){ state=res.state; G.saveState(state); toast(res.message); }
function goatFace(){
  if(state.goat.happiness>=75) return "спокойная и светлая";
  if(state.goat.happiness>=50) return "обычная, чуть капризная";
  return "ждёт заботы";
}
function babyFace(){
  const j=state.child.lastJoy;
  if(!j) return "🍼";
  return {quiet:"😌",laugh:"😄",sleepy:"😴",full:"😋",spark:"🤩",wonder:"😮",tale:"✨",none:"😐"}[j]||"🍼";
}
export function render(){
  const season=G.seasonOf(state);
  $("dayline").textContent=`День ${state.day} · ${season.emoji} ${season.name} · сил на лес: ${state.energy}/${MAX_ENERGY}`;
  $("goatH").style.width=`${state.goat.happiness}%`;
  $("babyH").style.width=`${state.child.happiness}%`;
  $("goatVal").textContent=Math.round(state.goat.happiness);
  $("babyVal").textContent=Math.round(state.child.happiness);
  $("joyCount").textContent=`${state.child.joys.length}/7 радостей`;
  $("spots").innerHTML=G.availableSpots(state).map(s=>`<button class="spot" data-spot="${s.id}" ${state.energy<=0?"disabled":""}>${s.name}<small>${s.desc} · ${s.found.map(id=>BRANCHES[id].name.toLowerCase()).join(", ")}</small></button>`).join("");
  $("inv").innerHTML=Object.values(BRANCHES).map(b=>{
    const n=state.inventory[b.id]||0;
    return `<button class="item" data-add="${b.id}" ${!n||state.goat.fedToday?"disabled":""}>${b.emoji} ${b.name} × ${n}<small>коза ${b.goatLike>=2?"любит":b.goatLike<0?"не любит":"терпит"}</small></button>`;
  }).join("");
  $("manger").innerHTML=state.manger.length?state.manger.map((id,i)=>`<span class="chip" data-take="${i}">${BRANCHES[id].emoji} ${BRANCHES[id].name}</span>`).join(""):`<span class="hint">Ясли пусты.</span>`;
  const goat=$("goat");
  goat.className="yard-goat"+(state.goat.happiness>=70?" happy":"")+(state.goat.fedToday&&!state.goat.milkedToday?" chew":"");
  $("goatStatus").textContent=`Зорька ${goatFace()}. Голод ${Math.round(state.goat.hunger)}.`;
  $("babyArt").textContent=babyFace();
  $("babyStatus").textContent=state.child.lastJoy?JOYS[state.child.lastJoy].name:"Ванечка ждёт кружку.";
  const milk=state.milk;
  $("cup").innerHTML=milk?`<strong>${milk.title}</strong><span>${milk.amount} глотков · ${Math.round(milk.quality*100)}%</span>`:`<span class="hint">Кружка пуста.</span>`;
  $("feedBtn").disabled=state.goat.fedToday||!state.manger.length;
  $("petBtn").disabled=state.goat.pettedToday;
  $("milkBtn").disabled=!state.goat.fedToday||state.goat.milkedToday||!!state.milk;
  $("babyBtn").disabled=!state.milk||state.child.fedToday;
  $("sleepBtn").disabled=!G.canSleep(state);
  $("log").innerHTML=state.log.map((line,i)=>`<p>${i===0?"✦ ":""}${line}</p>`).join("");
  $("book").innerHTML=state.book.length?state.book.map(b=>`<li><b>${b.title}</b> — ${b.meal.join(", ")} (день ${b.day})</li>`).join(""):"<li>Пока пусто.</li>";
  if(state.ended){ $("endTitle").textContent=state.ending==="golden"?"Счастливое стадо":state.ending==="warm"?"Тёплый двор":"Тихие дни"; $("endText").textContent=G.endingText(state); $("ending").classList.remove("hidden"); }
  else $("ending").classList.add("hidden");
}
function startMilk(){ if(!state.goat.fedToday||state.goat.milkedToday||state.milk) return; milkHits=[]; $("milkGame").classList.remove("hidden"); moveNeedle(); }
function moveNeedle(){ const needle=$("needle"); let x=0,dir=1; cancelAnimationFrame(needleTimer); const step=()=>{ x+=dir*(1.8+milkHits.length*0.35); if(x>=100){x=100;dir=-1;} if(x<=0){x=0;dir=1;} needle.style.left=`${x}%`; needle.dataset.x=String(x); needleTimer=requestAnimationFrame(step); }; needleTimer=requestAnimationFrame(step); }
function hitMilk(){ const x=Number($("needle").dataset.x||0); const good=x>=58&&x<=76; milkHits.push(good?(1-Math.abs(67-x)/18):Math.max(0.15,0.4-Math.abs(67-x)/80)); if(milkHits.length>=5){ cancelAnimationFrame(needleTimer); $("milkGame").classList.add("hidden"); apply(G.milkGoat(state, milkHits.reduce((a,b)=>a+b,0)/milkHits.length)); } }
function bind(){
  $("spots").addEventListener("click",e=>{ const b=e.target.closest("[data-spot]"); if(b) apply(G.gather(state,b.dataset.spot)); });
  $("inv").addEventListener("click",e=>{ const b=e.target.closest("[data-add]"); if(b) apply(G.addToManger(state,b.dataset.add)); });
  $("manger").addEventListener("click",e=>{ const c=e.target.closest("[data-take]"); if(c) apply(G.takeFromManger(state,Number(c.dataset.take))); });
  $("feedBtn").onclick=()=>apply(G.feedGoat(state));
  $("petBtn").onclick=()=>apply(G.petGoat(state));
  $("milkBtn").onclick=startMilk;
  $("squeeze").onclick=hitMilk;
  $("babyBtn").onclick=()=>apply(G.feedChild(state));
  $("sleepBtn").onclick=()=>apply(G.sleep(state));
  $("resetBtn").onclick=()=>{ G.clearSave(); state=G.createNewState(); toast("Аннушка начинает двор заново."); };
  $("againBtn").onclick=()=>{ G.clearSave(); state=G.createNewState(); $("ending").classList.add("hidden"); toast("Новая весна."); };
  $("closeMilk").onclick=()=>$("milkGame").classList.add("hidden");
}
bind(); render();
