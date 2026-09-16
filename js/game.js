import { BRANCHES, JOYS, FOREST_SPOTS, SEASONS, MAX_ENERGY, MAX_MANGER, START_HAPPINESS } from "./data.js";
const SAVE_KEY = "annushka-moloko-save-v1";
export function createNewState() {
  return {
    day: 1, seasonIndex: 0, energy: MAX_ENERGY,
    inventory: Object.fromEntries(Object.keys(BRANCHES).map((id) => [id, 0])),
    manger: [],
    goat: { name: "Зорька", hunger: 70, mood: 60, happiness: START_HAPPINESS, fedToday: false, milkedToday: false, pettedToday: false, lastMeal: [] },
    milk: null,
    child: { name: "Ванечка", hunger: 65, happiness: START_HAPPINESS, fedToday: false, lastJoy: null, joys: [] },
    log: ["Аннушка открывает калитку. Зорька уже смотрит из загона."],
    book: [], ended: false, ending: null
  };
}
export function seasonOf(state) { return SEASONS[state.seasonIndex % SEASONS.length]; }
export function availableSpots(state) {
  const season = seasonOf(state).id;
  return FOREST_SPOTS.map((spot) => ({ ...spot, found: spot.branches.filter((id) => BRANCHES[id].seasons.includes(season)) })).filter((spot) => spot.found.length);
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
function ok(state, message, extra = {}) { state.log = [message, ...state.log].slice(0, 16); return { ok: true, message, state, ...extra }; }
function fail(state, message) { return { ok: false, message, state }; }
export function gather(state, spotId) {
  if (state.energy <= 0) return fail(state, "Аннушка устала.");
  const spot = availableSpots(state).find((s) => s.id === spotId);
  if (!spot || !spot.found.length) return fail(state, "Здесь сегодня пусто.");
  const id = pick(spot.found);
  const bonus = Math.random() < 0.28 && spot.found.length > 1 ? pick(spot.found.filter((x) => x !== id)) : null;
  state.inventory[id] += 1;
  let msg = `На ${spot.name.toLowerCase()} Аннушка срезала ветку ${BRANCHES[id].short}.`;
  if (bonus) { state.inventory[bonus] += 1; msg += ` И ещё ${BRANCHES[bonus].short}.`; }
  state.energy -= 1;
  return ok(state, msg);
}
export function addToManger(state, branchId) {
  if (state.goat.fedToday) return fail(state, "Зорька уже ела.");
  if (!state.inventory[branchId]) return fail(state, "Такой ветки нет.");
  if (state.manger.length >= MAX_MANGER) return fail(state, "Ясли полны.");
  state.inventory[branchId] -= 1; state.manger.push(branchId);
  return ok(state, `В ясли легла ветка ${BRANCHES[branchId].short}.`);
}
export function takeFromManger(state, index) {
  if (state.goat.fedToday) return fail(state, "Уже съедено.");
  const id = state.manger.splice(index, 1)[0];
  if (id) state.inventory[id] += 1;
  return ok(state, id ? `Аннушка вынула ${BRANCHES[id].short}.` : "Ясли пусты.");
}
export function feedGoat(state) {
  if (state.goat.fedToday) return fail(state, "Зорька уже сыта.");
  if (!state.manger.length) return fail(state, "Ясли пусты.");
  const meal = [...state.manger];
  const taste = meal.reduce((sum, id) => sum + BRANCHES[id].goatLike, 0);
  const variety = new Set(meal).size;
  const pineCount = meal.filter((id) => id === "pine").length;
  let deltaHappy = 4 + taste * 3 + (variety > 1 ? 4 : 0);
  if (pineCount >= 2) deltaHappy -= 10;
  if (variety >= 4) deltaHappy -= 8;
  state.goat.hunger = clamp(state.goat.hunger - 35 + meal.length * 6, 0, 100);
  state.goat.mood = clamp(state.goat.mood + taste * 4 - pineCount * 6, 5, 100);
  state.goat.happiness = clamp(state.goat.happiness + deltaHappy, 0, 100);
  state.goat.fedToday = true; state.goat.lastMeal = meal; state.manger = [];
  return ok(state, BRANCHES[meal[0]].chew + (taste >= 5 ? " Она довольно мекает." : " Жуёт сосредоточенно."));
}
export function petGoat(state) {
  if (state.goat.pettedToday) return fail(state, "Зорька уже наглажена.");
  state.goat.pettedToday = true;
  state.goat.happiness = clamp(state.goat.happiness + (state.goat.fedToday ? 6 : 3), 0, 100);
  return ok(state, state.goat.fedToday ? "Аннушка чешет Зорьку за ухом." : "Зорька подставляет шею.");
}
export function composeMilk(meal) {
  const acc = { clarity: 0, sweetness: 0, density: 0, comfort: 0, zest: 0, dream: 0, spark: 0 };
  meal.forEach((id) => { const m = BRANCHES[id].milk; Object.keys(acc).forEach((k) => { acc[k] += m[k]; }); });
  if (new Set(meal).size >= 4) Object.keys(acc).forEach((k) => { acc[k] = Math.round(acc[k] * 0.35); });
  return acc;
}
export function nameMilk(props, meal, quality) {
  if (new Set(meal).size >= 4) return { title: "Каша из веток", tone: "none" };
  if (props.dream >= 3 && props.clarity >= 2) return { title: "Сказочное молоко", tone: "tale" };
  if (props.spark >= 3 && props.zest >= 3) return { title: "Молоко-искорка", tone: "spark" };
  if (props.sweetness >= 3 && meal.includes("apple")) return { title: "Смешливое яблочное", tone: "laugh" };
  if (props.comfort >= 3 && props.dream >= 2) return { title: "Тихое липовое", tone: "sleepy" };
  if (props.density >= 4) return { title: "Сытное дубовое", tone: "full" };
  if (props.zest >= 2 && meal.includes("pine")) return { title: "Смолистое с огоньком", tone: "wonder" };
  const top = Object.entries(props).sort((a, b) => b[1] - a[1])[0][0];
  if (top === "clarity") return { title: "Чистое берёзовое", tone: "quiet" };
  if (top === "comfort") return { title: "Мягкое ивовое", tone: "quiet" };
  if (top === "dream") return { title: "Черёмуховое", tone: "tale" };
  if (top === "sweetness") return { title: "Сладкое цветочное", tone: "laugh" };
  if (top === "density") return { title: "Густое сытное", tone: "full" };
  return { title: quality >= 0.7 ? "Тёплое молоко" : "Бледное молоко", tone: quality >= 0.55 ? "quiet" : "none" };
}
export function describeMilk(props) {
  const bits = [];
  if (props.density >= 3) bits.push("густое"); else if (props.density <= 0) bits.push("тонкое");
  if (props.sweetness >= 2) bits.push("сладковатое");
  if (props.clarity >= 2) bits.push("светлое");
  if (props.dream >= 2) bits.push("с запахом сна");
  if (props.spark >= 2) bits.push("с искоркой");
  return bits.length ? `Оно ${bits.join(", ")}.` : "Оно почти без голоса.";
}
export function milkGoat(state, quality) {
  if (!state.goat.fedToday) return fail(state, "Сначала покорми Зорьку.");
  if (state.goat.milkedToday) return fail(state, "Уже доили.");
  if (state.milk) return fail(state, "Кружка ещё полна.");
  const meal = state.goat.lastMeal;
  const props = composeMilk(meal);
  const q = clamp(quality, 0.25, 1);
  Object.keys(props).forEach((k) => { props[k] = Math.round(props[k] * (0.6 + q * 0.4) * 10) / 10; });
  const named = nameMilk(props, meal, q);
  state.goat.milkedToday = true;
  state.goat.happiness = clamp(state.goat.happiness + (q > 0.7 ? 4 : q < 0.4 ? -3 : 1), 0, 100);
  state.milk = { ...named, props, quality: q, amount: Math.round(3 + meal.length + q * 4 + state.goat.happiness / 25), meal };
  if (!state.book.some((b) => b.title === named.title)) state.book.push({ title: named.title, meal: meal.map((id) => BRANCHES[id].name), day: state.day });
  return ok(state, `В кружке «${named.title}». ${describeMilk(props)}`);
}
export function feedChild(state) {
  if (!state.milk) return fail(state, "Сначала подои.");
  if (state.child.fedToday) return fail(state, "Ванечка уже пил.");
  const milk = state.milk; const joyId = milk.tone; const joy = JOYS[joyId] || JOYS.none;
  let delta = joyId === "none" ? -4 : 8 + Math.round(milk.quality * 8);
  if (milk.quality < 0.4) delta -= 5;
  state.child.happiness = clamp(state.child.happiness + delta, 0, 100);
  state.child.hunger = clamp(state.child.hunger - 40, 0, 100);
  state.child.fedToday = true; state.child.lastJoy = joyId;
  if (joyId !== "none" && !state.child.joys.includes(joyId)) state.child.joys.push(joyId);
  state.milk = null;
  return ok(state, `Ванечка пьёт. Он ${joy.verb}. ${joy.scene}`);
}
export function canSleep(state) { return state.goat.fedToday && state.goat.milkedToday && state.child.fedToday; }
export function sleep(state) {
  if (!canSleep(state)) return fail(state, "Ещё не все дела двора сделаны.");
  const both = state.goat.happiness >= 70 && state.child.happiness >= 70;
  state.day += 1;
  if (state.day % 8 === 1 && state.day > 1) state.seasonIndex = (state.seasonIndex + 1) % SEASONS.length;
  state.energy = MAX_ENERGY; state.manger = []; state.milk = null;
  state.goat.fedToday = false; state.goat.milkedToday = false; state.goat.pettedToday = false;
  state.goat.hunger = clamp(state.goat.hunger + 28, 20, 100);
  state.child.fedToday = false; state.child.hunger = clamp(state.child.hunger + 30, 15, 100);
  state.goat.happiness = clamp(state.goat.happiness - 4, 0, 100);
  state.child.happiness = clamp(state.child.happiness - 3, 0, 100);
  if (state.day > 28) {
    state.ended = true;
    const joys = state.child.joys.length;
    state.ending = (state.goat.happiness >= 75 && state.child.happiness >= 75 && joys >= 5) ? "golden" : (state.goat.happiness >= 50 && state.child.happiness >= 50) ? "warm" : "quiet";
    return ok(state, endingText(state));
  }
  const season = seasonOf(state);
  return ok(state, both ? `Вечер тёплый. День ${state.day}, ${season.name.toLowerCase()}.` : `Аннушка гасит лучину. День ${state.day}, ${season.name.toLowerCase()}.`);
}
export function endingText(state) {
  if (state.ending === "golden") return "Зорька светится, Ванечка знает радости. Счастливое стадо.";
  if (state.ending === "warm") return "Двор жил. Коза и ребёнок не были забыты.";
  return "Дни прошли тихо. Можно начать снова.";
}
export function saveState(state) { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }
export function loadState() { try { const raw = localStorage.getItem(SAVE_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; } }
export function clearSave() { localStorage.removeItem(SAVE_KEY); }
