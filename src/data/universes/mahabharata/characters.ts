import { lifeEvents } from "./events";
import { characterSchema, type Character } from "@/data/schema";

const people: Character[] = [];
const paintings = new Set(
  "yayati sharmishtha devayani puru dushyanta shakuntala bharata hasti kuru pratipa shantanu ganga satyavati bhishma vyasa dhritarashtra pandu vidura gandhari kunti madri yudhishthira bhima arjuna nakula sahadeva duryodhana dushasana karna subhadra duhshala krishna parikshit parashara vikarna draupadi abhimanyu".split(
    " ",
  ),
);
type Details = Partial<
  Omit<
    Character,
    "id" | "name" | "biography" | "title" | "generation" | "chapter"
  >
>;
const kingdoms: Record<string, string> = {
  Kuru: "Hastinapura",
  Panchala: "Panchala",
  Matsya: "Matsya",
  Gandhara: "Gandhara",
  Madra: "Madra",
  Yadava: "Dvaraka",
};
function record(
  id: string,
  name: string,
  title: string,
  generation: number,
  chapter: number,
  biography: string,
  details: Details = {},
) {
  const branch = [
    "Early Pauravas",
    "Bharata line",
    "Royal house",
    "Royal house",
    "Pandavas",
    "Later heirs",
  ][chapter];
  const dynasty = chapter < 2 ? "Paurava" : "Kuru";
  const person = characterSchema.parse({
    id,
    universe: "mahabharata",
    name,
    title,
    generation,
    chapter,
    biography,
    branch,
    dynasty,
    gender: "Male",
    aliases: [],
    events: lifeEvents[id] ?? [],
    skills: [],
    major: paintings.has(id),
    war: false,
    sources: ["descent"],
    register: false,
    portrait: paintings.has(id)
      ? id
      : details.gender === "Female"
        ? "shakuntala"
        : chapter < 3
          ? "dushyanta"
          : "puru",
    kingdom: kingdoms[details.dynasty ?? dynasty],
    ...details,
  });
  people.push(person);
}
record(
  "sharmishtha",
  "Sharmishtha",
  "Princess of the Asuras",
  1,
  0,
  "Vrishaparvan’s daughter enters Yayati’s household alongside Devayani. Her youngest son Puru accepts a burden his elder brothers refuse and inherits the kingdom.",
  {
    gender: "Female",
    aliases: ["Sarmishtha"],
    dynasty: "Asura",
    sources: ["descent", "yayati"],
  },
);
record(
  "yayati",
  "Yayati",
  "King of the Lunar line",
  1,
  0,
  "When Yayati loses his youth, he asks his sons to exchange their youth for his old age. Only Puru agrees. After discovering that desire grows with indulgence, Yayati restores his son’s youth and names him heir.",
  {
    dynasty: "Lunar",
    events: [
      "Rules as a king in Nahusha’s line.",
      "Receives Puru’s youth in exchange for old age.",
      "Restores his son’s youth and entrusts him with the kingdom.",
    ],
    sources: ["yayati", "descent"],
  },
);
record(
  "devayani",
  "Devayani",
  "Daughter of Shukra",
  1,
  0,
  "Devayani marries Yayati and becomes the mother of Yadu and Turvasu. Her discovery of Sharmishtha’s children brings the household dispute before her father Shukra.",
  { gender: "Female", dynasty: "Bhargava", sources: ["adi", "descent"] },
);
record(
  "puru",
  "Puru",
  "Heir to Yayati",
  2,
  0,
  "The youngest son accepts his father’s old age when his brothers decline. Yayati rewards that act by choosing him as successor. The Pauravas trace their name to him.",
  {
    events: [
      "Accepts Yayati’s old age.",
      "Receives his youth again.",
      "Succeeds his father.",
    ],
    sources: ["yayati", "descent"],
  },
);
for (const name of ["Yadu", "Turvasu", "Druhyu", "Anu"])
  record(
    name.toLowerCase(),
    name,
    "Son of Yayati",
    2,
    0,
    name === "Yadu"
      ? "Devayani’s son is the ancestor after whom the Yadavas are named. His younger half-brother Puru succeeds their father."
      : "Yayati’s account names " +
          name +
          " among Puru’s brothers. The succession passes to Puru after the exchange of youth.",
    { dynasty: name === "Yadu" ? "Yadava" : "Lunar" },
  );
