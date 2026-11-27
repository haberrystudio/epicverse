const book = (n: number) =>
  "https://sacred-texts.com/hin/m" + String(n).padStart(2, "0") + "/index.htm";
const adi = (section: number) =>
  "https://www.ibiblio.org/sripedia/ebooks/mb/m01/m01" +
  String(section + 1).padStart(3, "0") +
  ".htm";
export const sources: Record<string, { name: string; url: string }> = {
  pritha: {
    name: "Adi Parva · CXI · Pritha and her adoptive home",
    url: adi(111),
  },
  descent: { name: "Adi Parva · XCV · The royal genealogy", url: adi(95) },
  parallel: {
    name: "Adi Parva · XCIV · Parallel royal genealogy",
    url: adi(94),
  },
  yayati: {
    name: "Adi Parva · LXXXIV–LXXXV · Yayati and his sons",
    url: adi(84),
  },
  bharata: { name: "Adi Parva · LXXIV · Shakuntala at court", url: adi(74) },
  vow: { name: "Adi Parva · C · Devavrata’s vow", url: adi(100) },
  succession: {
    name: "Adi Parva · CIV–CVII · Preserving the succession",
    url: adi(105),
  },
  kauravas: {
    name: "Adi Parva · CXV–CXVII · Gandhari’s children",
    url: adi(117),
  },
  births: {
    name: "Adi Parva · CXXII–CXXIV · Births of the Pandavas",
    url: adi(123),
  },
  adi: { name: "Adi Parva · The Book of Beginnings", url: book(1) },
  sabha: { name: "Sabha Parva · The Book of the Assembly Hall", url: book(2) },
  virata: { name: "Virata Parva · The year in Matsya", url: book(4) },
  battle: { name: "Bhishma Parva · The first days of battle", url: book(6) },
  drona: { name: "Drona Parva · The battle formations", url: book(7) },
  karna: { name: "Karna Parva · The command of Karna", url: book(8) },
  shalya: { name: "Shalya Parva · The final duel", url: book(9) },
  night: { name: "Sauptika Parva · The night raid", url: book(10) },
  santi: { name: "Santi Parva · The duties of a king", url: book(12) },
  horse: { name: "Aswamedha Parva · Restoration of the heir", url: book(14) },
  forest: {
    name: "Asramavasika Parva · The elders’ retirement",
    url: book(15),
  },
  journey: { name: "Mahaprasthanika Parva · The final journey", url: book(17) },
};
export const tradition = "K. M. Ganguli’s English Mahabharata";
export const chapters = [
  [
    "Ancient Ancestors",
    "A king asks his sons to bear the weight of old age. Puru’s answer changes the succession and gives a royal house its name.",
    "yayati",
  ],
  [
    "The Bharata Line",
    "At court, Shakuntala claims a place for her son. Bharata’s recognition binds a forest childhood to an imperial inheritance.",
    "dushyanta",
  ],
  [
    "The House of Kuru",
    "A river goddess, a king and a prince bound by a vow reshape the future of Hastinapura.",
    "shantanu",
  ],
  [
    "Heirs of Hastinapura",
    "With the throne left without an heir, Satyavati turns to Vyasa. Birth and royal succession take different paths.",
    "pandu",
  ],
  [
    "A Divided House",
    "Two branches grow up at the same court. Kinship becomes rivalry as the sons of Pandu and Dhritarashtra contest the kingdom.",
    "arjuna",
  ],
  [
    "The Surviving Line",
    "The heirs face Kurukshetra. Through Uttara and Parikshit, a family nearly lost to war finds a future.",
    "abhimanyu",
  ],
] as const;
