// One-off script: parses the raw wikitext of the English Wikipedia page
// "Communes of Senegal" (scripts/communes_raw.wiki) into a structured
// region -> département -> [communes] JSON, stopping before "See also"
// so bibliography/reference bullets aren't picked up as communes.
// Run with: node scripts/parse-communes.js

const fs = require('fs');
const raw = fs.readFileSync(__dirname + '/communes_raw.wiki', 'utf8');
const lines = raw.split(/\r?\n/);

function cleanLink(text){
  // [[Display]] -> Display ; [[Target|Display]] -> Display
  return text.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, function(_, target, display){
    return display || target;
  }).replace(/'''/g, '').trim();
}

const result = []; // { region, departement, communes: [] }
let currentRegion = null;
let currentDept = null;
let stop = false;

for(const line of lines){
  if(/^==\s*See also/.test(line)) { stop = true; break; }

  if(line.startsWith('===')){
    const deptMatch = line.match(/^===+\s*(.+?)\s*=+$/);
    if(deptMatch){
      let label = cleanLink(deptMatch[1]);
      label = label.replace(/\s*Department$/i, '');
      currentDept = label;
      result.push({ region: currentRegion, departement: currentDept, communes: [] });
    }
    continue;
  }
  if(line.startsWith('==')){
    const regionMatch = line.match(/^==+\s*(.+?)\s*=+$/);
    if(regionMatch){
      let label = cleanLink(regionMatch[1]);
      label = label.replace(/\s*Region$/i, '');
      currentRegion = label;
      currentDept = null;
    }
    continue;
  }
  const bulletMatch = line.match(/^\*\s*(.+)$/);
  if(bulletMatch && currentDept){
    const name = cleanLink(bulletMatch[1]);
    if(name) result[result.length-1].communes.push(name);
  }
}

let total = 0;
result.forEach(d => total += d.communes.length);

console.log('Régions:', new Set(result.map(d=>d.region)).size);
console.log('Départements:', result.length);
console.log('Total communes:', total);

fs.writeFileSync(__dirname + '/communes_parsed.json', JSON.stringify(result, null, 2), 'utf8');
console.log('Written to scripts/communes_parsed.json');
