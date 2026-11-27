import {
  relationshipSchema,
  type Kind,
  type Relationship,
} from "@/data/schema";
import { earlyLine, princeIds, youngerSons } from "./characters";

const links: Relationship[] = [];
function connect(
  source: string,
  targets: string | string[],
  kind: Kind = "birth",
  reference = "descent",
  note = "",
  tradition = "Ganguli · primary account",
) {
  for (const target of typeof targets === "string"
    ? targets.split(" ")
    : targets)
    links.push(
      relationshipSchema.parse({
        id: [source, kind, target].join("/"),
        source,
        target,
        kind,
        reference,
        note,
        tradition,
      }),
    );
}
connect("yayati", "sharmishtha devayani", "marriage");
connect("yayati", "puru yadu turvasu druhyu anu");
connect("sharmishtha", "puru druhyu anu");
connect("devayani", "yadu turvasu");
earlyLine.slice(1).forEach((child, i) => connect(earlyLine[i], child));
connect("dushyanta", "shakuntala", "marriage");
connect("shakuntala", "bharata");
connect("samvarana", "tapati", "marriage");
connect("tapati", "kuru");
connect(
  "suhotra",
  "ajamidha",
  "variant",
  "parallel",
  "Section XCIV names Ajamidha as Suhotra’s son. Section XCV places Hasti and Vikunthana between them.",
  "Ganguli · Adi XCIV",
);
connect("shantanu", "ganga satyavati", "marriage");
connect("shantanu", "bhishma chitrangada vichitravirya");
connect("ganga", "bhishma");
connect("satyavati", "chitrangada vichitravirya vyasa");
connect("parashara", "vyasa");
connect("vichitravirya", "ambika ambalika", "marriage");
connect(
  "vichitravirya",
  "dhritarashtra pandu",
  "social",
  "succession",
  "Royal succession through niyoga after Vichitravirya’s death.",
);
connect("vyasa", "dhritarashtra pandu vidura", "birth", "succession");
connect("ambika", "dhritarashtra", "birth", "succession");
connect("ambalika", "pandu", "birth", "succession");
connect("attendant", "vidura", "birth", "succession");
connect("dhritarashtra", "gandhari", "marriage");
connect("pandu", "kunti madri", "marriage");
const brothers = ["yudhishthira", "bhima", "arjuna", "nakula", "sahadeva"];
connect(
  "pandu",
  brothers,
  "social",
  "descent",
  "The five belong to Pandu’s royal house through the invocations of his wives.",
);
connect("kunti", "yudhishthira bhima arjuna karna");
connect("madri", "nakula sahadeva");
connect(
  "kunti",
  "nakula sahadeva",
  "guardian",
  "descent",
  "Madri entrusts her sons to Kunti.",
);
["dharma", "vayu", "indra", "ashvins", "ashvins"].forEach((id, i) =>
  connect(id, brothers[i], "divine", "births"),
);
connect("surya", "karna", "divine", "adi");
connect("adhiratha", "radha", "marriage", "adi");
connect("adhiratha", "karna", "adoption", "adi");
connect("radha", "karna", "adoption", "adi");
connect("dhritarashtra", [...princeIds, "duhshala"], "birth", "kauravas");
connect(
  "gandhari",
  [...princeIds.filter((id) => id !== "yuyutsu"), "duhshala"],
  "birth",
  "kauravas",
);
connect("vaishya-mother", "yuyutsu", "birth", "kauravas");
connect("duhshala", "jayadratha", "marriage", "kauravas");
brothers.forEach((id, i) => {
  connect(id, "draupadi", "marriage");
  connect(id, youngerSons[i].toLowerCase());
});
connect(
  "draupadi",
  youngerSons.map((n) => n.toLowerCase()),
);
connect("arjuna", "subhadra", "marriage");
connect("arjuna", "abhimanyu");
connect("subhadra", "abhimanyu");
connect("bhima", "hidimbi", "marriage", "adi");
connect("bhima", "ghatotkacha");
connect("hidimbi", "ghatotkacha");
connect("abhimanyu", "uttara", "marriage", "virata");
connect("abhimanyu", "parikshit");
connect("uttara", "parikshit");
connect("parikshit", "janamejaya");
connect("drona", brothers, "teacher", "adi");
connect("krishna", "arjuna", "ally", "battle");
connect("duryodhana", "karna", "ally", "karna");
connect("bhima", "duryodhana", "rival", "shalya");
connect("arjuna", "karna", "rival", "karna");
connect("sura", "vasudeva kunti", "birth", "pritha");
connect("kuntibhoja", "kunti", "adoption", "pritha");
connect("vasudeva", "krishna subhadra", "birth", "adi");
connect(
  "drupada",
  "draupadi dhrishtadyumna",
  "social",
  "adi",
  "Both emerge from Drupada’s sacrificial fire.",
);
connect("virata", "uttara", "birth", "virata");
export const relationships = links;