export const earlyLine = [
  "puru",
  "janamejaya-elder",
  "prachinwat",
  "sanyati",
  "ahayanti",
  "sarvabhauma",
  "jayatsena",
  "avachina",
  "arihan-first",
  "mahabhauma",
  "ayutanayi",
  "akrodhana",
  "devatithi",
  "arihan-second",
  "riksha",
  "matinara",
  "tansu",
  "ilina",
  "dushyanta",
  "bharata",
  "bhumanyu",
  "suhotra",
  "hasti",
  "vikunthana",
  "ajamidha",
  "samvarana",
  "kuru",
  "viduratha",
  "anaswan",
  "parikshit-elder",
  "bhimasena-elder",
  "pratisravas",
  "pratipa",
  "shantanu",
];
const kingDetails: Record<string, [string, string, string?]> = {
  "janamejaya-elder": [
    "Janamejaya the Elder",
    "Son of Puru",
    "Kausalya’s son performs royal sacrifices before retiring to the woods.",
  ],
  "arihan-first": ["Arihan", "Son of Avachina"],
  "arihan-second": ["Arihan", "Son of Devatithi"],
  "parikshit-elder": ["Parikshit the Elder", "Ancestor of Pratipa"],
  "bhimasena-elder": ["Bhimasena the Elder", "Ancestor of Pratipa"],
  dushyanta: [
    "Dushyanta",
    "The Paurava king",
    "A hunting expedition brings Dushyanta to Shakuntala’s hermitage. When she later presents their son at his court, a heavenly voice confirms the child’s parentage and the king accepts Bharata.",
  ],
  bharata: [
    "Bharata",
    "The namesake emperor",
    "Raised in a forest hermitage, the child Sarvadamana is renowned for mastering wild animals. Acknowledged by Dushyanta, he becomes Bharata, the sovereign whose name the epic’s royal descendants bear.",
  ],
  hasti: [
    "Hasti",
    "Founder of Hastinapura",
    "Suhotra’s son establishes the city that bears his name. Through Vikunthana his lineage continues towards the house of Kuru.",
  ],
  kuru: [
    "Kuru",
    "Namesake of Kurukshetra",
    "Born to Samvarana and Tapati, Kuru gives his name to the royal house. The epic connects his austerities to the sacred ground on which his descendants will fight.",
  ],
  pratipa: [
    "Pratipa",
    "Father of Shantanu",
    "At the Ganges, Pratipa promises the river goddess a place in his family. His son Shantanu comes to the throne after his elder brother Devapi turns to life in the woods.",
  ],
  shantanu: [
    "Shantanu",
    "Sovereign of Hastinapura",
    "Shantanu’s marriage to Ganga gives him Devavrata. Years later his desire to marry Satyavati leads Devavrata to renounce both kingship and children. The throne passes to Satyavati’s sons.",
  ],
};
function display(id: string) {
  return kingDetails[id]?.[0] ?? id[0].toUpperCase() + id.slice(1);
}
for (let i = 1; i < earlyLine.length; i++) {
  const id = earlyLine[i],
    info = kingDetails[id],
    chapter = i < 18 ? 0 : i < 26 ? 1 : 2;
  const next = earlyLine[i + 1];
  record(
    id,
    display(id),
    info?.[1] ?? "King in the Paurava succession",
    i + 2,
    chapter,
    info?.[2] ??
      "The royal genealogy names " +
        display(earlyLine[i - 1]) +
        " as the father of " +
        display(id) +
        ". " +
        (next ? "The line continues through " + display(next) + "." : ""),
    {
      aliases:
        id === "dushyanta"
          ? ["Dushmanta", "Dushyant"]
          : id === "shantanu"
            ? ["Santanu"]
            : id === "bharata"
              ? ["Sarvadamana"]
              : [],
      sources:
        id === "kuru"
          ? ["descent", "parallel"]
          : id === "bharata" || id === "dushyanta"
            ? ["descent", "bharata"]
            : id === "shantanu"
              ? ["descent", "vow"]
              : ["descent"],
    },
  );
}
const row = (
  id: string,
  name: string,
  title: string,
  gen: number,
  ch: number,
  bio: string,
  extra: Details = {},
) => record(id, name, title, gen, ch, bio, extra);
row(
  "shakuntala",
  "Shakuntala",
  "Mother of Bharata",
  20,
  1,
  "Raised by Kanva in his hermitage, Shakuntala meets Dushyanta there. She later brings their son to court and argues for the child’s right to recognition.",
  { gender: "Female", aliases: ["Sakuntala"], sources: ["bharata", "descent"] },
);
row(
  "tapati",
  "Tapati",
  "Daughter of the Sun",
  27,
  1,
  "Tapati marries Samvarana. Their son Kuru gives his name to a dynasty and to the field central to the epic.",
  { gender: "Female", dynasty: "Solar" },
);
row(
  "ganga",
  "Ganga",
  "Goddess of the river",
  35,
  2,
  "Ganga enters Shantanu’s household on a condition that he will never question her actions. She departs when he intervenes to save their eighth child, then returns the educated Devavrata to his father.",
  { gender: "Female", dynasty: "Celestial", sources: ["adi", "descent"] },
);
row(
  "satyavati",
  "Satyavati",
  "Queen of Hastinapura",
  35,
  2,
  "Before marrying Shantanu, Satyavati bears the sage Vyasa to Parashara. When her two royal sons die without heirs, she calls on Vyasa to preserve the succession.",
  {
    gender: "Female",
    aliases: ["Gandhakali", "Matsyagandha"],
    sources: ["descent", "succession"],
  },
);
row(
  "parashara",
  "Parashara",
  "Sage of the river crossing",
  35,
  2,
  "During a river crossing Parashara encounters Satyavati. Their child, born on an island, becomes known as Krishna Dvaipayana Vyasa.",
  { dynasty: "Sage lineage", sources: ["adi", "descent"] },
);
row(
  "bhishma",
  "Bhishma",
  "Keeper of the terrible vow",
  36,
  2,
  "Born Devavrata, he gives up the throne and takes a lifelong vow of celibacy so his father can marry Satyavati. He protects successive generations of Kurus, commands their first army and teaches Yudhishthira from his bed of arrows.",
  {
    aliases: ["Devavrata", "Gangeya"],
    war: true,
    skills: ["Archery", "Statecraft"],
    sources: ["vow", "battle", "santi"],
    events: [
      "Renounces succession and marriage.",
      "Commands the Kaurava host.",
      "Falls on a bed of arrows.",
      "Instructs Yudhishthira on kingship.",
    ],
  },
);
row(
  "chitrangada",
  "Chitrangada",
  "Elder son of Satyavati",
  36,
  2,
  "Shantanu’s elder son by Satyavati succeeds him. A Gandharva who shares his name challenges him, and his death leaves the throne to his younger brother.",
  { sources: ["adi", "descent"] },
);
row(
  "vichitravirya",
  "Vichitravirya",
  "Younger son of Satyavati",
  36,
  2,
  "Bhishma secures the marriages of the young king to Ambika and Ambalika. His death without children leaves the dynasty dependent on a new arrangement for succession.",
);
row(
  "vyasa",
  "Vyasa",
  "Sage and composer",
  36,
  2,
  "Satyavati calls her firstborn son back to the court after Vichitravirya’s death. Through niyoga he fathers Dhritarashtra, Pandu and Vidura. The epic also gives him the role of arranging and transmitting its account.",
  {
    aliases: ["Krishna Dvaipayana", "Vedavyasa"],
    dynasty: "Sage lineage",
    sources: ["succession", "adi"],
  },
);
for (const [id, name, child] of [
  ["ambika", "Ambika", "Dhritarashtra"],
  ["ambalika", "Ambalika", "Pandu"],
])
  row(
    id,
    name,
    "Princess of Kashi",
    36,
    2,
    name +
      " becomes a queen of Vichitravirya. After his death, she bears " +
      child +
      " through Vyasa in the succession arranged by Satyavati.",
    { gender: "Female", dynasty: "Kashi", sources: ["succession", "descent"] },
  );
