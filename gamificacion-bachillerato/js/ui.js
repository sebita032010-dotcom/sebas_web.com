// Capa de presentación: solo toca el DOM, no contiene reglas del juego.
import { CAREERS, COURSES, LETTERS, OPTIONS } from './config.js';
const $ = (id) => document.getElementById(id);

export const showScreen = (id) =>
  ['register', 'lobby', 'game', 'end', 'hall'].forEach((s) => $(s).classList.toggle('hide', s !== id));

export function toggleTheme() {
  const r = document.documentElement;
  const dark = r.dataset.theme === 'dark' || (!r.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
  r.dataset.theme = dark ? 'light' : 'dark';
}
export const setContinueEnabled = (ok) => ($('toLobby').disabled = !ok);

function pills(el, items, current, onSelect) {
  el.innerHTML = '';
  items.forEach(([value, label]) => {
    const b = document.createElement('button');
    b.className = 'pill' + (String(current()) === String(value) ? ' on' : '');
    b.textContent = label;
    b.onclick = () => { onSelect(value); pills(el, items, current, onSelect); };
    el.appendChild(b);
  });
}
const defaultName = (reg, i) => reg.nt === 1 ? 'Jugador' : `Equipo ${i + 1}`;
export const getNames = (reg) =>
  Array.from({ length: reg.nt }, (_, i) => (reg.names[i] || '').trim() || defaultName(reg, i));

function buildNames(reg) {
  $('names').innerHTML = '';
  for (let i = 0; i < reg.nt; i++) {
    const inp = document.createElement('input');
    inp.type = 'text'; inp.maxLength = 24; inp.autocomplete = 'off';
    inp.placeholder = reg.nt === 1 ? 'Nombre del estudiante' : `Nombre del equipo ${i + 1}`;
    inp.value = reg.names[i] || '';
    inp.oninput = () => { reg.names[i] = inp.value; };
    $('names').appendChild(inp);
  }
}
export function buildRegister(reg, onChange) {
  $('careers').innerHTML = '';
  Object.entries(CAREERS).forEach(([key, c]) => {
    const b = document.createElement('button');
    b.className = 'card' + (reg.car === key ? ' on' : '');
    b.innerHTML = `<span class="em">${c.emoji}</span><b>${c.name}</b><small>${c.desc}</small>`;
    b.onclick = () => {
      reg.car = key; onChange();
      document.querySelectorAll('#careers .card').forEach((x) => x.classList.remove('on'));
      b.classList.add('on');
    };
    $('careers').appendChild(b);
  });
  pills($('courses'), Object.entries(COURSES), () => reg.cur, (v) => { reg.cur = v; onChange(); });
  pills($('teamsel'), [[1, '🙋 Individual'], [2, '2 equipos'], [3, '3 equipos'], [4, '4 equipos']],
    () => reg.nt, (v) => { reg.nt = +v; buildNames(reg); onChange(); });
  buildNames(reg);
}
export function renderLobby(reg, cfg, onChange) {
  const c = CAREERS[reg.car];
  $('sum').innerHTML = `
   <div class="box"><small>Carrera</small><b>${c.emoji} ${c.name}</b></div>
   <div class="box"><small>Curso</small><b>🎓 ${COURSES[reg.cur]}</b></div>
   <div class="box"><small>${reg.nt === 1 ? 'Jugador' : 'Equipos'}</small><ul></ul></div>`;
  getNames(reg).forEach((n) => {
    const li = document.createElement('li'); li.textContent = n;   // textContent: seguro
    $('sum').querySelector('ul').appendChild(li);
  });
  pills($('roundsel'), OPTIONS.rounds.map((v) => [v, v + ' preguntas']), () => cfg.rounds, (v) => { cfg.rounds = +v; onChange(); });
  pills($('timesel'), OPTIONS.time.map((v) => [v, v + ' s']), () => cfg.time, (v) => { cfg.time = +v; onChange(); });
}

function renderTeams(game) {
  $('teams').innerHTML = game.teams.map((t, i) =>
    `<div class="team ${i === game.turn ? 'turn' : ''}">${i === game.turn && game.teams.length > 1 ? '👉 ' : ''}${t.name}: <b>${t.score}</b> pts${t.streak > 1 ? ' 🔥x' + t.streak : ''}</div>`).join('');
}
export function renderQuestion(game, sel, onPick) {
  $('ctx').textContent = `${CAREERS[sel.car].emoji} ${CAREERS[sel.car].name} · ${COURSES[sel.cur]}`;
  $('prog').textContent = `Pregunta ${game.index + 1} / ${game.total}`;
  $('qtxt').textContent = game.question.text;
  $('fb').textContent = ''; $('fb').className = 'fb';
  $('next').classList.add('hide');
  $('opts').innerHTML = '';
  game.question.options.forEach((text, i) => {
    const b = document.createElement('button');
    b.className = 'opt';
    b.innerHTML = `<span class="k">${LETTERS[i]}</span><span></span>`;
    b.lastChild.textContent = text;   // textContent: evita inyectar HTML
    b.onclick = () => onPick(i);
    $('opts').appendChild(b);
  });
  renderTeams(game);
}
export function setTimer(left, total, instant = false) {
  const bar = $('tbar');
  bar.style.transition = instant ? 'none' : 'width 1s linear';
  bar.style.width = (left / total * 100) + '%';
  bar.classList.toggle('low', left <= 8);
}
export function renderResult(game, choice, r) {
  [...$('opts').children].forEach((b, k) =>
    b.classList.add(k === r.correct ? 'right' : k === choice ? 'wrong' : 'fade'));
  const fb = $('fb');
  fb.textContent = r.right ? `✅ ¡Correcto! +${r.points} puntos`
    : `${r.timedOut ? '⏰ ¡Se acabó el tiempo! ' : '❌ Casi. '}Respuesta: ${LETTERS[r.correct]}`;
  fb.className = 'fb pop ' + (r.right ? 'ok' : 'bad');
  renderTeams(game);
  $('next').textContent = game.isLast ? 'Ver resultados 🏆' : 'Siguiente ▶';
  $('next').classList.remove('hide');
}
export function renderEnd(game, sel) {
  showScreen('end');
  $('endctx').textContent = `${CAREERS[sel.car].name} · ${COURSES[sel.cur]}`;
  const medals = ['🥇', '🥈', '🥉', '🎖️'];
  $('rank').innerHTML = game.ranking().map((t, i) =>
    `<li><span>${medals[i]} ${t.name}</span><span>${t.score} pts · ${t.correct}/${t.played}</span></li>`).join('');
  $('badges').innerHTML = game.badges().map((b) => `<span class="badge">${b}</span>`).join('')
    + `<p class="sub">Acierto total: ${Math.round(game.accuracy() * 100)}%</p>`;
}

const MEDALS = ['🥇', '🥈', '🥉'];
function fillRank(ol, rows) {
  ol.innerHTML = '';
  if (!rows.length) { ol.innerHTML = '<li><span>Aún no hay puntajes. ¡Sé el primero!</span></li>'; return; }
  rows.forEach((r, i) => {
    const li = document.createElement('li'), a = document.createElement('span'), b = document.createElement('span');
    a.textContent = `${MEDALS[i] || (i + 1) + '.'} ${r.name}`;          // textContent: nombres escritos por usuarios
    const sm = document.createElement('small');
    sm.textContent = `${CAREERS[r.car]?.name || ''} · ${COURSES[r.cur] || ''} · ${new Date(r.date).toLocaleDateString('es')}`;
    a.appendChild(sm); b.textContent = `${r.score} pts`;
    li.append(a, b); ol.appendChild(li);
  });
}
export function renderRecord({ isRecord, best, prev, rows }) {
  $('record').textContent = isRecord
    ? `🎉 ¡Nuevo récord del curso! ${best.name}: ${best.score} pts`
    : `👑 Récord del curso: ${prev.name} con ${prev.score} pts`;
  fillRank($('top'), rows.slice(0, 5));
}
export function buildHall(f, onChange) {
  pills($('hcar'), [['', 'Todas'], ...Object.entries(CAREERS).map(([k, c]) => [k, c.emoji + ' ' + c.name])], () => f.car, (v) => { f.car = v; onChange(); });
  pills($('hcur'), [['', 'Todos'], ...Object.entries(COURSES)], () => f.cur, (v) => { f.cur = v; onChange(); });
}
export function renderHall(rows) {
  $('champ').textContent = rows.length ? `👑 Campeón: ${rows[0].name} con ${rows[0].score} pts` : '';
  fillRank($('hrank'), rows);
}
