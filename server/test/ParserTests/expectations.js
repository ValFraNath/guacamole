/**
 * Here is the expected data for the imported files that we want to test.
 * Each key of this object is an expectation object ( as we can test several files, we can have several expectations objects )
 * in which each key is a classification, a property or a molecules list.
 *
 * For classifications (classes & systems) object :
 * - all :  the complete (!) list of names of classification values
 * - nodes : A sample of classification values, a node must consist of a name and the list of names of its children
 *
 * Properties consist of a list of values (names only).
 *
 * The list of molecules contains a sample of molecules that we want to test.
 * A molecule must have a key for each classification and property (can be null),
 * and values are strings or an array of strings
 *
 */
export const expectations = {
  first_version: {
    classes: {
      all: [
        "INHIBITEUR DE FUSION",
        "INHIBITEURS DE NEURAMINISASE",
        "ANALOGUES NUCLEOSIDIQUES",
        "INTI (INHIBITEURS NUCLEOSIDIQUES TRANSCRIPTASE INVERSE)",
        "INHIBITEUR DE TERMINASE",
        "INHIBITEUR POLYMERASE NS5B",
        "INHIBITEUR NS5A",
        "INHIBITEUR PROTEINE 3A/4",
        "INHIBITEUR DIRECT ADN polymérase virale et transcriptase inverse",
        "INHIBITEURS NON NUCLEOSIDIQUES DE LA TI",
        "INHIBITEUR ENTREE VHB ET HVD",
        "Inhibiteur récepteur NTCP",
        "INHIBITEUR CYP 3A4",
        "INHIBITEUR CCR5",
        "INHIBITEUR DE PROTEASE",
        "INHIBITEUR DE L'INTEGRASE",
        "PENICILLINES",
        "PENICILLINES A",
        "PENICILLINE G",
        "PENICILLINE M",
        "PENICILLINE V",
        "UREIDO-PENICILLINES",
        "PENICILLINES A LARGE SPECTRE",
        "CARBOXYPÉNICILLINES",
        "INHIBITEURS DE Β-LACTAMASES",
        "MONOBACTAM",
        "CARBAPENEMES",
        "INHIBITEUR DE LA DESHYDROPEPTIDASE",
        "CEPHALOSPORINES",
        "CEPHALOSPORINE DE 1ERE GENERATION",
        "CEPHALOSPORINE DE 2NDE GENERATION",
        "CEPHALOSPORINE DE 3EME GENERATION",
        "CEPHALOSPORINE DE 5EME GENERATION",
        "TETRACYCLINES",
        "AMINOSIDE",
        "MACROLIDES",
        "GLYCOPEPTIDES",
        "POLYPEPTIDES",
        "SULFAMIDES",
        "FLUOROQUINOLONE",
        "LINCOSAMIDES",
        "OXAZOLIDINONES",
        "PHENICOLES",
        "Antituberculeux",
        "NITROFURANES",
        "CESTOCIDES",
        "BENZIMIDAZOLES",
        "5-NITRO-IMIDAZOLES",
      ],
      nodes: [
        {
          name: "ANALOGUES NUCLEOSIDIQUES",
          children: ["INTI (INHIBITEURS NUCLEOSIDIQUES TRANSCRIPTASE INVERSE)"],
        },
      ],
    },
    systems: {
      all: ["ANTIINFECTIEUX", "ANTIPARASITAIRE", "ANTIBIOTIQUE", "ANTIVIRAL"],
      nodes: [
        {
          name: "ANTIINFECTIEUX",
          children: ["ANTIVIRAL", "ANTIBIOTIQUE", "ANTIPARASITAIRE"],
        },
        { name: "ANTIBIOTIQUE", children: [] },
      ],
    },
    side_effects: [
      "hypotension orthostatique",
      "Nephrotoxicité",
      "Décoloration dents",
      "Hypoplasie email dentaire",
      "oesophagite",
      "Torsade de pointe",
      "Ototoxicité",
      "Diminution seuil epileptogene",
      "Syndrome serotoninergique",
      "Toxicite hematologique",
    ],
    interactions: ["CYP3A4", "Allongement QT", "Syndrome serotoninergique"],
    indications: [
      "Grippe",
      "Parkinson",
      "VHB",
      "VIH",
      "CMV",
      "VHC",
      "HSV",
      "VZV",
      "EBV",
      "VHD",
      "Infection bacterienne",
      "Paludisme",
      "Protozoocide",
      "Tuberculose",
      "Helminthes",
      "Protozoaires",
      "Bactéries anaérobies",
    ],
    molecules: [
      {
        dci: "TENOFOVIR DISOPROXIL",
        systems: "ANTIVIRAL",
        classes: "INTI (INHIBITEURS NUCLEOSIDIQUES TRANSCRIPTASE INVERSE)",
        indications: ["VHB", "VIH"],
        interactions: [],
        side_effects: [],
        ntr: null,
        skeletal_formule: null,
        level_easy: null,
        level_hard: null,
      },
      {
        dci: "TINIDAZOLE",
        systems: "ANTIPARASITAIRE",
        classes: "5-NITRO-IMIDAZOLES",
        indications: ["Protozoaires", "Bactéries anaérobies"],
        interactions: [],
        side_effects: [],
        ntr: null,
        level_easy: null,
        level_hard: null,
        skeletal_formule: null,
      },
      {
        dci: "AMANTADINE",
        systems: "ANTIVIRAL",
        classes: "INHIBITEUR DE FUSION",
        indications: ["Grippe", "Parkinson"],
        interactions: [],
        side_effects: ["hypotension orthostatique"],
        ntr: null,
        level_easy: null,
        level_hard: 1,
        skeletal_formule: null,
      },
    ],
  },
};
