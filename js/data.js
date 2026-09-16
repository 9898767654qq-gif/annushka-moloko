export const SEASONS = [
  { id: "spring", name: "Весна", emoji: "🌸", days: 7 },
  { id: "summer", name: "Лето", emoji: "☀️", days: 7 },
  { id: "autumn", name: "Осень", emoji: "🍂", days: 7 },
  { id: "winter", name: "Зима", emoji: "❄️", days: 7 }
];
export const BRANCHES = {
  birch: { id: "birch", name: "Берёза", short: "берёзы", emoji: "🍃", seasons: ["spring","summer","autumn"], goatLike: 2, chew: "Зорька спокойно обдирает берёзовую кору.", milk: { clarity: 3, sweetness: 0, density: -1, comfort: 1, zest: 0, dream: 0, spark: 0 } },
  willow: { id: "willow", name: "Ива", short: "ивы", emoji: "🌱", seasons: ["spring","summer"], goatLike: 3, chew: "Зорька довольно жуёт иву.", milk: { clarity: 1, sweetness: 2, density: 0, comfort: 2, zest: 0, dream: 0, spark: 0 } },
  oak: { id: "oak", name: "Дуб", short: "дуба", emoji: "🍂", seasons: ["summer","autumn"], goatLike: 0, chew: "Зорька важно жуёт дуб.", milk: { clarity: -1, sweetness: -1, density: 3, comfort: 0, zest: 1, dream: 0, spark: 0 } },
  apple: { id: "apple", name: "Яблоня", short: "яблони", emoji: "🍎", seasons: ["spring","summer"], goatLike: 3, chew: "Зорька притопывает от яблони.", milk: { clarity: 0, sweetness: 3, density: 0, comfort: 1, zest: 1, dream: 0, spark: 1 } },
  linden: { id: "linden", name: "Липа", short: "липы", emoji: "🌼", seasons: ["summer"], goatLike: 2, chew: "Зорька вдыхает липу.", milk: { clarity: 1, sweetness: 2, density: 0, comfort: 3, zest: 0, dream: 2, spark: 0 } },
  rowan: { id: "rowan", name: "Рябина", short: "рябины", emoji: "🔴", seasons: ["autumn","winter"], goatLike: 1, chew: "Зорька фыркает от кислинки.", milk: { clarity: 0, sweetness: 1, density: 0, comfort: 0, zest: 3, dream: 0, spark: 3 } },
  pine: { id: "pine", name: "Сосна", short: "сосны", emoji: "🌲", seasons: ["autumn","winter"], goatLike: -2, chew: "Зорька сомневается из-за хвои.", milk: { clarity: 1, sweetness: -2, density: 0, comfort: -1, zest: 2, dream: 0, spark: 2 } },
  birdcherry: { id: "birdcherry", name: "Черёмуха", short: "черёмухи", emoji: "🪷", seasons: ["spring","summer"], goatLike: 1, chew: "Зорька жуёт черёмуху медленно.", milk: { clarity: 0, sweetness: 1, density: 1, comfort: 1, zest: 0, dream: 3, spark: 0 } },
  hazel: { id: "hazel", name: "Орешник", short: "орешника", emoji: "🌰", seasons: ["autumn"], goatLike: 1, chew: "Зорька сыто хрустит орешником.", milk: { clarity: -1, sweetness: 0, density: 3, comfort: 1, zest: 0, dream: 0, spark: 0 } }
};
export const JOYS = {
  quiet: { id: "quiet", name: "Тихая радость", verb: "затихает и смотрит ясно", scene: "Ванечка кладёт головку Аннушке на плечо." },
  laugh: { id: "laugh", name: "Смешливая радость", verb: "хохочет и дрыгает ножками", scene: "Ванечка смеётся так, что Зорька выглядывает из-за плетня." },
  sleepy: { id: "sleepy", name: "Сонная радость", verb: "улыбается сквозь сон", scene: "Веки тяжелеют. Пахнет тёплым лугом." },
  full: { id: "full", name: "Сытая радость", verb: "гладит животик", scene: "На щёках появляется румянец." },
  spark: { id: "spark", name: "Радость-искорка", verb: "тычет пальцем в мир", scene: "Ванечка показывает на синицу и на козу." },
  wonder: { id: "wonder", name: "Изумлённая радость", verb: "морщится, потом смотрит внимательно", scene: "Нос морщится от смолы, глаза становятся круглыми." },
  tale: { id: "tale", name: "Сказочная радость", verb: "слушает сказку внутри", scene: "Над кроваткой вспыхивают крошечные сны." },
  none: { id: "none", name: "Никакой радости", verb: "пьёт и молчит", scene: "Искры нет." }
};
export const FOREST_SPOTS = [
  { id: "meadow", name: "Ближний луг", desc: "Ветки у воды.", branches: ["birch","willow"], energy: 1 },
  { id: "ravine", name: "Овраг", desc: "Крепкий лист.", branches: ["oak","hazel"], energy: 1 },
  { id: "orchard", name: "Яблоневый край", desc: "Пахнет цветом.", branches: ["apple","linden"], energy: 1 },
  { id: "pines", name: "Сосняк", desc: "Хвоя и ягода.", branches: ["pine","rowan"], energy: 1 },
  { id: "path", name: "Черёмуховая тропа", desc: "Сюда ходят под вечер.", branches: ["birdcherry","birch"], energy: 1 }
];
export const MAX_ENERGY = 5;
export const MAX_MANGER = 4;
export const START_HAPPINESS = 55;
