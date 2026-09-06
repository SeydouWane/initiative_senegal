/* Données des 45 communes suivies par l'initiative.
   Chaque entrée : [nom, région, statut, x, y]
   statut : "doc" = à documenter · "env" = demande envoyée
            "obt" = réponse obtenue · "ref" = refus opposé
   Tous les statuts sont pour l'instant à "doc" (à documenter) : aucune
   démarche réelle n'a encore été engagée par le réseau de référents.
   Ils seront mis à jour commune par commune au fil de la collecte.

   x, y : position sur la carte (viewBox 0 0 600 490), calculées par
   projection équirectangulaire des coordonnées géographiques réelles
   (longitude/latitude) de chaque commune — voir scripts/project-map.js.
   Le tracé du pays (SENEGAL_OUTLINE) provient des frontières réelles
   du Sénégal (Natural Earth, admin niveau 0), projetées avec la même
   méthode, et n'est donc plus une forme dessinée à main levée. */

const COMMUNES = [
  ["Dakar","Dakar","doc",30.6,223.2],["Pikine","Dakar","doc",35.8,217.2],["Guédiawaye","Dakar","doc",34.5,215.8],["Rufisque","Dakar","doc",47.3,220.9],["Bargny","Dakar","doc",50.6,222.6],
  ["Thiès","Thiès","doc",78,213.7],["Mbour","Thiès","doc",75.8,249.3],["Tivaouane","Thiès","doc",89.1,198.5],["Joal-Fadiouth","Thiès","doc",87.6,273.6],
  ["Diourbel","Diourbel","doc",143.3,226.4],["Mbacké","Diourbel","doc",172.7,214.5],["Touba","Diourbel","doc",175.8,208.1],
  ["Louga","Louga","doc",144,134.7],["Kébémer","Louga","doc",123.6,155.9],["Linguère","Louga","doc",247,155.3],
  ["Saint-Louis","Saint-Louis","doc",119.5,96],["Dagana","Saint-Louis","doc",211,48.3],["Richard-Toll","Saint-Louis","doc",192.8,53.4],
  ["Matam","Matam","doc",419.9,130.8],["Kanel","Matam","doc",428.2,147.3],["Ourossogui","Matam","doc",413.9,135.3],
  ["Tambacounda","Tambacounda","doc",381.7,311.6],["Bakel","Tambacounda","doc",493.5,203.1],["Goudiry","Tambacounda","doc",470,272],
  ["Kédougou","Kédougou","doc",520.3,428.2],["Salémata","Kédougou","doc",460.7,420.8],["Saraya","Kédougou","doc",559.8,401.6],
  ["Kolda","Kolda","doc",263.4,395.8],["Vélingara","Kolda","doc",339.9,371.2],["Médina Yoro Foulah","Kolda","doc",284.2,356.8],
  ["Sédhiou","Sédhiou","doc",206.1,413.6],["Goudomp","Sédhiou","doc",176.9,426.1],["Bounkiling","Sédhiou","doc",192.8,380.8],
  ["Ziguinchor","Ziguinchor","doc",139.7,425.6],["Bignona","Ziguinchor","doc",143.9,403.8],["Oussouye","Ziguinchor","doc",114.2,435],
  ["Fatick","Fatick","doc",126.8,257.1],["Gossas","Fatick","doc",158.9,242.3],["Foundiougne","Fatick","doc",121.6,276.8],
  ["Kaolack","Kaolack","doc",158.2,275],["Nioro du Rip","Kaolack","doc",183.5,313.6],["Guinguinéo","Kaolack","doc",169.6,264],
  ["Kaffrine","Kaffrine","doc",206.8,279.5],["Birkelane","Kaffrine","doc",185.1,278.4],["Malem Hodar","Kaffrine","doc",230.5,281.2]
];

/* Tracé réel des frontières du Sénégal (Natural Earth, admin 0), projeté
   sur le même viewBox et avec la même méthode que les communes ci-dessus. */
