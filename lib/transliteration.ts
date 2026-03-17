export const cyrillicToLatinMap: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "ye",
  ё: "yo",
  ж: "j",
  з: "z",
  и: "i",
  й: "i",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  ө: "u",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ү: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shc",
  ы: "i",
  э: "e",
  ю: "yu",
  я: "ya",
  ъ: "",
  ь: "",
};

export const latinToCyrillicMap: Record<string, string> = Object.fromEntries(
  Object.entries(cyrillicToLatinMap).map(([k, v]) => [v, k]),
);

export const transliterate = (text: string, map: Record<string, string>) => {
  return text
    .toLowerCase()
    .split("")
    .map((char) => map[char] || char)
    .join("");
};
