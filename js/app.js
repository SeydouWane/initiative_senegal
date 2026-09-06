(function(){
  var STATUS_LABEL = { doc:"À documenter", env:"Demande envoyée", obt:"Réponse obtenue", ref:"Refus opposé" };
  var STATUS_CLASS = { doc:"b-doc", env:"b-env", obt:"b-obt", ref:"b-ref" };
  var STATUS_VAR = { doc:"--status-neutral", env:"--status-pending", obt:"--status-success", ref:"--status-danger" };

  var communes = COMMUNES.map(function(c){
    return { name:c[0], region:c[1], status:c[2], x:c[3], y:c[4] };
  });

  document.getElementById('senegal-outline').setAttribute('d', SENEGAL_OUTLINE);

  var regions = Array.from(new Set(communes.map(function(c){return c.region;}))).sort(function(a,b){return a.localeCompare(b,'fr');});
  var regionSelect = document.getElementById('regionSelect');
  regions.forEach(function(r){
    var o = document.createElement('option'); o.value = r; o.textContent = r; regionSelect.appendChild(o);
  });

  var pinsLayer = document.getElementById('pinsLayer');
  var communeList = document.getElementById('communeList');

  communes.forEach(function(c, i){
    var g = document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('class','pin');
    g.setAttribute('tabindex','0');
    g.setAttribute('role','button');
    g.setAttribute('aria-label', c.name + ', région ' + c.region + ', ' + STATUS_LABEL[c.status]);
    g.dataset.idx = i;

    var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
    circle.setAttribute('class','dot');
    circle.setAttribute('cx', c.x); circle.setAttribute('cy', c.y); circle.setAttribute('r', 5.5);
    circle.setAttribute('fill', 'var(' + STATUS_VAR[c.status] + ')');
    g.appendChild(circle);

    var title = document.createElementNS('http://www.w3.org/2000/svg','title');
    title.textContent = c.name + ' — ' + c.region + ' — ' + STATUS_LABEL[c.status];
    g.appendChild(title);

    g.addEventListener('click', function(){ openModal(i); });
    g.addEventListener('keydown', function(e){ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); openModal(i); } });

    pinsLayer.appendChild(g);
  });

  function renderList(filtered){
    communeList.innerHTML = '';
    if(filtered.length === 0){
      var empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'Aucune commune ne correspond à ces filtres.';
      communeList.appendChild(empty);
      return;
    }
    filtered.forEach(function(item){
      var row = document.createElement('button');
      row.className = 'row';
      row.type = 'button';
      row.innerHTML = '<span><span class="name">'+item.c.name+'</span><br><span class="region">'+item.c.region+'</span></span>' +
        '<span class="badge '+STATUS_CLASS[item.c.status]+'">'+STATUS_LABEL[item.c.status]+'</span>';
      row.addEventListener('click', function(){ openModal(item.i); });
      communeList.appendChild(row);
    });
  }

  function applyFilters(){
    var q = document.getElementById('searchInput').value.trim().toLowerCase();
    var region = regionSelect.value;
    var status = document.getElementById('statusSelect').value;

    var visibleIdx = {};
    var filteredForList = [];

    communes.forEach(function(c, i){
      var match = true;
      if(q && c.name.toLowerCase().indexOf(q) === -1) match = false;
      if(region && c.region !== region) match = false;
      if(status && c.status !== status) match = false;
      if(match){ visibleIdx[i] = true; filteredForList.push({c:c, i:i}); }
    });

    Array.prototype.forEach.call(pinsLayer.children, function(g){
      var i = g.dataset.idx;
      if(visibleIdx[i]){ g.classList.remove('dim'); } else { g.classList.add('dim'); }
    });

    renderList(filteredForList);
  }

  document.getElementById('searchInput').addEventListener('input', applyFilters);
  regionSelect.addEventListener('change', applyFilters);
  document.getElementById('statusSelect').addEventListener('change', applyFilters);
  document.getElementById('resetBtn').addEventListener('click', function(){
    document.getElementById('searchInput').value = '';
    regionSelect.value = '';
    document.getElementById('statusSelect').value = '';
    applyFilters();
  });

  var modalBack = document.getElementById('modalBack');
  function openModal(i){
    var c = communes[i];
    var details = (typeof COMMUNE_DETAILS !== 'undefined' && COMMUNE_DETAILS[c.name]) || {};
    document.getElementById('modalName').textContent = c.name;
    document.getElementById('modalRegion').textContent = 'Région de ' + c.region;
    var badge = document.getElementById('modalBadge');
    badge.textContent = STATUS_LABEL[c.status];
    badge.className = 'badge ' + STATUS_CLASS[c.status];

    document.getElementById('modalMaire').textContent = details.maire || 'Non renseigné';
    document.getElementById('modalReferent').textContent = 'Poste à pourvoir';
    document.getElementById('modalDocs').textContent = 'Aucun document répertorié pour l\'instant';
    document.getElementById('modalUpdated').textContent = '—';

    var footnote = document.getElementById('modalFootnote');
    if(details.maire){
      footnote.textContent = 'Nom du maire issu de recherches documentaires (élections locales 2022' +
        (details.note ? ' — ' + details.note : '') +
        '). À vérifier par le réseau de référents avant publication officielle. Référent local, documents et statut restent à documenter.';
    } else {
      footnote.textContent = 'Fiche illustrative. Les informations réelles de cette commune seront ajoutées au fil des démarches suivies par nos référents locaux.';
    }

    modalBack.classList.add('open');
  }
  document.getElementById('modalClose').addEventListener('click', function(){ modalBack.classList.remove('open'); });
  modalBack.addEventListener('click', function(e){ if(e.target === modalBack) modalBack.classList.remove('open'); });

  /* ---- Formulaire "Devenir référent" ---- */
  var refModalBack = document.getElementById('refModalBack');
  var refForm = document.getElementById('refForm');
  var refStatus = document.getElementById('refStatus');
  var refSubmitBtn = document.getElementById('refSubmitBtn');
  var refRegionSelect = document.getElementById('refRegion');

  regions.forEach(function(r){
    var o = document.createElement('option'); o.value = r; o.textContent = r; refRegionSelect.appendChild(o);
  });

  var communeSuggestions = document.getElementById('communeSuggestions');
  communes.forEach(function(c){
    var o = document.createElement('option'); o.value = c.name; communeSuggestions.appendChild(o);
  });

  function openRefModal(){
    refStatus.textContent = '';
    refStatus.className = 'ref-status';
    refModalBack.classList.add('open');
  }
  function closeRefModal(){ refModalBack.classList.remove('open'); }

  document.getElementById('openRefForm').addEventListener('click', openRefModal);
  document.getElementById('refModalClose').addEventListener('click', closeRefModal);
  refModalBack.addEventListener('click', function(e){ if(e.target === refModalBack) closeRefModal(); });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){ modalBack.classList.remove('open'); closeRefModal(); }
  });

  refForm.addEventListener('submit', function(e){
    e.preventDefault();

    if(typeof FORM_ENDPOINT === 'undefined' || !FORM_ENDPOINT || FORM_ENDPOINT.indexOf('REMPLACER') === 0){
      refStatus.textContent = "Le formulaire n'est pas encore configuré (voir js/config.js). Contactez l'équipe autrement pour le moment.";
      refStatus.className = 'ref-status err';
      return;
    }

    var formData = new FormData(refForm);
    var payload = {};
    formData.forEach(function(value, key){ payload[key] = value; });

    refSubmitBtn.disabled = true;
    refStatus.textContent = 'Envoi en cours…';
    refStatus.className = 'ref-status';

    fetch('https://formsubmit.co/ajax/' + FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(function(res){ return res.json().then(function(data){ return { ok: res.ok, data: data }; }); })
    .then(function(result){
      if(result.ok){
        refStatus.textContent = 'Merci ! Votre candidature a bien été envoyée.';
        refStatus.className = 'ref-status ok';
        refForm.reset();
        setTimeout(closeRefModal, 1800);
      } else {
        throw new Error('submit failed');
      }
    })
    .catch(function(){
      refStatus.textContent = "Une erreur est survenue lors de l'envoi. Réessayez dans un instant.";
      refStatus.className = 'ref-status err';
    })
    .finally(function(){ refSubmitBtn.disabled = false; });
  });

  applyFilters();
})();