row(
  "attendant",
  "Ambika’s attendant",
  "Mother of Vidura",
  36,
  2,
  "The unnamed attendant receives Vyasa with composure. The son born of their meeting is Vidura, whose counsel becomes central to the Kuru court.",
  { gender: "Female", dynasty: "Unrecorded", sources: ["succession"] },
);
row(
  "dhritarashtra",
  "Dhritarashtra",
  "The blind king",
  37,
  3,
  "Born blind to Ambika and Vyasa, he presides over a court divided between his sons and the sons of Pandu. His attachment to Duryodhana shapes his decisions before the war. In old age he retires to the forest.",
  { sources: ["succession", "sabha", "forest"] },
);
row(
  "pandu",
  "Pandu",
  "King in exile",
  37,
  3,
  "A curse received while hunting drives Pandu into the forest. Kunti and Madri bear five sons through divine invocation who belong to his royal house. He dies after approaching Madri, fulfilling the curse.",
  {
    events: [
      "Ascends the Kuru throne.",
      "Retires to the forest following a curse.",
      "Recognises the five sons of his house.",
      "Dies in the forest.",
    ],
    sources: ["descent", "births"],
  },
);
row(
  "vidura",
  "Vidura",
  "Counsellor of the Kurus",
  37,
  3,
  "Vidura repeatedly warns the court against endangering Pandu’s sons. His warning helps them escape the house of lac. During the dice game his protests question the conduct of the assembly.",
  { sources: ["succession", "adi", "sabha"] },
);
row(
  "gandhari",
  "Gandhari",
  "Queen of Gandhara’s line",
  37,
  3,
  "Gandhari binds her eyes on marrying Dhritarashtra. She becomes mother to the Kaurava brothers and their sister. After Kurukshetra, her grief gives voice to the cost of the victory.",
  { gender: "Female", dynasty: "Gandhara", sources: ["kauravas", "forest"] },
);
row(
  "kunti",
  "Kunti",
  "Mother of the Pandavas",
  37,
  3,
  "Born Pritha and raised by Kuntibhoja, Kunti receives a mantra of invocation. She bears Karna before marriage and later becomes mother to Yudhishthira, Bhima and Arjuna. She raises Madri’s twins after Pandu’s death.",
  {
    gender: "Female",
    aliases: ["Pritha"],
    dynasty: "Yadava",
    sources: ["adi", "births", "descent"],
  },
);
row(
  "madri",
  "Madri",
  "Princess of Madra",
  37,
  3,
  "Pandu’s second queen uses the invocation shared by Kunti to call the twin Ashvins. Her sons are Nakula and Sahadeva. At Pandu’s death she entrusts the boys to Kunti.",
  { gender: "Female", dynasty: "Madra", sources: ["births", "descent"] },
);
for (const [id, name, title] of [
  ["dharma", "Dharma", "Lord of righteousness"],
  ["vayu", "Vayu", "Lord of the wind"],
  ["indra", "Indra", "King of the gods"],
  ["ashvins", "The Ashvins", "The celestial twins"],
  ["surya", "Surya", "The sun god"],
])
  row(
    id,
    name,
    title,
    37,
    3,
    title +
      " appears in the epic’s account of divine parentage. The royal genealogy distinguishes the invoked deities from the human household that raises each child.",
    {
      gender: id === "ashvins" ? "Collective" : "Male",
      dynasty: "Celestial",
      branch: "Divine kin",
      sources: ["births", "adi"],
    },
  );
