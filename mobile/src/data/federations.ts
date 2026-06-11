// FFIE departmental federations — the directory behind "FFIE in your
// region". To join FFIE you apply through your departmental federation, so the
// Become-a-member page lists them all and lets you open each one.
//
// Source: https://www.ffie.fr/?eID=federations — the JSON feed that powers the
// region map on ffie.fr. Every field below (area, official name, named
// contacts with their email/phone/fax, postal address, map coordinates) is
// taken from that feed. 'code' is the department number derived from the
// postcode (3 digits overseas; 2A/2B for Corsica), used for the row + search.
//
// This file is generated from the feed; re-run the fetch to refresh it.

/** A named contact at a federation (President, Secretary General, …). */
export type FederationMember = {
  role: string;
  name: string;
  email?: string;
  phone?: string;
  fax?: string;
};

export type Federation = {
  id: number;
  /** Department number (3 digits overseas; 2A/2B Corsica). */
  code: string;
  /** Department / area label, e.g. "Côtes d'Armor", "Greater Paris". */
  area: string;
  /** Official federation name. */
  name: string;

  /** Named contacts, in display order; each carries its own email/phone/fax. */
  members?: FederationMember[];
  /** Full postal address, single line. */
  address?: string;
  website?: string;

  /** Map coordinates (from the feed). Absent for entries the feed has no
   *  geocode for; those get no map pin. */
  lat?: number;
  lng?: number;
};

