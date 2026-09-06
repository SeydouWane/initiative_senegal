// One-off script: projects real lon/lat geography onto the SVG viewBox
// used by index.html (0 0 600 490), using an equirectangular projection
// (x = lon * cos(lat0)) which is accurate enough at Senegal's latitude
// and scale. Run with: node scripts/project-map.js

const VIEWBOX_W = 600;
const VIEWBOX_H = 490;
const PAD = 14; // padding in svg units so pins/outline don't touch edges

// Real country boundary (Natural Earth, via johan/world.geo.json), [lon,lat] pairs
const outline = [[-16.713729,13.594959],[-17.126107,14.373516],[-17.625043,14.729541],[-17.185173,14.919477],[-16.700706,15.621527],[-16.463098,16.135036],[-16.12069,16.455663],[-15.623666,16.369337],[-15.135737,16.587282],[-14.577348,16.598264],[-14.099521,16.304302],[-13.435738,16.039383],[-12.830658,15.303692],[-12.17075,14.616834],[-12.124887,13.994727],[-11.927716,13.422075],[-11.553398,13.141214],[-11.467899,12.754519],[-11.513943,12.442988],[-11.658301,12.386583],[-12.203565,12.465648],[-12.278599,12.35444],[-12.499051,12.33209],[-13.217818,12.575874],[-13.700476,12.586183],[-15.548477,12.62817],[-15.816574,12.515567],[-16.147717,12.547762],[-16.677452,12.384852],[-16.841525,13.151394],[-15.931296,13.130284],[-15.691001,13.270353],[-15.511813,13.27857],[-15.141163,13.509512],[-14.712197,13.298207],[-14.277702,13.280585],[-13.844963,13.505042],[-14.046992,13.794068],[-14.376714,13.62568],[-14.687031,13.630357],[-15.081735,13.876492],[-15.39877,13.860369],[-15.624596,13.623587],[-16.713729,13.594959]];

// Real (name, region, lon, lat) for the 45 communes tracked by the initiative
const towns = [
["Dakar","Dakar",-17.4467,14.6928],["Pikine","Dakar",-17.3900,14.7549],["Guédiawaye","Dakar",-17.4041,14.7692],["Rufisque","Dakar",-17.2667,14.7167],["Bargny","Dakar",-17.2314,14.6989],
["Thiès","Thiès",-16.9359,14.7910],["Mbour","Thiès",-16.9600,14.4200],["Tivaouane","Thiès",-16.8167,14.9500],["Joal-Fadiouth","Thiès",-16.8333,14.1667],
["Diourbel","Diourbel",-16.2333,14.6592],["Mbacké","Diourbel",-15.9167,14.7833],["Touba","Diourbel",-15.8833,14.8500],
["Louga","Louga",-16.2258,15.6144],["Kébémer","Louga",-16.4453,15.3939],["Linguère","Louga",-15.1170,15.4000],
["Saint-Louis","Saint-Louis",-16.4896,16.0179],["Dagana","Saint-Louis",-15.5050,16.5158],["Richard-Toll","Saint-Louis",-15.7003,16.4625],
["Matam","Matam",-13.2554,15.6558],["Kanel","Matam",-13.1670,15.4830],["Ourossogui","Matam",-13.3200,15.6086],
["Tambacounda","Tambacounda",-13.6672,13.7708],["Bakel","Tambacounda",-12.4633,14.9014],["Goudiry","Tambacounda",-12.7167,14.1833],
["Kédougou","Kédougou",-12.1747,12.5556],["Salémata","Kédougou",-12.8170,12.6330],["Saraya","Kédougou",-11.7500,12.8330],
["Kolda","Kolda",-14.9406,12.8939],["Vélingara","Kolda",-14.1167,13.1500],["Médina Yoro Foulah","Kolda",-14.7170,13.3000],
["Sédhiou","Sédhiou",-15.5569,12.7081],["Goudomp","Sédhiou",-15.8720,12.5780],["Bounkiling","Sédhiou",-15.7000,13.0500],
["Ziguinchor","Ziguinchor",-16.2719,12.5833],["Bignona","Ziguinchor",-16.2264,12.8103],["Oussouye","Ziguinchor",-16.5469,12.4850],
["Fatick","Fatick",-16.4111,14.3390],["Gossas","Fatick",-16.0658,14.4936],["Foundiougne","Fatick",-16.4667,14.1333],
["Kaolack","Kaolack",-16.0728,14.1520],["Nioro du Rip","Kaolack",-15.8000,13.7500],["Guinguinéo","Kaolack",-15.9500,14.2667],
["Kaffrine","Kaffrine",-15.5500,14.1058],["Birkelane","Kaffrine",-15.7833,14.1167],["Malem Hodar","Kaffrine",-15.2944,14.0883]
];

const allLats = outline.map(p=>p[1]).concat(towns.map(t=>t[3]));
const lat0 = (Math.min(...allLats) + Math.max(...allLats)) / 2 * Math.PI/180;
const cosLat0 = Math.cos(lat0);

function toXY(lon, lat){
  return [ lon * cosLat0, -lat ]; // flip lat so north is up in screen space
}

const outlineXY = outline.map(([lon,lat]) => toXY(lon,lat));
const townXY = towns.map(([name,region,lon,lat]) => toXY(lon,lat));

const allXY = outlineXY.concat(townXY);
const xs = allXY.map(p=>p[0]), ys = allXY.map(p=>p[1]);
const minX = Math.min(...xs), maxX = Math.max(...xs);
const minY = Math.min(...ys), maxY = Math.max(...ys);

const availW = VIEWBOX_W - PAD*2;
const availH = VIEWBOX_H - PAD*2;
const scale = Math.min(availW/(maxX-minX), availH/(maxY-minY));

// center the projected shape within the viewbox
const shapeW = (maxX-minX)*scale, shapeH = (maxY-minY)*scale;
const offX = PAD + (availW - shapeW)/2;
const offY = PAD + (availH - shapeH)/2;

function toSvg([x,y]){
  return [ +(offX + (x-minX)*scale).toFixed(1), +(offY + (y-minY)*scale).toFixed(1) ];
}

const outlineSvg = outlineXY.map(toSvg);
const pathD = outlineSvg.map((p,i)=> (i===0?'M':'L') + p[0] + ',' + p[1]).join(' ') + ' Z';

const townSvg = towns.map((t,i)=>{
  const [x,y] = toSvg(townXY[i]);
  return `["${t[0]}","${t[1]}","doc",${x},${y}]`;
});

console.log('--- SENEGAL_OUTLINE ---');
console.log(pathD);
console.log('--- COMMUNES (x,y updated, status all defaulted to doc) ---');
console.log(townSvg.join(',\n'));