for (const [id, name, title, bio, skill] of [
  [
    "yudhishthira",
    "Yudhishthira",
    "The Dharma King",
    "The eldest Pandava wins a kingdom and loses it in the game of dice. Exile and war compel him to weigh duty against the cost of power. He receives Bhishma’s instruction and later leaves the throne to Parikshit.",
    "Statecraft",
  ],
  [
    "bhima",
    "Bhima",
    "Son of the Wind",
    "Bhima’s strength protects his family in exile. His son Ghatotkacha fights beside the Pandavas. At Kurukshetra Bhima fulfils the vows born of the dice hall and faces Duryodhana in the final mace duel.",
    "Mace fighting",
  ],
  [
    "arjuna",
    "Arjuna",
    "Bearer of Gandiva",
    "Trained by Drona, Arjuna wins Draupadi’s marriage contest and later marries Subhadra. Facing his kinsmen on the battlefield, he turns to Krishna for counsel. Abhimanyu’s son carries his line beyond the war.",
    "Archery · Gandiva",
  ],
  [
    "nakula",
    "Nakula",
    "The elder Ashvin twin",
    "Madri’s son grows up alongside Kunti’s sons. During the year in hiding he tends the horses of Virata. He fights on the Pandava side and joins his brothers on their last journey.",
    "Horsemanship",
  ],
  [
    "sahadeva",
    "Sahadeva",
    "The younger Ashvin twin",
    "Sahadeva tends Virata’s cattle during the concealed year. He joins the war alongside his brothers and kills Shakuni, whose dice had helped strip them of their kingdom.",
    "Cattle husbandry",
  ],
])
  row(id, name, title, 38, 4, bio, {
    war: true,
    skills: [skill],
    sources: ["descent", "virata", "battle", "shalya", "journey"],
    ...{
      aliases:
        (
          {
            arjuna: ["Partha", "Dhananjaya"],
            bhima: ["Bhimasena", "Vrikodara"],
            yudhishthira: ["Dharmaraja"],
          } as Record<string, string[]>
        )[id] ?? [],
    },
  });
