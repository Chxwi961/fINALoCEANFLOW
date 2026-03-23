const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
}

const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));

const systemData = {
  intake: {
    title: 'Seawater intake',
    body: 'Ocean water is brought into the system from a coastal source so it can help absorb and move heat more efficiently.',
    note: 'Main idea: use location as an infrastructure advantage.'
  },
  filter: {
    title: 'Filtration layer',
    body: 'Before the water reaches the heat-exchange stage, filtration helps reduce sand, sediment, and other particulates that can damage equipment.',
    note: 'Main idea: protect the system before the water does the work.'
  },
  exchange: {
    title: 'Heat exchanger',
    body: 'A corrosion-resistant exchanger transfers heat out of the internal cooling loop without letting seawater touch sensitive compute equipment directly.',
    note: 'Main idea: strong cooling, protected hardware.'
  },
  loop: {
    title: 'Internal data center loop',
    body: 'The server-side loop benefits from stronger heat rejection support, which can help stabilize high-density AI operations.',
    note: 'Main idea: the compute side stays isolated and cooler.'
  },
  return: {
    title: 'Return and control',
    body: 'Water is then managed responsibly through controlled return, recirculation, or discharge design depending on environmental requirements.',
    note: 'Main idea: cooling has to work and still respect safeguards.'
  }
};

const systemButtons = document.querySelectorAll('.sys-btn');
const systemCopy = document.getElementById('systemCopy');
const systemNodes = document.querySelectorAll('.visual-node');
if (systemButtons.length && systemCopy) {
  systemButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.system;
      systemButtons.forEach(b => b.classList.toggle('active', b === btn));
      systemNodes.forEach(node => node.classList.toggle('active', node.dataset.system === key));
      systemCopy.innerHTML = `
        <h3>${systemData[key].title}</h3>
        <p>${systemData[key].body}</p>
        <p class="muted">${systemData[key].note}</p>
      `;
    });
  });
}

const facilitySize = document.getElementById('facilitySize');
const waterStress = document.getElementById('waterStress');
const coolingShift = document.getElementById('coolingShift');

if (facilitySize && waterStress && coolingShift) {
  const refs = {
    facilitySizeValue: document.getElementById('facilitySizeValue'),
    waterStressValue: document.getElementById('waterStressValue'),
    coolingShiftValue: document.getElementById('coolingShiftValue'),
    waterRelief: document.getElementById('waterRelief'),
    coolingAdvantage: document.getElementById('coolingAdvantage'),
    takeawayText: document.getElementById('takeawayText'),
    scenarioTitle: document.getElementById('scenarioTitle'),
    scenarioBadge: document.getElementById('scenarioBadge'),
    resultExplainer: document.getElementById('resultExplainer'),
    chart: document.getElementById('impactChart')
  };

  const stressWords = ['Low', 'Moderate', 'Medium', 'High', 'Very high'];

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  function getScenario(size) {
    if (size <= 50) return 'Smaller coastal AI facility';
    if (size <= 110) return 'Medium coastal AI facility';
    return 'Large coastal AI facility';
  }

  function getBadge(score) {
    if (score < 40) return 'Early-stage value';
    if (score < 65) return 'Balanced deployment';
    return 'High-impact deployment';
  }

  function drawChart(traditional, oceanflow, labels) {
    const canvas = refs.chart;
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.clientWidth || 900;
    const cssHeight = 360;
    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    canvas.style.height = cssHeight + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    const pad = { top: 24, right: 24, bottom: 56, left: 52 };
    const w = cssWidth - pad.left - pad.right;
    const h = cssHeight - pad.top - pad.bottom;
    const max = 100;

    ctx.strokeStyle = 'rgba(255,255,255,0.10)';
    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(163,187,214,0.85)';
    ctx.font = '12px Inter';
    for (let i = 0; i <= 5; i++) {
      const y = pad.top + (h / 5) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + w, y);
      ctx.stroke();
      const val = Math.round(max - (max / 5) * i);
      ctx.fillText(String(val), 14, y + 4);
    }

    const groups = labels.length;
    const groupWidth = w / groups;
    const barWidth = Math.min(46, groupWidth * 0.22);

    labels.forEach((label, i) => {
      const groupX = pad.left + groupWidth * i + groupWidth / 2;
      const tVal = traditional[i];
      const oVal = oceanflow[i];
      const tHeight = (tVal / max) * h;
      const oHeight = (oVal / max) * h;

      ctx.fillStyle = 'rgba(156, 179, 202, 0.55)';
      ctx.fillRect(groupX - barWidth - 8, pad.top + h - tHeight, barWidth, tHeight);

      const grad = ctx.createLinearGradient(0, pad.top + h - oHeight, 0, pad.top + h);
      grad.addColorStop(0, 'rgba(93,242,227,0.95)');
      grad.addColorStop(1, 'rgba(58,184,255,0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(groupX + 8, pad.top + h - oHeight, barWidth, oHeight);

      ctx.fillStyle = '#dfeeff';
      ctx.font = '600 12px Inter';
      ctx.fillText(label, groupX - 34, cssHeight - 18);
    });

    ctx.fillStyle = '#dfeeff';
    ctx.font = '600 12px Inter';
    ctx.fillText('Traditional', pad.left, cssHeight - 40);
    ctx.fillStyle = '#7cd6ff';
    ctx.fillText('OceanFlow scenario', pad.left + 90, cssHeight - 40);
  }

  function updateImpact() {
    const size = Number(facilitySize.value);
    const stress = Number(waterStress.value);
    const shift = Number(coolingShift.value);

    refs.facilitySizeValue.textContent = `${size} MW`;
    refs.waterStressValue.textContent = stressWords[stress - 1];
    refs.coolingShiftValue.textContent = `${shift}%`;

    const waterRelief = clamp(Math.round(18 + stress * 9 + shift * 0.35 + size * 0.08), 18, 92);
    const coolingAdvantage = clamp(Math.round(10 + shift * 0.33 + size * 0.11 - 6 + stress * 2), 12, 88);
    const overallScore = Math.round((waterRelief + coolingAdvantage) / 2);

    refs.waterRelief.textContent = `${waterRelief}%`;
    refs.coolingAdvantage.textContent = `${coolingAdvantage}%`;
    refs.scenarioTitle.textContent = getScenario(size);
    refs.scenarioBadge.textContent = getBadge(overallScore);

    let takeaway = "OceanFlow's cooling advantages scale with your data center.";
  
    refs.takeawayText.textContent = takeaway;

    refs.resultExplainer.textContent = `With a ${size} MW facility, ${stressWords[stress - 1].toLowerCase()} freshwater stress, and ${shift}% of cooling shifted toward OceanFlow support, the model shows a ${waterRelief}% freshwater-pressure relief effect and a ${coolingAdvantage}% cooling advantage effect.`;

    const traditional = [clamp(70 + stress * 5, 30, 95), clamp(68 + size * 0.06, 35, 95), clamp(72 - shift * 0.25, 22, 92)];
    const oceanflow = [clamp(100 - waterRelief + 16, 10, 95), clamp(100 - coolingAdvantage + 8, 10, 95), clamp(34 + shift * 0.48 + stress * 5, 20, 98)];
    drawChart(traditional, oceanflow, ['Water use', 'Heat load', 'Sustainability']);
  }

  ['input', 'change'].forEach(evt => {
    facilitySize.addEventListener(evt, updateImpact);
    waterStress.addEventListener(evt, updateImpact);
    coolingShift.addEventListener(evt, updateImpact);
  });
  window.addEventListener('resize', updateImpact);
  updateImpact();
}
