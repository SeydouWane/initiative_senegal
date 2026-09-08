(function(){
  /* ---- Thème (clair / sombre / système) ---- */
  var THEME_KEY = 'ct-theme';
  var themeBtn = document.getElementById('themeToggle');

  function applyTheme(mode){
    if(mode === 'light' || mode === 'dark'){
      document.documentElement.setAttribute('data-theme', mode);
    } else {
      document.documentElement.removeAttribute('data-theme');
      mode = 'system';
    }
    if(themeBtn){
      themeBtn.dataset.mode = mode;
      var label = mode === 'light' ? 'clair' : (mode === 'dark' ? 'sombre' : 'système');
      themeBtn.setAttribute('aria-label', 'Thème actuel : ' + label + ' — cliquer pour changer');
    }
  }

  var storedTheme = 'system';
  try { storedTheme = localStorage.getItem(THEME_KEY) || 'system'; } catch(e){}
  applyTheme(storedTheme);

  if(themeBtn){
    themeBtn.addEventListener('click', function(){
      var order = ['light', 'dark', 'system'];
      var current = themeBtn.dataset.mode || 'system';
      var next = order[(order.indexOf(current) + 1) % order.length];
      try { localStorage.setItem(THEME_KEY, next); } catch(e){}
      applyTheme(next);
    });
  }

  /* ---- Visite guidée ---- */
  var steps = [
    { selector: '#accueil', title: 'Bienvenue sur Communes Transparentes', text: "Ceci est le manifeste de l'initiative : la transparence communale n'est pas une faveur, c'est un droit inscrit dans la loi." },
    { selector: '#carte', title: 'La carte citoyenne', text: '553 communes réparties dans 46 départements. Cliquez un point pour filtrer sur un département, ou utilisez la recherche et les filtres région/statut.' },
    { selector: '#demarche', title: 'Nos quatre principes', text: 'Informer, participer, contrôler, améliorer : la même méthode appliquée à chaque commune, sans parti pris.' },
    { selector: '#droits', title: 'Vos droits', text: "Le mode d'emploi concret pour exercer votre droit d'accès à l'information, étape par étape." },
    { selector: '#participer', title: 'Devenez référent', text: 'Rejoignez le réseau et accompagnez les citoyens de votre commune dans leurs démarches.' },
    { selector: '#ressources', title: 'Ressources pratiques', text: "Modèle de lettre, guide de lecture d'un budget, guide de lecture d'un procès-verbal — prêts à l'emploi." }
  ];

  var guidePanel = document.getElementById('guidePanel');
  var guideStepCount = document.getElementById('guideStepCount');
  var guideTitle = document.getElementById('guideTitle');
  var guideText = document.getElementById('guideText');
  var guidePrev = document.getElementById('guidePrev');
  var guideNext = document.getElementById('guideNext');
  var guideSkip = document.getElementById('guideSkip');
  var guideClose = document.getElementById('guideClose');
  var guideStart = document.getElementById('guideStart');

  var currentIndex = -1;
  var currentTarget = null;

  function clearHighlight(){
    if(currentTarget){ currentTarget.classList.remove('guide-highlight'); }
  }

  function renderStep(){
    var step = steps[currentIndex];
    clearHighlight();
    currentTarget = document.querySelector(step.selector);
    if(currentTarget){
      currentTarget.classList.add('guide-highlight');
      currentTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    guideStepCount.textContent = (currentIndex + 1) + '/' + steps.length;
    guideTitle.textContent = step.title;
    guideText.textContent = step.text;
    guidePrev.disabled = currentIndex === 0;
    guideNext.textContent = currentIndex === steps.length - 1 ? 'Terminer' : 'Suivant';
  }

  function openGuide(){
    currentIndex = 0;
    guidePanel.hidden = false;
    renderStep();
  }

  function closeGuide(){
    clearHighlight();
    currentTarget = null;
    currentIndex = -1;
    guidePanel.hidden = true;
  }

  if(guideStart) guideStart.addEventListener('click', openGuide);
  if(guideClose) guideClose.addEventListener('click', closeGuide);
  if(guideSkip) guideSkip.addEventListener('click', closeGuide);

  if(guideNext) guideNext.addEventListener('click', function(){
    if(currentIndex >= steps.length - 1){ closeGuide(); return; }
    currentIndex++;
    renderStep();
  });
  if(guidePrev) guidePrev.addEventListener('click', function(){
    if(currentIndex <= 0) return;
    currentIndex--;
    renderStep();
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && guidePanel && !guidePanel.hidden){ closeGuide(); }
  });
})();