row(
  "draupadi",
  "Draupadi",
  "Queen of Panchala’s line",
  38,
  4,
  "Born from Drupada’s sacrificial fire, Draupadi marries all five Pandavas. Her question about the legality of her loss at dice challenges the whole assembly. After the war she mourns the five sons killed in the night raid.",
  {
    gender: "Female",
    dynasty: "Panchala",
    aliases: ["Panchali", "Krishnaa", "Yajnaseni"],
    sources: ["adi", "sabha", "night"],
  },
);
row(
  "subhadra",
  "Subhadra",
  "Princess of Dvaraka",
  38,
  4,
  "Krishna’s sister marries Arjuna and gives birth to Abhimanyu. Through Abhimanyu’s son Parikshit her Yadava family is joined to the surviving royal line.",
  { gender: "Female", dynasty: "Yadava" },
);
row(
  "krishna",
  "Krishna",
  "Arjuna’s charioteer",
  38,
  4,
  "Subhadra’s brother accompanies Arjuna as his unarmed charioteer. Their dialogue at Kurukshetra becomes the Bhagavad Gita.",
  {
    dynasty: "Yadava",
    aliases: ["Vasudeva", "Keshava"],
    war: true,
    sources: ["battle", "adi"],
  },
);
row(
  "karna",
  "Karna",
  "King of Anga",
  38,
  4,
  "Born to Kunti through Surya before her marriage, Karna is raised by Adhiratha and Radha. Duryodhana grants him Anga and wins his enduring allegiance. His rivalry with Arjuna ends in their fatal encounter at Kurukshetra.",
  {
    branch: "House of Anga",
    kingdom: "Anga",
    aliases: ["Radheya", "Vasusena"],
    war: true,
    skills: ["Archery"],
    sources: ["adi", "karna"],
  },
);
for (const [id, name, gender] of [
  ["radha", "Radha", "Female"],
  ["adhiratha", "Adhiratha", "Male"],
] as const)
  row(
    id,
    name,
    "Foster parent of Karna",
    37,
    3,
    name +
      " raises the infant Karna in a charioteer’s household. His foster ties remain important to his identity after his birth parentage is revealed.",
    {
      gender,
      branch: "House of Anga",
      dynasty: "Suta household",
      sources: ["adi", "karna"],
    },
  );
row(
  "vaishya-mother",
  "Yuyutsu’s mother",
  "Woman of the Vaishya community",
  37,
  3,
  "The birth account distinguishes her son Yuyutsu from Gandhari’s children. It records her community without giving her a personal name.",
  { gender: "Female", dynasty: "Unrecorded", sources: ["kauravas"] },
);
export const princes =
  "Duryodhana Yuyutsu Dushasana Duhsaha Duhsala Jalasandha Sama Saha Vinda Anuvinda Durdharsha Suvahu Dushpradharshana Durmarshana Durmukha Dushkarna Karna Vivinsati Vikarna Sala Satwa Sulochana Chitra Upachitra Chitraksha Charuchitra Sarasana Durmada Durvigaha Vivitsu Vikatanana Urnanabha Sunabha Nandaka Upanandaka Chitravana Chitravarman Suvarman Durvimochana Ayovahu Mahavahu Chitranga Chitrakundala Bhimavega Bhimavala Balaki Balavardhana Ugrayudha Bhima Karna Kanakaya Dridhayudha Dridhavarman Dridhakshatra Somakitri Anudara Dridhasandha Jarasandha Satyasandha Sada Suvak Ugrasravas Ugrasena Senani Dushparajaya Aparajita Kundasayin Visalaksha Duradhara Dridhahasta Suhasta Vatavega Suvarchas Adityaketu Vahvashin Nagadatta Agrayayin Kavachin Krathana Kunda Kundadhara Dhanurdhara Ugra Bhimaratha Viravahu Alolupa Abhaya Raudrakarman Dridharatha Anadhrishya Kundabhedin Viravi Dhirghalochana Pramatha Pramathi Dhirgharoma Dirghavahu Mahavahu Vyudhoru Kanakadhvaja Kundasi Virajas".split(
    " ",
  );