const FEDERATION_ENTRIES: Federation[] = [
  {
    id: 1,
    code: "22",
    area: "Côtes d'Armor",
    name: "Building Trades Federation of Côtes d'Armor",
    members: [
      { role: "President", name: "Mickaël YOBE", email: "m.yobe@bse22.fr" },
      { role: "Secretary General", name: "Bénédicte DESMONS", email: "desmonsb@d22.ffbatiment.fr", phone: "02 96 74 40 80" },
    ],
    address: "14, rue du Rocher Cornet / BP 340 - 22193 PLERIN CEDEX",
  },
  {
    id: 2,
    code: "29",
    area: "Finistère",
    name: "Building Trades Federation of Finistère",
    members: [
      { role: "President", name: "Hervé TRESSEL", email: "contact@dourmap.com" },
      { role: "Secretary General", name: "Jean-Robert CHARLET", email: "charletjr@d29a.ffbatiment.fr", phone: "02 98 02 19 16", fax: "02 98 02 25 64" },
    ],
    address: "55 rue Charles Nungesser - Zone Prat Pip Nord / CS 20116 / Guipavas - 29802 BREST cedex 9",
  },
  {
    id: 3,
    code: "35",
    area: "Ille-et-Vilaine",
    name: "Building Trades Federation of Ille-et-Vilaine",
    members: [
      { role: "President", name: "Bruno RENAUDIN", email: "brenaudin@satifrance.fr" },
      { role: "Secretary General", name: "Philippe LELIEVRE", email: "lelievrep@fbtp35.fr", phone: "02 99 38 28 28", fax: "02 99 36 96 75" },
    ],
    address: "3, allée du Bâtiment / BP 91623 - 35016 RENNES CEDEX",
  },
  {
    id: 4,
    code: "56",
    area: "Morbihan",
    name: "Building Federation of Morbihan",
    members: [
      { role: "President", name: "Stéphane TURLAIS", email: "rousse-electricite@orange.fr" },
      { role: "Secretary General", name: "Aude LE VAILLANT", email: "levaillanta@d56.ffbatiment.fr", phone: "02 97 89 02 20", fax: "02 97 89 02 29" },
    ],
    address: "507 rue Jacques-Ange Gabriel, Z.I. de Lann Sevelin - 56850 CAUDAN",
  },
  {
    id: 5,
    code: "14",
    area: "Calvados",
    name: "Building Trades Federation of Calvados",
    members: [
      { role: "President", name: "Yohan BACHELET", email: "yohan.bachelet@bazinelec.fr" },
      { role: "Secretary General", name: "Olivier LAURENT", email: "laurento@d14.ffbatiment.fr", phone: "07 88 58 16 98" },
    ],
    address: "6, rue des Mouettes - 14000 CAEN",
  },
  {
    id: 6,
    code: "27",
    area: "Eure",
    name: "FFIE 27",
    members: [
      { role: "President", name: "Denis MAINGOT", email: "denis.maingot@chaufpac-elec.fr" },
      { role: "Secretary General", name: "Jean-Luc LIGNEREUX", email: "lignereuxjl@d27.ffbatiment.fr", phone: "02 32 62 22 20", fax: "02 32 62 22 22" },
    ],
    address: "531 rue Clément Ader - 27930 LE VIEIL EVREUX",
  },
  {
    id: 7,
    code: "50",
    area: "Manche",
    name: "FFB Manche",
    members: [
      { role: "President", name: "Jacky HAMELIN", email: "jhamelin@selca.fr" },
      { role: "Secretary General", name: "Amélie RENOUF", email: "renoufa@d50.ffbatiment.fr", phone: "02 33 01 60 50" },
    ],
    address: "50 place Napoléon - 50100 CHERBOURG EN COTENTIN",
  },
  {
    id: 8,
    code: "61",
    area: "Orne",
    name: "Building Trades Federation of Orne",
    members: [
      { role: "President", name: "Romuald PHILIPPE", email: "romuald.philippe@ebi-electricite.fr" },
      { role: "Secretary General", name: "Lylian LAFINE", email: "lafinel@d61.ffbatiment.fr", phone: "02 33 29 17 11" },
    ],
    address: "21, av. de Basingstoke - 61000 Alençon",
  },
  {
    id: 9,
    code: "76",
    area: "Seine-Maritime Rouen",
    name: "French Building Federation Rouen Métropole & Territories",
    members: [
      { role: "President", name: "Olivier ENAUT", email: "olivier.enaut@sofreg.fr" },
      { role: "Secretary General", name: "Arnaud BARROIS", email: "barroisa@d76a.ffbatiment.fr", phone: "02 32 19 52 52", fax: "02 32 19 52 53" },
    ],
    address: "14 rue Georges Charpak / BP 332 - 76136 Mont-Saint-Aignan Cedex",
  },
  {
    id: 10,
    code: "76",
    area: "Seine-Maritime (Le Havre Pointe de Caux)",
    name: "Building Trades Federation of Le Havre Pointe de Caux",
    members: [
      { role: "President", name: "Sylvain FRANCOIS", email: "segfrancois@wanadoo.fr" },
      { role: "Secretary General", name: "François DECHAMPS", email: "dechampsf@d76b.ffbatiment.fr", phone: "02 35 24 23 61", fax: "02 35 24 27 47" },
    ],
    address: "1 Rue Paul Marion - 76600 Le Havre",
  },
  {
    id: 12,
    code: "59",
    area: "Nord-Pas-de-Calais",
    name: "FRENCH BUILDING FEDERATION NORD-PAS DE CALAIS REGIONAL TECHNICAL EQUIPMENT GROUP – GRET NPDC",
    members: [
      { role: "Secretary General", name: "Thierry COLLET (FFB)", email: "tcollet@ffb5962.fr", phone: "03 20 72 87 14" },
      { role: "President", name: "Xavier GUIDEZ", email: "xavierguidez@wanadoo.fr" },
      { role: "General Delegate", name: "Vincent LEROUX (FFB)", email: "vleroux@ffb5962.fr", phone: "03 20 72 87 14" },
      { role: "General Delegate", name: "Béatrice LATREILLE (GRET)", email: "beatricelatreille.gret@59-62.org", phone: "03 20 72 02 92" },
    ],
    address: "270 boulevard Clémenceau - 59700 Marcq-en-Baroeul",
  },
  {
    id: 13,
    code: "60",
    area: "Oise",
    name: "French Building Federation of Oise",
    members: [
      { role: "President", name: "Thierry DECRAMP", email: "info@decramp.fr" },
      { role: "Secretary General", name: "Guillaume GAMACHE", email: "gamacheg@d60.ffbatiment.fr", phone: "03 44 06 15 00" },
    ],
    address: "240, av. Marcel Dassault / BP 10209 - 60002 Beauvais Cedex",
  },
  {
    id: 14,
    code: "80",
    area: "Somme",
    name: "Building Trades Federation of Somme",
    members: [
      { role: "President", name: "Claude LEBOUE", email: "claude.leboue@orange.fr", phone: "03 22 41 09 47" },
      { role: "Secretary General", name: "Geoffrey MARTIN", email: "marting@d80.ffbatiment.fr", phone: "03 22 91 53 62", fax: "03 22 92 45 89" },
    ],
    address: "44 Square Friant les 4 Chênes / BP 40121 - 80001 Amiens Cedex 1",
  },
  {
    id: 15,
    code: "08",
    area: "Ardennes",
    name: "Building Trades Federation of Ardennes",
    members: [
      { role: "President", name: "Damien BOURGEOIS", email: "d.bourgeois@elec-alarme08.fr", phone: "06 22 67 78 65" },
      { role: "Secretary General", name: "Frédéric JOLION", email: "jolionf@d08.ffbatiment.fr", phone: "03 24 33 19 47", fax: "03 24 59 24 18" },
    ],
    address: "1 rue Yvonne-Edmond Foinant - 08000 Villers Semeuse",
  },
  {
    id: 16,
    code: "10",
    area: "Aube",
    name: "Departmental Building Trades Federation of Aube",
    members: [
      { role: "President", name: "Jean-Marie BAILLY", email: "jm.bailly@aubelec.fr" },
      { role: "Secretary General", name: "Véronique LEPERONT", email: "leperontv@d10.ffbatiment.fr", phone: "03 25 74 00 11" },
    ],
    address: "10 rue Saint Martin / Es Aires - 10000 Troyes",
  },
  {
    id: 17,
    code: "67",
    area: "Bas-Rhin",
    name: "French Building Federation of Bas-Rhin",
    members: [
      { role: "President", name: "Cathie MEPPIEL", email: "cathie.meppiel@schierer-jung.com" },
      { role: "Secretary General", name: "Alexandre MICHIELS", email: "michielsa@d67.ffbatiment.fr", phone: "03.88.15.44.02" },
    ],
    address: "Pôle BTP – Espace Européen de l’entreprise / 1A rue de Dublin - 67300 Schiltigheim",
  },
  {
    id: 18,
    code: "68",
    area: "Haut-Rhin",
    name: "Building and Public Works Federation of Haut-Rhin",
    members: [
      { role: "President", name: "Patrick MULLER", email: "patrick.muller@omnielec.com" },
      { role: "Secretary General", name: "Pierre FUETTERER", email: "fuettererp@d68.ffbatiment.fr", phone: "03 89 36 30 60", fax: "03 89 36 30 66" },
    ],
    address: "12 Allée Nathan Katz - 68086 Mulhouse Cedex",
  },
  {
    id: 19,
    code: "52",
    area: "Haute-Marne",
    name: "Building Trades Federation of Haute-Marne",
    members: [
      { role: "President", name: "Silvère REGNIER", email: "silvere@gars-regnier.fr", phone: "03 25 31 31 77" },
      { role: "Secretary General", name: "Julie DRAPIEWSKI", email: "drapiewskij@d52.ffbatiment.fr", phone: "03 25 03 02 94", fax: "03 25 02 38 75" },
    ],
    address: "8 Rue de la Maladière - 52000 Chaumont",
  },
  {
    id: 20,
    code: "51",
    area: "Marne",
    name: "French Building Federation Marne",
    members: [
      { role: "President", name: "Gérald GODART", email: "g.godart@haezebrouck.fr", phone: "03 26 65 17 44" },
      { role: "Secretary General", name: "Louis-Xavier FOREST", email: "forestlx@grandest.ffbatiment.fr", phone: "03 26 48 42 20", fax: "03 26 88 98 29" },
    ],
    address: "10 Rue Saint-Hilaire / CS 60 033 - 51723 Reims Cedex",
  },
  {
    id: 21,
    code: "54",
    area: "Meurthe et Moselle",
    name: "French Building Federation of Meurthe-et-Moselle",
    members: [
      { role: "President", name: "Dominique MATHIEU", email: "dominique.mathieu@sodel.net", phone: "03 83 51 50 50" },
      { role: "Secretary General", name: "Vanessa MARNE", email: "marnev@d54.ffbatiment.fr", phone: "03 83 30 80 73" },
    ],
    address: "62 Rue de Metz - 54014 Nancy",
  },
  {
    id: 22,
    code: "55",
    area: "Meuse",
    name: "Building Trades Federation of Meuse",
    members: [
      { role: "President", name: "Olivier JOLLY", email: "contact@abielectricite.fr" },
      { role: "Secretary General", name: "Marie-Pierre VUITTON", email: "vuittonmp@d55.ffbatiment.fr", phone: "03 29 86 15 95" },
    ],
    address: "26 avenue du Général de Gaulle / BP 90094 - 55103 Verdun Cedex",
  },
  {
    id: 23,
    code: "57",
    area: "Moselle",
    name: "Building Trades Federation of Moselle",
    members: [
      { role: "President", name: "Eric SASSO", email: "eric-sasso@orange.fr" },
      { role: "Secretary General", name: "Samuel LORIN", email: "lorins@btp57.ffbatiment.fr", phone: "03 87 74 78 17" },
    ],
    address: "3 Rue Jean Antoine Chaptal / CS 35580 - 57078 Metz Cedex 03",
  },
  {
    id: 24,
    code: "88",
    area: "Vosges",
    name: "French Building Trades Federation Vosges",
    members: [
      { role: "President", name: "Luis AFONSO", email: "luisafonso@afonsosas.com" },
      { role: "Secretary General", name: "Jean-Michel BARBIER", email: "barbierjm@d88.ffbatiment.fr", phone: "03 29 31 10 11", fax: "03 29 31 17 27" },
    ],
    address: "34 Rue André Vitu - 88026 Épinal Cedex",
  },
  {
    id: 25,
    code: "44",
    area: "Loire-Atlantique",
    name: "Building Federation of Loire-Atlantique",
    members: [
      { role: "President", name: "Maxime VAN EEKERT", email: "m.vaneekert@snee.soflux.fr", phone: "02 40 65 12 71" },
      { role: "Secretary General", name: "Hélène BECK", email: "beckh@d44.ffbatiment.fr", phone: "02 40 20 23 00", fax: "02 40 47 41 24" },
    ],
    address: "Zone Armor / 4 Impasse Serge Reggiani / BP 50402 - 44819 Saint-Herblain Cedex",
  },
  {
    id: 26,
    code: "49",
    area: "Maine-et-Loire",
    name: "Building Trades Federation of Maine-et-Loire",
    members: [
      { role: "President", name: "Franck LEFFET", email: "entreprise@eti-energies.fr" },
      { role: "Secretary General", name: "Julien BERTHIAS", email: "berthiasj@ffb49.ffbatiment.fr", phone: "02 41 24 14 70", fax: "02 41 24 14 79" },
    ],
    address: "227 rue du Docteur Guichard / BP 40945 - 49009 Angers Cedex 01",
  },
  {
    id: 27,
    code: "53",
    area: "Mayenne",
    name: "Building Trades Federation of Mayenne",
    members: [
      { role: "President", name: "Simon SUARD", email: "contact@suard.fr", phone: "02 43 98 06 87" },
      { role: "Secretary General", name: "Jean-Christophe JUHEL", email: "juheljc@btp53.fr", phone: "02 43 59 21 21", fax: "02 43 59 21 29" },
    ],
    address: "7 Rue de Paradis / CS 40406 - 53004 Laval Cedex",
  },
  {
    id: 28,
    code: "72",
    area: "Sarthe",
    name: "Building Trades Federation of Sarthe",
    members: [
      { role: "President", name: "Adrien HATTON", email: "adrien.hatton@hattonelectricite.fr" },
      { role: "Secretary General", name: "Cyrille SCHNEIDER", email: "schneiderc@d72.ffbatiment.fr", phone: "02 43 24 39 85", fax: "02 43 24 92 12" },
    ],
    address: "17 Rue de l'Étoile / Immeuble Le Montauban - 72000 Le Mans",
  },
  {
    id: 29,
    code: "85",
    area: "Vendée",
    name: "Building Federation of Vendée",
    members: [
      { role: "President", name: "Franck PITRA", email: "f.pitra@eccs.fr", phone: "02 51 21 11 45" },
      { role: "Secretary General", name: "Matthieu JOULIN", email: "joulinm@d85.ffbatiment.fr", phone: "02 51 07 06 65", fax: "02 51 37 88 56" },
    ],
    address: "36 Rue Gaston Ramon - 85000 La Roche-sur-Yon",
  },
  {
    id: 30,
    code: "16",
    area: "Charente",
    name: "French Building Federation of Charente",
    members: [
      { role: "President", name: "Paul AUBRY", email: "p.aubry@soflux.fr" },
      { role: "Secretary General", name: "Jean-Rodolphe LAGUIONNIE", email: "laguionniejr@d16.ffbatiment.fr", phone: "05 45 92 16 71", fax: "05 45 38 33 24" },
    ],
    address: "262 rue Fontchaudière - 16000 Angoulême",
  },
  {
    id: 31,
    code: "17",
    area: "Charente-Maritime",
    name: "Building Trades Federation of Charente-Maritime",
    members: [
      { role: "President", name: "Nicolas MARCOS", email: "nmarcos@ceme-sa.com" },
      { role: "Secretary General", name: "Laurent PARROT", email: "parrotl@d17.ffbatiment.fr", phone: "05 46 87 17 55", fax: "05 46 99 80 71" },
    ],
    address: "15 avenue de Saintonge - 17430 Tonnay-Charente",
  },
  {
    id: 32,
    code: "19",
    area: "Corrèze",
    name: "Building Trades Federation of Corrèze",
    members: [
      { role: "President", name: "Frédéric BUFFIERE", email: "clim-energie@live.fr" },
      { role: "Secretary General", name: "Jean-Michel ALBARET", email: "albaretjm@d19a.ffbatiment.fr", phone: "05 55 21 55 16", fax: "05 55 21 55 18" },
    ],
    address: "Immeuble consulaire - Le Puy Pinçon / BP 30 - 19001 Tulle Cedex",
  },
  {
    id: 33,
    code: "23",
    area: "Creuse",
    name: "Building Trades Federation of Creuse",
    members: [
      { role: "President", name: "Olivier SAUVE", email: "nogelec@wanadoo.fr" },
      { role: "Secretary General", name: "Céline GALLAND", email: "gallandc@d23.ffbatiment.fr", phone: "05 55 52 04 91", fax: "05 55 52 40 02" },
    ],
    address: "3 Avenue Pasteur - 23000 Guéret",
  },
  {
    id: 34,
    code: "79",
    area: "Deux-Sèvres",
    name: "Building Trades Federation of Deux-Sèvres",
    members: [
      { role: "President", name: "Tanguy DAVID", email: "tdavid.thelina@thelina.fr" },
      { role: "Secretary General", name: "Jennifer OLLIVIER", email: "ollivierj@d79.ffbatiment.fr", phone: "05 49 79 23 11", fax: "05 49 73 59 24" },
    ],
    address: "1 Rue de la Broche / BP 8618 - 79026 Niort Cedex 9",
  },
  {
    id: 35,
    code: "24",
    area: "Dordogne",
    name: "Dordogne Federation of Building Contractors and Craftsmen",
    members: [
      { role: "President", name: "Anthony BORDAS", email: "anthony.bordas@orange.fr" },
      { role: "Secretary General", name: "Johann DELAGE", email: "delagej@d24.ffbatiment.fr", phone: "05 53 08 92 44", fax: "05 53 09 83 15" },
    ],
    address: "133 Boulevard du Petit Change - 24000 Périgueux",
  },
  {
    id: 36,
    code: "33",
    area: "Gironde",
    name: "French Building Federation Gironde",
    members: [
      { role: "President", name: "Thierry NIANT", email: "tniant@sigmareseaux.fr" },
      { role: "Secretary General", name: "Maxime BONPAYS", email: "bonpaysm@d33.ffbatiment.fr", phone: "05 56 43 61 23", fax: "05 56 43 61 26" },
    ],
    address: "Maison du BTP, 1 bis avenue de Chavailles - 33520 Bruges",
  },
  {
    id: 38,
    code: "47",
    area: "Lot-et-Garonne",
    name: "Building Trades Federation of Lot-et-Garonne",
    members: [
      { role: "President", name: "Appointment in progress" },
      { role: "Secretary General", name: "Virginie DEZECACHE", email: "dezecachev@d47.ffbatiment.fr", phone: "05 53 47 28 08", fax: "05 53 66 23 45" },
    ],
    address: "Estillac \"Lasserre\" / BP 50038 - 47901 Agen Cedex 9",
  },
  {
    id: 39,
    code: "64",
    area: "Pyrénées Atlantiques",
    name: "Building Trades Federation of Pyrénées-Atlantiques",
    members: [
      { role: "President", name: "Norbert DEMONTE", email: "demonte@abe64.fr" },
      { role: "Secretary General", name: "Laurent BOURGUIGNON", email: "bourguignonl@d64.ffbatiment.fr", phone: "05 59 84 85 00", fax: "05 59 30 18 59" },
    ],
    address: "2 allée Catherine de Bourbon, BP 7514 - 64075 Pau Cedex",
  },
  {
    id: 40,
    code: "86",
    area: "Vienne",
    name: "Building Trades Federation of Vienne",
    members: [
      { role: "President", name: "Pascal TEXEREAU", email: "ptexereau@sainteloifougere.com" },
      { role: "Secretary General", name: "Carine COURTAUDIERE", email: "courtaudierec@d86.ffbatiment.fr", phone: "05 49 61 20 68", fax: "05 82 66 08 92" },
    ],
    address: "26 rue Salvador Allende - 86000 Poitiers",
  },
  {
    id: 41,
    code: "01",
    area: "Ain",
    name: "Building Trades Federation of Ain",
    members: [
      { role: "President", name: "Nathalie RIBAUT", email: "nathalie@ribaut.fr" },
      { role: "Secretary General", name: "Olivier D'ATTOMA", email: "dattomao@d01.ffbatiment.fr", phone: "04 74 22 29 33" },
    ],
    address: "33 rue Bourgmayer / CS 60039 - 01002 Bourg en Bresse Cedex",
  },
  {
    id: 42,
    code: "02",
    area: "Aisne",
    name: "French Building Trades Federation of Aisne",
    members: [
      { role: "President", name: "Mathieu BEY", email: "seg-direction@orange.fr" },
      { role: "Secretary General", name: "Thierry COULVIER", email: "coulviert@d02.ffbatiment.fr", phone: "03 23 23 26 31" },
    ],
    address: "53 boulevard de Lyon / BP 14 - 02002 LAON CEDEX",
  },
  {
    id: 43,
    code: "03",
    area: "Allier",
    name: "French Building and Public Works Federation of Allier",
    members: [
      { role: "President", name: "Xavier DURAND", email: "x.durand@dumont-elecsyst.fr", phone: "04 70 98 68 81" },
      { role: "Secretary General", name: "Coralie VITARD", email: "vitardc@d03.ffbatiment.fr", phone: "04 70 46 92 70" },
    ],
    address: "35 rue de Bellecroix - 03400 YZEURE",
  },
  {
    id: 44,
    code: "04",
    area: "Alpes de Haute-Provence",
    name: "Building Trades Federation of Alpes-de-Haute-Provence",
    members: [
      { role: "President", name: "Samuel ANDRE", email: "samuel.pelestor@gmail.com" },
      { role: "Secretary General", name: "Bruno ACCIAÏ", email: "acciaib@d04.ffbatiment.fr", phone: "04 92 31 06 15" },
    ],
    address: "Immeuble le Galaxie II / Rue Ferdinand de Lesseps / Quartier Saint-Christophe - 04000 DIGNE LES BAINS",
  },
  {
    id: 45,
    code: "06",
    area: "Alpes-Maritimes",
    name: "Building Trades Federation of Alpes-Maritimes",
    members: [
      { role: "President", name: "Kader BEJAOUI", email: "abejaoui@mtgroup.fr", phone: "04 93 90 60 74" },
      { role: "Secretary General", name: "Ludovic PATTI", email: "pattil@d06.ffbatiment.fr", phone: "04 92 29 85 85" },
    ],
    address: "Avenue Emmanuel Pontremoli / Bat. B3 / Nice La Plaine 1 - CS 63304 - 06206 NICE CEDEX3",
  },
  {
    id: 46,
    code: "09",
    area: "Ariège",
    name: "Building Trades Federation of Ariège",
    members: [
      { role: "President", name: "Awaiting appointment" },
      { role: "Secretary General", name: "Aurélie MANCEAU", email: "manceaua@d09.ffbatiment.fr", phone: "05 34 09 36 09" },
    ],
    address: "Zone artisanale de Patau - 09000 SAINT JEAN DE VERGES",
  },
  {
    id: 47,
    code: "11",
    area: "Aude",
    name: "Departmental Building Trades Federation of Aude",
    members: [
      { role: "President", name: "Bertrand DESPLATS", email: "b.desplats@sobel.fr" },
      { role: "Secretary General", name: "Stéphane SANSINENA", email: "sansinenas@d11.ffbatiment.fr", phone: "04 68 10 33 05" },
    ],
    address: "ZAC Salvaza - Les Graves / 170 rue Gustave Eiffel - 11000 CARCASSONNE",
  },
  {
    id: 48,
    code: "12",
    area: "Aveyron",
    name: "Building Trades Federation of Aveyron",
    members: [
      { role: "President", name: "Awaiting appointment" },
      { role: "Secretary General", name: "Robert HYRONDE", email: "hyronder@d12.ffbatiment.fr", phone: "05 65 68 08 35" },
    ],
    address: "67 bis rue Béteille / CS 23159 - 12035 RODEZ CEDEX 9",
  },
  {
    id: 49,
    code: "13",
    area: "Bouches-du-Rhône",
    name: "Building Trades Federation of Bouches-du-Rhône",
    members: [
      { role: "President", name: "Laurent BILLOT", email: "laurent.billot@icloud.com" },
      { role: "Secretary General", name: "Florence MAGNAN", email: "magnanf@d13.ffbatiment.fr", phone: "04 91 23 26 23" },
    ],
    address: "344 Boulevard Michelet / BP 158 - 13276 MARSEILLE CEDEX 9",
  },
  {
    id: 50,
    code: "15",
    area: "Cantal",
    name: "Building Trades Federation of Cantal",
    members: [
      { role: "President", name: "Awaiting appointment" },
      { role: "Secretary General", name: "Stévan LE GALL", email: "legalls@d15.ffbatiment.fr", phone: "04 71 63 71 78" },
    ],
    address: "15 avenue Georges Pompidou - 15000 AURILLAC",
  },
  {
    id: 51,
    code: "18",
    area: "Cher",
    name: "French Building Federation of Cher",
    members: [
      { role: "President", name: "Yannick LEPOLARD", email: "direction@lepolard.com", phone: "02.48.21.34.01" },
      { role: "Secretary General", name: "Emmanuelle VILLA LAVILLONNIERE", email: "villae@d18.ffbatiment.fr", phone: "02 48 24 17 11" },
    ],
    address: "2 rue Porte Jaune / BP 7 - 18001 BOURGES CEDEX",
  },
  {
    id: 52,
    code: "2A",
    area: "Corse du Sud",
    name: "Building Trades Federation of Corse-du-Sud",
    members: [
      { role: "President", name: "Eric CARLES" },
      { role: "Secretary General", name: "Paule CASANOVA", email: "casanovap@d2a.ffbatiment.fr", phone: "04 95 20 64 52" },
    ],
    address: "40 avenue Georges Pompidou BP 503 - 20189 AJACCIO CEDEX 2",
  },
  {
    id: 53,
    code: "21",
    area: "Côte d'Or",
    name: "French Building Federation of Côte-d'Or",
    members: [
      { role: "President", name: "Marc POTIER", email: "contact@dme-dijon.fr" },
      { role: "Secretary General", name: "Valérie BERNARD", email: "bernardv@d21.ffbatiment.fr", phone: "03 80 48 13 15" },
    ],
    address: "13 rue Jeannin / BP 82563 - 21025 DIJON CEDEX",
  },
  {
    id: 54,
    code: "25",
    area: "Doubs",
    name: "Building Trades Federation of Doubs",
    members: [
      { role: "President", name: "Dominique VIPREY", email: "dviprey@gmail.com" },
      { role: "Secretary General", name: "Agnès MACOUIN", email: "macouaina@d25.ffbatiment.fr", phone: "03 81 48 34 80" },
    ],
    address: "4 rue de Franche Comté / Valparc Valentin - 25480 ECOLE VALENTIN",
  },
  {
    id: 55,
    code: "26",
    area: "Drôme Ardèche",
    name: "Building Trades Federation of Drôme-Ardèche",
    members: [
      { role: "President", name: "Sébastien VOSSIER", email: "svossier@edrelec.fr" },
      { role: "Secretary General", name: "Stéphane CELLIER", email: "stephane.cellier@btp0726.fr", phone: "04 75 75 91 91" },
    ],
    address: "57 avenue de Lautagne / BP 117 - 26904 VALENCE CEDEX 9",
  },
  {
    id: 56,
    code: "91",
    area: "Essonne",
    name: "FFB-ESSONNE",
    members: [
      { role: "President", name: "Jérémy NGUYEN VAN LANG", email: "jeremy@eeldynamic.fr" },
      { role: "Secretary General", name: "Chrystelle RUELLE", email: "ruellec@d91.ffbatiment.fr", phone: "01 60 90 37 52" },
    ],
    address: "1 avenue de Paris - 91150 ETAMPES",
  },
  {
    id: 57,
    code: "28",
    area: "Eure-et-Loir",
    name: "French Building Federation of Eure-et-Loir",
    members: [
      { role: "President", name: "Michel BONSERGENT", email: "beauce.elec@wanadoo.fr" },
      { role: "President", name: "Jonathan BARREAU", email: "barreauj@d28.ffbatiment.fr", phone: "02 37 88 30 80" },
    ],
    address: "7 rue Vlaminck / CS 50365 - 28008 CHARTRES CEDEX",
  },
  {
    id: 58,
    code: "30",
    area: "Gard",
    name: "Building Trades Federation of Gard",
    members: [
      { role: "President", name: "Philippe ZANNI", email: "p.zanni@jp-elec.fr" },
      { role: "Secretary General", name: "Olivier POLGE", email: "polgeo@d30.ffbatiment.fr", phone: "04 66 21 71 83" },
    ],
    address: "161 allée Graham Bel / Parc Georges Besse - 30035 NÎMES CEDEX 1",
  },
  {
    id: 59,
    code: "32",
    area: "Gers",
    name: "Building Trades Federation of Gers",
    members: [
      { role: "President", name: "Nathalie LACROIX", email: "nathalie@taupiac-electricite.fr" },
      { role: "Secretary General", name: "Jennifer SEGAFREDDO", email: "fbtp32@d32.ffbatiment.fr", phone: "05 62 05 02 67" },
    ],
    address: "2 rue des Lilas / Résidence Soleil - 32000 AUCH",
  },
  {
    id: 60,
    code: "2B",
    area: "Haute-Corse",
    name: "Federation of Building Trades Contractors and Craftsmen of Haute-Corse",
    members: [
      { role: "President", name: "Daniel BALDASSARI", email: "sigec20@wanadoo.fr", phone: "04 95 33 01 77" },
      { role: "Secretary General", name: "Pascale GIORDANO", email: "giordanop@d2b.ffbatiment.fr", phone: "04 95 34 92 40" },
    ],
    address: "Maison du BTP - Quartier de l'Annonciade - 20200 BASTIA",
  },
  {
    id: 61,
    code: "31",
    area: "Haute-Garonne",
    name: "Building Trades Federation of Haute-Garonne",
    members: [
      { role: "President", name: "Lionel BOUSQUET", email: "lionel.bousquet@eiffage.com" },
      { role: "Secretary General", name: "Jonathan SUTRA", email: "sutraj@d31.ffbatiment.fr", phone: "05 61 14 70 40" },
    ],
    address: "11 boulevard des Récollets / Immeuble le Belvédère - 31078 TOULOUSE CEDEX",
  },
  {
    id: 62,
    code: "43",
    area: "Haute-Loire",
    name: "Building Trades Federation of Haute-Loire",
    members: [
      { role: "President", name: "Stéphane SABY", email: "stephane.saby@saby.fr" },
      { role: "Secretary General", name: "Stéphane DEPEYRE", email: "depeyres@d43.ffbatiment.fr", phone: "04 71 02 12 24" },
    ],
    address: "17 cours Victor Hugo - 43000 LE PUY EN VELAY",
  },
  {
    id: 63,
    code: "05",
    area: "Hautes-Alpes",
    name: "Building Trades Federation of Hautes-Alpes",
    members: [
      { role: "President", name: "Olivier REGORD", email: "olivier.regord@alp-medelec.com", phone: "04 92 43 23 34" },
      { role: "Secretary General", name: "Aurélie CHABAS", email: "federation.btp05@orange.fr", phone: "04 92 51 63 04" },
    ],
    address: "2 cours Emile Zola / Maison du Bâtiment - 05000 GAP",
  },
  {
    id: 64,
    code: "70",
    area: "Haute-Saône",
    name: "Building Trades Federation of Haute-Saône",
    members: [
      { role: "President", name: "Jean-Yves BELLAMY", email: "jean-yves.bellamy@orange.fr" },
      { role: "Secretary General", name: "Céline RENARD", email: "renardc@d70.ffbatiment.fr", phone: "03 84 75 39 67" },
    ],
    address: "Résidence le Ronsard - 31 rue Jean Jaurès - 70000 VESOUL",
  },
  {
    id: 65,
    code: "74",
    area: "Haute-Savoie",
    name: "Federation of Building Trades Contractors and Craftsmen of Haute-Savoie",
    members: [
      { role: "President", name: "Frédéric MANSARD", email: "etteba@mt-groupe.fr" },
      { role: "Secretary General", name: "Thierry TERBINS", email: "terbinst@d74.ffbatiment.fr", phone: "04 50 77 15 15" },
    ],
    address: "15 rue Andromède - Chavanod / Parc Altais / BP 79040 - 74991 ANNECY CEDEX 9",
  },
  {
    id: 66,
    code: "65",
    area: "Hautes-Pyrénées",
    name: "Building Trades Federation of Hautes-Pyrénées",
    members: [
      { role: "President", name: "Bruno RICHAUD", email: "b.richaud@bajon-andres.fr" },
      { role: "Secretary General", name: "Jean-Denis BRAU", email: "braujd@d65.ffbatiment.fr", phone: "05 62 93 11 39" },
    ],
    address: "5 rue d'Isaby / Parc d'Activités des Pyrénées - 65420 IBOS",
  },
  {
    id: 67,
    code: "87",
    area: "Haute-Vienne",
    name: "Building Trades Federation of Haute-Vienne",
    members: [
      { role: "President", name: "Sébastien LAMBRE", email: "slambre@avenirelec.fr" },
      { role: "Secretary General", name: "Laurent DOUCET", email: "doucetl@d87.ffbatiment.fr", phone: "05 55 11 21 87" },
    ],
    address: "2 allée Duke Ellington / BP 60005 - 87067 LIMOGES CEDEX 03",
  },
  {
    id: 68,
    code: "34",
    area: "Hérault",
    name: "Building Trades Federation of Hérault",
    members: [
      { role: "President", name: "Philippe ZANNI", email: "p.zanni@jp-elec.fr" },
      { role: "Secretary General", name: "Michel MARTY", email: "martym@d34.ffbatiment.fr", phone: "04 67 58 58 08" },
    ],
    address: "155 rue Jacques Fouroux - 34073 MONTPELLIER CEDEX 3",
  },
  {
    id: 69,
    code: "36",
    area: "Indre",
    name: "Building Trades Federation of Indre",
    members: [
      { role: "President", name: "Emmanuel FERRAND", email: "info@slee-energie.com" },
      { role: "Secretary General", name: "Florent ROUET", email: "rouetf@d36.ffbatiment.fr", phone: "02 54 08 77 00" },
    ],
    address: "5 rue Albert 1er / BP 48 - 36001 CHATEAUROUX CEDEX",
  },
  {
    id: 70,
    code: "37",
    area: "Indre et Loire",
    name: "French Building Federation of Indre-et-Loire",
    members: [
      { role: "President", name: "Julien ADRAST", email: "julien.adrast@gmail.com" },
      { role: "Secretary General", name: "Natacha DARDEAU", email: "dardeaun@d37.ffbatiment.fr", phone: "02 47 42 84 00" },
    ],
    address: "BP 67517 - 37075 TOURS CEDEX 2",
  },
  {
    id: 71,
    code: "38",
    area: "Isère",
    name: "Building Trades Federation of Isère",
    members: [
      { role: "President", name: "Maxime DREINA", email: "egd.dreina@orange.fr" },
      { role: "Secretary General", name: "Brigitte TIRARD-COLLET", email: "tirard-colletb@d38.ffbatiment.fr", phone: "04 76 86 63 80" },
    ],
    address: "88 avenue des Martyrs / CS 10405 - 38017 GRENOBLE CEDEX 1",
  },
  {
    id: 72,
    code: "39",
    area: "Jura",
    name: "Building Trades Federation of Jura",
    members: [
      { role: "President", name: "Patrick JANAND", email: "pjanand.ejedole@wanadoo.fr" },
      { role: "Secretary General", name: "Rémi MERTZ", email: "mertzr@d39.ffbatiment.fr", phone: "03 84 72 21 77" },
    ],
    address: "188 avenue Jacques Duhamel / Immeuble l'Arobas - 39100 DOLE",
  },
  {
    id: 73,
    code: "40",
    area: "Landes",
    name: "French Building Federation of Landes",
    members: [
      { role: "President", name: "Jean-Philippe DUCHESNE", email: "jeanphilippe@energique.fr" },
      { role: "Secretary General", name: "Mélanie MAUCORONEL", email: "maucoronelm@d40.ffbatiment.fr", phone: "05 58 74 07 54" },
    ],
    address: "153 avenue Georges Clémenceau - 40100 DAX",
  },
  {
    id: 74,
    code: "42",
    area: "Loire",
    name: "Building Trades Federation of Loire",
    members: [
      { role: "President", name: "Frédéric JOUBAND", email: "f.jouband@joubertequipement.fr" },
      { role: "Secretary General", name: "Tristan VACHERON", email: "vacheront@d42.ffbatiment.fr", phone: "04 77 42 36 86" },
    ],
    address: "17 rue de l'Apprentissage / CS 80045 - 42002 SAINT ETIENNE CEDEX 1",
  },
  {
    id: 75,
    code: "45",
    area: "Loiret",
    name: "French Building Trades Federation of Loiret",
    members: [
      { role: "President", name: "Jean-Marc SIMONET", email: "simonet.elec@orange.fr", phone: "0238217596" },
      { role: "Secretary General", name: "Marc JOURDREN", email: "jourdrenm@d45.ffbatiment.fr", phone: "02 38 68 09 68" },
    ],
    address: "116 avenue de Verdun - 45800 SAINT JEAN DE BRAYE",
  },
  {
    id: 76,
    code: "41",
    area: "Loir et Cher",
    name: "French Building Federation of Loir-et-Cher",
    members: [
      { role: "President", name: "Laurent SAUVAÎTRE", email: "laurent.sauvaitre@pelle-electricite.fr" },
      { role: "Secretary General", name: "Catherine JOUANNEAU", email: "jouanneauc@d41.ffbatiment.fr", phone: "02 54 78 14 30" },
    ],
    address: "130 avenue de Châteaudun - 41000 BLOIS",
  },
  {
    id: 77,
    code: "46",
    area: "Lot",
    name: "Building Trades Federation of Lot",
    members: [
      { role: "President", name: "François BORRAS", email: "mas.borras@orange.fr" },
      { role: "Secretary General", name: "Aurélie ALIDOR ROPP", email: "aurelie@fbtp46.fr", phone: "05 65 20 42 20" },
    ],
    address: "549 avenue du Maquis / Résidence de la Fontaine - Bât C - 46000 CAHORS",
  },
  {
    id: 78,
    code: "48",
    area: "Lozère",
    name: "Building Trades Federation of Lozère",
    members: [
      { role: "President", name: "Jean-Fabrice RODIER", email: "jeanfabrice@rodier-sas.fr" },
      { role: "Secretary General", name: "Noé LAURENCOT", email: "laurencotn@d48.ffbatiment.fr", phone: "04 66 65 12 51" },
    ],
    address: "6 rue Gutenberg / Maison du Bâtiment - 48000 MENDE",
  },
  {
    id: 79,
    code: "58",
    area: "Nièvre",
    name: "Building Trades Federation of Nièvre",
    members: [
      { role: "President", name: "Franck LARPENT", email: "direction@sedelec.net" },
      { role: "Secretary General", name: "Christine DANTHENY-DOUBRE", email: "danthenyc@d58.ffbatiment.fr", phone: "03 86 61 05 32" },
    ],
    address: "10 rue de Lourdes - 58000 NEVERS",
  },
  {
    id: 80,
    code: "75",
    area: "Grand Paris",
    name: "CSEEE (departments 75-92-93-94)",
    members: [
      { role: "President", name: "Xavier ROSA", email: "x.rosa@cseee.fr" },
      { role: "General Delegate", name: "Stéphane LANG", email: "s.lang@cseee.fr", phone: "01 40 55 14 10" },
    ],
    address: "10 rue du Débarcadère - 75852 PARIS CEDEX 17",
  },
  {
    id: 81,
    code: "63",
    area: "Puy de Dôme",
    name: "Building Trades Federation of Puy-de-Dôme",
    members: [
      { role: "President", name: "Eric BLASCO", email: "eric.blasco@sdbl.fr" },
      { role: "Secretary General", name: "Mathieu MORIOU", email: "morioum@d63.ffbatiment.fr", phone: "04 73 17 33 33" },
    ],
    address: "Pôle Services Bâtiment - 18 rue de Sarliève - 63800 COURNON D'AUVERGNE",
  },
  {
    id: 82,
    code: "66",
    area: "Pyrénées Orientales",
    name: "Building Trades House of Pyrénées-Orientales",
    members: [
      { role: "President", name: "Edith BERARD", email: "eberard@grabolosa.com" },
      { role: "Secretary General", name: "Thomas TARAVEL", email: "taravelt@d66.ffbatiment.fr", phone: "04 68 56 94 52" },
    ],
    address: "552 rue Félix Trombe / Maison du BTP - Tecnosud - 66100 PERPIGNAN",
  },
  {
    id: 83,
    code: "69",
    area: "Rhône",
    name: "Federation of Building Trades Companies of Rhône and the Metropolis",
    members: [
      { role: "President", name: "Frédéric GONDEAU", email: "frederic.gondeau@cne-elec.fr", phone: "04 72 04 84 94" },
      { role: "Secretary General", name: "Olivier BRUNET", email: "direction@btprhone.fr", phone: "04 72 44 15 15" },
      { role: "General Delegate", name: "Sylvie BLES-GAGNAIRE", email: "direction@btprhone.fr" },
    ],
    address: "23 avenue Condorcet / BP 1289 - 69608 VILLEURBANNE CEDEX",
  },
  {
    id: 84,
    code: "71",
    area: "Saône et Loire",
    name: "Building Trades Federation of Saône-et-Loire",
    members: [
      { role: "President", name: "Raphaël MONTERRAT", email: "raphael.monterrat@ega.fr", phone: "03 85 39 29 29" },
      { role: "Secretary General", name: "Laurence GODET HUMBERT", email: "godetl@d71.ffbatiment.fr", phone: "03 85 20 45 43" },
    ],
    address: "94 rue de Lyon / CS 20440 - 71040 MÂCON CEDEX 9",
  },
  {
    id: 85,
    code: "73",
    area: "Savoie",
    name: "Building Trades Federation of Savoie",
    members: [
      { role: "President", name: "Sébastien BELLEMIN", email: "sebastien.bellemin@citeos.com", phone: "04 79 33 28 25" },
      { role: "Secretary General", name: "Florence THIMON", email: "thimonf@d73.ffbatiment.fr", phone: "04 28 70 27 91" },
    ],
    address: "68 impasse Louis Berthollet - ZA de Bissy - 73000 CHAMBERY",
  },
  {
    id: 86,
    code: "77",
    area: "Seine et Marne",
    name: "Building Trades Federation of Île-de-France Est",
    members: [
      { role: "President", name: "James LEPATRE", email: "sarlmontelec77@gmail.com" },
      { role: "General Delegate", name: "Vincent FRAYSSINET", email: "frayssinetv@77.ffbatiment.fr", phone: "01 64 87 66 21" },
      { role: "Secretary General", name: "Chrystelle REGANHA", email: "regnhac@77.ffbatiment.fr", phone: "01 64 87 66 68" },
    ],
    address: "45 rue Nouvelle - 77190 DAMMARIE LES LYS",
  },
  {
    id: 87,
    code: "81",
    area: "Tarn",
    name: "Building Trades Federation of Tarn",
    members: [
      { role: "President", name: "Frédéric VERGNES", email: "contact@sitelec81.fr" },
      { role: "Secretary General", name: "Estelle DONNE", email: "donnee@d81.ffbatiment.fr", phone: "05 63 54 19 43" },
    ],
    address: "23-25 boulevard Lacombe - 81000 ALBI",
  },
  {
    id: 88,
    code: "82",
    area: "Tarn et Garonne",
    name: "Building Trades Federation of Tarn-et-Garonne",
    members: [
      { role: "President", name: "Laurent TOURNIER", email: "tl@tournier-elec.com", phone: "05.36.48.01.25" },
      { role: "Secretary General", name: "Julien ARTUSO", email: "artusoj@d82.ffbatiment.fr", phone: "05 63 63 78 00" },
    ],
    address: "82 avenue du Portugal / ZA AlbaSud - 82000 MONTAUBAN",
  },
  {
    id: 89,
    code: "90",
    area: "Territoire de Belfort",
    name: "Building Trades Federation of Territoire de Belfort",
    members: [
      { role: "President", name: "Philippe CESCHIA", email: "espace.elec@wanadoo.fr" },
      { role: "Secretary General", name: "Céline RENARD", email: "renardc@d90.ffbatiment.fr", phone: "03 84 28 28 15" },
    ],
    address: "1 avenue de la Gare TGV / Immeuble Jonxion 1 - Tour 2ème étage / CS 70605 - Meroux Moval - 90023 BELFORT CEDEX",
  },
  {
    id: 90,
    code: "95",
    area: "Val d'oise",
    name: "FFB du Val d'Oise",
    members: [
      { role: "President", name: "Alexandre MAHOUT", email: "alexandre.mahout@secal-electricite.fr" },
      { role: "Secretary General", name: "William VINAND", email: "vinandw@d95.ffbatiment.fr", phone: "01 34 20 11 90" },
    ],
    address: "ZA Francis Combe / 30 rue Francis Combe - 95000 Cergy",
    website: "https://CERGY",
  },
  {
    id: 91,
    code: "83",
    area: "Var",
    name: "Building Trades Federation of Var",
    members: [
      { role: "President", name: "Cédric GHIGOU", email: "contact@energitec-paca.fr" },
      { role: "Secretary General", name: "Cyril BOLLIET", email: "bollietc@d83.ffbatiment.fr", phone: "04 94 89 94 70" },
    ],
    address: "235 Avenue Pierre et Marie Curie - 83041 TOULON CEDEX 9",
  },
  {
    id: 92,
    code: "84",
    area: "Vaucluse",
    name: "Building Trades Federation of Vaucluse",
    members: [
      { role: "President", name: "François-Xavier BRES", email: "fx.bres@bres-sa.fr" },
      { role: "Secretary General", name: "Emmanuel MELI", email: "e.meli@btp84.com", phone: "04 90 82 40 63" },
    ],
    address: "3 rue de la Petite Fusterie - 84000 AVIGNON",
  },
  {
    id: 93,
    code: "89",
    area: "Yonne",
    name: "Federation of Building Trades Contractors and Craftsmen of Yonne",
    members: [
      { role: "President", name: "Awaiting appointment" },
      { role: "Secretary General", name: "Christian DUCHET", email: "duchetc@d89.ffbatiment.fr", phone: "03 86 46 01 04" },
    ],
    address: "32 rue de l'Ocrerie - 89000 AUXERRE",
  },
  {
    id: 94,
    code: "78",
    area: "Yvelines",
    name: "French Building Federation of Yvelines",
    members: [
      { role: "President", name: "Patrick BOURDEAUX", email: "pat-elec78@orange.fr", phone: "01 34 87 59 42" },
      { role: "Secretary General", name: "Fabien LOAEC", email: "loaecf@d78.ffbatiment.fr", phone: "01 39 54 23 69" },
    ],
    address: "29 avenue Debasseux / Le Chesnay - 78150 LE CHESNAY-ROCQUENCOURT",
  },
  {
    id: 95,
    code: "974",
    area: "La Réunion",
    name: "Réunion Building and Public Works Federation",
    members: [
      { role: "President", name: "Ludovic VALLIAMEE", email: "ludovic.valliamee@conceptelect.re" },
      { role: "Secretary General", name: "Philippe LEBON", email: "lebonp@lareunion.ffbatiment.fr", phone: "0262 41 70 87" },
    ],
    address: "Rue du Pont / CS 41051 - 97404 SAINT DENIS CEDEX",
  },
  {
    id: 96,
    code: "971",
    area: "Guadeloupe",
    name: "FRBTPG",
    members: [
      { role: "Secretary General", name: "Jean-Luc LUBIN-BAGASSIEN", email: "sg.frbtp.gpe@orange.fr", phone: "0590 38 18 81" },
    ],
    address: "117, impasse Emile Dessout - ZI Jarry - 97122 BAIE-MAHAULT",
  },
  {
    id: 97,
    code: "988",
    area: "Nouvelle Calédonie",
    name: "Caledonian Building Trades Federation",
    members: [
      { role: "Secretary General", name: "Stéphanie AMSTUTZ-ARRIEGUY", email: "direction@fcbtp.nc", phone: "+687 27 79 33" },
    ],
    address: "30 route de la Baie des Dames / Forum Le Centre au 1er étage / Entrée face à l'OPT - Ducos - 98800 NOUMEA",
  },
  {
    id: 98,
    code: "972",
    area: "Martinique",
    name: "ORPEM - Organisation of Energy Professionals in Martinique",
    members: [
      { role: "President", name: "Stéphanie CLAIRICIA", email: "orpem972@gmail.com" },
    ],
    address: "LE BOURG - 97222 CASE PILOTE",
  },
];