const SENEGAL_OUTLINE = "M98.7,328.5 L60.4,253.8 L14,219.6 L54.9,201.4 L99.9,134.1 L121.9,84.8 L153.8,54 L199.9,62.3 L245.3,41.4 L297.1,40.3 L341.5,68.6 L403.2,94 L459.4,164.6 L520.7,230.4 L525,290.1 L543.3,345.1 L578.1,372 L586,409.1 L581.7,439 L568.3,444.4 L517.7,436.8 L510.7,447.5 L490.2,449.7 L423.4,426.3 L378.6,425.3 L206.9,421.2 L182,432 L151.2,429 L102,444.6 L86.8,371 L171.3,373.1 L193.7,359.6 L210.3,358.8 L244.8,336.7 L284.6,357 L325,358.7 L365.2,337.1 L346.4,309.4 L315.8,325.5 L286.9,325.1 L250.3,301.5 L220.8,303 L199.8,325.7 L98.7,328.5 Z";

/* Fiches détaillées par commune. Champ "maire" : maires élus lors des
   élections locales du 23 janvier 2022, avec mise à jour connue en cas de
   changement (démission, destitution, décès...) constatée avant la mise
   en ligne de cette page. Ces informations proviennent de recherches
   documentaires (presse sénégalaise, sites officiels) et PEUVENT ÊTRE
   DÉSUÈTES ou inexactes : à vérifier et corriger par le réseau de
   référents avant toute publication définitive. Quand aucune source
   fiable n'a été trouvée, le champ reste vide ("À vérifier").
   "referent" et "documents" restent volontairement vides : le réseau de
   référents locaux de l'initiative n'est pas encore constitué, et aucun
   document n'a encore été obtenu — ces champs seront alimentés au fil
   des démarches réelles. */
const COMMUNE_DETAILS = {
  "Dakar": { maire: "Abass Fall", note: "Élu par le conseil municipal en août 2025, après la destitution de Barthélémy Dias (déc. 2024)." },
  "Pikine": { maire: "Abdoulaye Timbo", note: "Élu en janvier 2022." },
  "Guédiawaye": { maire: "Ahmed Aïdara", note: "Élu en janvier 2022." },
  "Rufisque": { maire: "Oumar Cissé", note: "Élu en janvier 2022." },
  "Bargny": { maire: "Djibril Fall", note: "Élu en janvier 2022." },
  "Thiès": { maire: "Babacar Diop", note: "Élu en janvier 2022." },
  "Mbour": { maire: "Cheikh Issa Sall", note: "Élu en janvier 2022." },
  "Tivaouane": { maire: "Demba Diop (dit Diop Sy)", note: "Élu en janvier 2022." },
  "Joal-Fadiouth": { maire: "Sophie Gladima", note: "Élue en janvier 2022." },
  "Diourbel": { maire: "Malick Fall", note: "Élu en janvier 2022." },
  "Mbacké": { maire: "Gallo Bâ", note: "Élu en janvier 2022." },
  "Touba": { maire: "Abdoul Ahad Ka", note: "Élu en janvier 2022 (commune récente de Touba)." },
  "Louga": { maire: "Moustapha Diop", note: "Élu en janvier 2022." },
  "Saint-Louis": { maire: "Mansour Faye", note: "Réélu en janvier 2022, en poste." },
  "Richard-Toll": { maire: "Amadou Mame Diop", note: "Élu en janvier 2022." },
  "Tambacounda": { maire: "Papa Banda Dièye", note: "Élu en janvier 2022." },
  "Kédougou": { maire: "Ousmane Sylla", note: "Élu en janvier 2022." },
  "Kolda": { maire: "Mame Boye Diao", note: "Élu en janvier 2022." },
  "Vélingara": { maire: "Mamadou Oury Baïlo Diallo", note: "Réélu (4ᵉ mandat consécutif) en janvier 2022." },
  "Sédhiou": { maire: "Abdoulaye Diop", note: "Élu en janvier 2022." },
  "Ziguinchor": { maire: "Djibril Sonko", note: "Élu en juin 2024, après la démission d'Ousmane Sonko (devenu Premier ministre)." },
  "Kaffrine": { maire: "Abdoulaye Saydou Sow", note: "Élu en janvier 2022." },
  "Kaolack": { maire: "Sérigne Mboup", note: "Élu en janvier 2022." },
  "Gossas": { maire: "Adama Diallo", note: "Élu en janvier 2022." },
  "Fatick": { maire: "Matar Bâ", note: "Élu en janvier 2022 — mandat à reconfirmer." },
  "Foundiougne": { maire: "Thiémokho Ndiaye", note: "Source à recouper." },
  "Nioro du Rip": { maire: "Modou Mbaye", note: "Source à recouper." },
  "Guinguinéo": { maire: "Rokhaya Diouf", note: "Source à recouper." }
};