export const princeIds = princes.map((name, i) =>
  ["Duryodhana", "Dushasana", "Yuyutsu", "Vikarna"].includes(name)
    ? name.toLowerCase()
    : "kaurava-" + name.toLowerCase() + "-" + (i + 1),
);
const princely: Record<string, string> = {
  duryodhana:
    "Dhritarashtra’s eldest son refuses to yield the disputed inheritance. His friendship with Karna anchors his cause. Defeated by Bhima in a mace duel, he witnesses the ruin of the house he sought to rule.",
  dushasana:
    "Duryodhana’s brother drags Draupadi into the assembly after the game of dice. Bhima vows vengeance and kills him during the war.",
  vikarna:
    "In the dice hall Vikarna objects to the treatment of Draupadi. His protest stands apart from the silence of the assembly, although he fights for his brothers in the war.",
  yuyutsu:
    "Dhritarashtra’s son by a Vaishya woman chooses the Pandava side before the fighting begins. His decision places the obligation of conscience above loyalty to his half-brothers.",
};
princes.forEach((name, i) => {
  const id = princeIds[i];
  row(
    id,
    name,
    id === "duryodhana" ? "Eldest Kaurava" : "Prince of Hastinapura",
    38,
    4,
    princely[id] ??
      "The Sambhava Parva includes " +
        name +
        " in its register of Dhritarashtra’s sons. His place in this household is preserved by name in the genealogy.",
    {
      branch: "Kauravas",
      war: !!princely[id],
      register: !princely[id],
      major: !!princely[id],
      sources: princely[id]
        ? ["kauravas", "sabha", "battle", "karna", "shalya"]
        : ["kauravas"],
      aliases:
        id === "dushasana"
          ? ["Duhsasana"]
          : id === "duryodhana"
            ? ["Suyodhana"]
            : [],
    },
  );
});
row(
  "duhshala",
  "Duhshala",
  "Princess of Hastinapura",
  38,
  4,
  "Gandhari’s daughter marries Jayadratha of Sindhu. Her marriage extends the Kuru family into the Saindhava royal house.",
  {
    gender: "Female",
    branch: "Kauravas",
    aliases: ["Dushala", "Duhsala", "Duhshala"],
    sources: ["kauravas", "horse"],
  },
);
row(
  "jayadratha",
  "Jayadratha",
  "King of Sindhu",
  38,
  4,
  "Duhshala’s husband fights for the Kauravas. His role in isolating Abhimanyu brings him into deadly conflict with Arjuna.",
  {
    dynasty: "Saindhava",
    branch: "Kauravas",
    kingdom: "Sindhu",
    war: true,
    sources: ["kauravas", "drona"],
  },
);
row(
  "hidimbi",
  "Hidimbi",
  "Mother of Ghatotkacha",
  38,
  4,
  "Hidimbi meets Bhima in the forest after the Pandavas escape the house of lac. Their child Ghatotkacha later joins his father’s side in the war.",
  { gender: "Female", dynasty: "Rakshasa", sources: ["adi", "descent"] },
);
row(
  "drona",
  "Drona",
  "Teacher of the Kuru princes",
  37,
  3,
  "The princes of Hastinapura learn the use of arms from Drona. Arjuna becomes his foremost archer. During the war Drona assumes command after Bhishma falls.",
  { dynasty: "Bharadvaja", war: true, sources: ["adi", "drona"] },
);
row(
  "abhimanyu",
  "Abhimanyu",
  "Heir of Arjuna",
  39,
  5,
  "Arjuna and Subhadra’s son marries Uttara of Matsya. At Kurukshetra he penetrates the Kaurava battle formation and is cut off from his allies. His posthumous son Parikshit survives the destruction of the Kuru heirs.",
  { war: true, sources: ["descent", "virata", "drona", "horse"] },
);
row(
  "uttara",
  "Uttara",
  "Princess of Matsya",
  39,
  5,
  "Virata’s daughter learns dance from Arjuna in his disguise as Brihannala. She marries his son Abhimanyu. After the war she gives birth to Parikshit.",
  { gender: "Female", dynasty: "Matsya", sources: ["virata", "horse"] },
);
row(
  "ghatotkacha",
  "Ghatotkacha",
  "Son of the forest",
  39,
  5,
  "Bhima and Hidimbi’s son fights for the Pandavas. His prowess in a night battle forces Karna to expend the celestial dart he had kept for Arjuna.",
  { dynasty: "Rakshasa", war: true, sources: ["descent", "drona"] },
);
row(
  "parikshit",
  "Parikshit",
  "The surviving heir",
  40,
  5,
  "Abhimanyu’s son survives the attack on Uttara’s womb through Krishna’s intervention. He succeeds the departing Pandavas. His death by Takshaka sets the scene for Janamejaya’s snake sacrifice.",
  { sources: ["adi", "horse", "journey"] },
);
row(
  "janamejaya",
  "Janamejaya",
  "Listener to the epic",
  41,
  5,
  "At his sacrifice against the serpents, Parikshit’s son hears Vaishampayana recount the history of his own family. His court becomes the setting for the telling of the Mahabharata.",
  { sources: ["adi", "descent"] },
);
export const youngerSons = [
  "Prativindhya",
  "Sutasoma",
  "Srutakriti",
  "Satanika",
  "Srutakarman",
];
youngerSons.forEach((name) =>
  row(
    name.toLowerCase(),
    name,
    "Son of Draupadi",
    39,
    5,
    "The royal genealogy lists " +
      name +
      " among Draupadi’s five sons. The brothers die in the assault on the sleeping Pandava camp after the main battle.",
    { sources: ["descent", "night"], war: true },
  ),
);
row(
  "sura",
  "Sura",
  "Head of a Yadava household",
  36,
  2,
  "Sura promises his firstborn child to his childless cousin Kuntibhoja. Pritha enters that household, while her brother Vasudeva becomes the father of Krishna.",
  { branch: "Yadava kin", dynasty: "Yadava", sources: ["pritha", "adi"] },
);
row(
  "kuntibhoja",
  "Kuntibhoja",
  "Foster father of Pritha",
  36,
  2,
  "Kuntibhoja raises Sura’s daughter as his own. In his household the young princess serves the visiting sage who teaches her the invocation.",
  { branch: "Yadava kin", dynasty: "Yadava", sources: ["pritha"] },
);
row(
  "vasudeva",
  "Vasudeva",
  "Father of Krishna and Subhadra",
  37,
  3,
  "Sura’s son is Kunti’s brother. His daughter Subhadra marries his nephew Arjuna, joining two lines of the family in Abhimanyu.",
  { branch: "Yadava kin", dynasty: "Yadava", sources: ["pritha", "adi"] },
);
row(
  "drupada",
  "Drupada",
  "King of Panchala",
  37,
  3,
  "A former friend and later rival of Drona, Drupada seeks a son who can overcome his enemy. His sacrifice brings forth Dhrishtadyumna and Draupadi.",
  {
    branch: "Panchala kin",
    dynasty: "Panchala",
    war: true,
    sources: ["adi", "drona"],
  },
);
row(
  "dhrishtadyumna",
  "Dhrishtadyumna",
  "Commander of the Pandava army",
  38,
  4,
  "Born at Drupada’s sacrifice alongside Draupadi, Dhrishtadyumna commands the Pandava host. He kills Drona and is himself slain in the night attack on the camp.",
  {
    branch: "Panchala kin",
    dynasty: "Panchala",
    war: true,
    sources: ["adi", "drona", "night"],
  },
);
row(
  "virata",
  "Virata",
  "King of Matsya",
  38,
  4,
  "The Pandavas spend their concealed year in Virata’s household. At its close he gives his daughter Uttara in marriage to Abhimanyu.",
  {
    branch: "Matsya kin",
    dynasty: "Matsya",
    war: true,
    sources: ["virata", "drona"],
  },
);
export const characters = people;