// Map coordinates from the feed, keyed by id. Kept separate so the entries
// above stay readable; merged into FEDERATIONS below.
const COORDS: Record<number, { lat: number; lng: number }> = {
  1: { lat: 48.528771, lng: -2.764546 },
  2: { lat: 48.442552, lng: -4.414579 },
  3: { lat: 48.130665, lng: -1.680707 },
  4: { lat: 47.78806, lng: -3.341584 },
  5: { lat: 49.1859, lng: -0.3591 },
  6: { lat: 49.0142, lng: 1.18012 },
  7: { lat: 49.642285, lng: -1.6224898 },
  8: { lat: 48.4355, lng: 0.094295 },
  9: { lat: 49.4748696, lng: 1.0982519 },
  10: { lat: 49.4838, lng: 0.132921 },
  12: { lat: 50.6604, lng: 3.09845 },
  13: { lat: 49.4505, lng: 2.09789 },
  14: { lat: 49.8907, lng: 2.28085 },
  15: { lat: 49.770855, lng: 4.717665 },
  16: { lat: 48.2675, lng: 4.07545 },
  17: { lat: 48.6141, lng: 7.7103 },
  18: { lat: 47.7527, lng: 7.34839 },
  19: { lat: 48.0571952, lng: 5.056434 },
  20: { lat: 49.2588, lng: 4.03571 },
  21: { lat: 48.7049301, lng: 6.1691026 },
  22: { lat: 49.1636, lng: 5.37817 },
  23: { lat: 49.103866, lng: 6.2095 },
  24: { lat: 48.177, lng: 6.47278 },
  25: { lat: 47.2317, lng: -1.62733 },
  26: { lat: 47.4469, lng: -0.550633 },
  27: { lat: 48.0684086, lng: -0.7651087 },
  28: { lat: 48.0056, lng: 0.199979 },
  29: { lat: 46.674791, lng: -1.4181793 },
  30: { lat: 45.6618, lng: 0.155982 },
  31: { lat: 45.934887, lng: -0.961488 },
  32: { lat: 45.278062, lng: 1.7917182 },
  33: { lat: 46.1705, lng: 1.8792 },
  34: { lat: 46.3093, lng: -0.4804721 },
  35: { lat: 45.1833, lng: 0.737905 },
  36: { lat: 44.876391, lng: -0.578685 },
  38: { lat: 44.167974, lng: 0.594893 },
  39: { lat: 43.32, lng: -0.359284 },
  40: { lat: 46.5806, lng: 0.376637 },
  41: { lat: 46.2071653, lng: 5.2212194 },
  42: { lat: 49.569534, lng: 3.629018 },
  43: { lat: 46.5657688, lng: 3.3520839 },
  44: { lat: 44.07645797729492, lng: 6.189627170562744 },
  45: { lat: 43.68671417236328, lng: 7.200220108032227 },
  46: { lat: 43.0323371887207, lng: 1.6179639101028442 },
  47: { lat: 43.20814895629883, lng: 2.3041980266571045 },
  48: { lat: 44.3537355, lng: 2.5734552 },
  49: { lat: 43.2578825, lng: 5.3992519 },
  50: { lat: 44.9120031, lng: 2.448975 },
  51: { lat: 47.0846557, lng: 2.3965399 },
  52: { lat: 41.9272, lng: 8.7346 },
  53: { lat: 47.3224015, lng: 5.0437854 },
  54: { lat: 47.2759415, lng: 5.9914874 },
  55: { lat: 44.905463, lng: 4.907161 },
  56: { lat: 48.6248779296875, lng: 2.4346163272857666 },
  57: { lat: 48.4314444, lng: 1.5019146 },
  58: { lat: 43.8201034, lng: 4.3696228 },
  59: { lat: 43.6379227, lng: 0.5879188 },
  60: { lat: 42.7478, lng: 9.432 },
  61: { lat: 43.5842149, lng: 1.4402165 },
  62: { lat: 45.0394071, lng: 3.8846389 },
  63: { lat: 44.5544903, lng: 6.0754485 },
  64: { lat: 47.643132, lng: 6.149625 },
  65: { lat: 45.89788818359375, lng: 6.082606792449951 },
  66: { lat: 43.2203183, lng: 0.0255306 },
  67: { lat: 45.8567818, lng: 1.2868613 },
  68: { lat: 43.5898011, lng: 3.8528122 },
  69: { lat: 46.8111097, lng: 1.6977757 },
  70: { lat: 47.4174647, lng: 0.688169 },
  71: { lat: 45.2035153, lng: 5.7036661 },
  72: { lat: 47.0810954, lng: 5.4755523 },
  73: { lat: 43.7082736, lng: -1.047469 },
  74: { lat: 45.43444061279297, lng: 4.37750768661499 },
  75: { lat: 47.846855, lng: 1.9238167 },
  76: { lat: 47.6151773, lng: 1.3274163 },
  77: { lat: 44.4529665, lng: 1.4486135 },
  78: { lat: 44.5288558, lng: 3.4692904 },
  79: { lat: 46.9913868, lng: 3.1570357 },
  80: { lat: 48.8779734, lng: 2.2877481 },
  81: { lat: 45.7667437, lng: 3.082064 },
  82: { lat: 42.6655498, lng: 2.9060598 },
  83: { lat: 45.7767303, lng: 4.8675564 },
  84: { lat: 46.2958803, lng: 4.8192269 },
  85: { lat: 45.59291076660156, lng: 5.8878583908081055 },
  86: { lat: 48.5312841, lng: 2.6455315 },
  87: { lat: 43.9221629, lng: 2.1383378 },
  88: { lat: 43.9848163, lng: 1.3289558 },
  89: { lat: 47.5841067, lng: 6.8957797 },
  90: { lat: 49.0459007, lng: 2.07235 },
  91: { lat: 43.13603591918945, lng: 5.997412204742432 },
  92: { lat: 43.94965744018555, lng: 4.8043036460876465 },
  93: { lat: 47.803890228271484, lng: 3.576944589614868 },
  94: { lat: 48.8167435, lng: 2.1314442 },
  95: { lat: -20.8787953, lng: 55.4448636 },
  96: { lat: 16.2516364, lng: -61.5690333 },
  97: { lat: -22.2365705, lng: 166.4060345 },
};

/** All federations, with feed coordinates merged in (when available). */
export const FEDERATIONS: Federation[] = FEDERATION_ENTRIES.map((f) => {
  const c = COORDS[f.id];
  return c ? { ...f, lat: c.lat, lng: c.lng } : f;
});

/** Federations that have a map coordinate — the ones that get a pin. */
export const FEDERATIONS_WITH_COORDS: Federation[] = FEDERATIONS.filter(
  (f) => typeof f.lat === "number" && typeof f.lng === "number"
);

/** Display name for a federation — the official name, always present. */
export function federationTitle(f: Federation): string {
  return f.name;
}

/** True when a federation has any contact detail to show. */
export function hasContactDetails(f: Federation): boolean {
  return Boolean(f.address || f.website || (f.members && f.members.length > 0));
}
