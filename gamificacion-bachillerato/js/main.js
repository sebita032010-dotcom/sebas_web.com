// Controlador: conecta datos + lógica + interfaz. Flujo: registro → sala → juego → resultados.
import { RULES, LETTERS } from './config.js';
import { loadBank, pickQuestions } from './data.js';
import { Game } from './game.js';
import * as ui from './ui.js';
import { addScores, top, clearScores } from './storage.js';

const $ = (id) => document.getElementById(id);
const KEY = 'arena-registro';
const reg = { car: null, cur: null, nt: 1, names: [] };
const cfg = { rounds: RULES.rounds, time: RULES.time };
const hall = { car: '', cur: '' };
let bank, game, timer, left;

const save = () => { try { localStorage.setItem(KEY, JSON.stringify(reg)); } catch {} };
const restore = () => { try { Object.assign(reg, JSON.parse(localStorage.getItem(KEY)) || {}); } catch {} };
const ready = () => !!(reg.car && reg.cur);

async function init() {
  try { bank = await loadBank(); }
  catch (e) { alert('Abre el proyecto con un servidor (Live Server). ' + e.message); return; }
  restore();
  ui.buildRegister(reg, () => ui.setContinueEnabled(ready()));
  ui.setContinueEnabled(ready());
  $('toLobby').onclick = toLobby;
  $('toHall').onclick = openHall;
  $('hback').onclick = () => ui.showScreen('register');
  $('hclear').onclick = () => { if (confirm('¿Borrar todos los puntajes guardados?')) { clearScores(); refreshHall(); } };
  $('back').onclick = () => ui.showScreen('register');
  $('start').onclick = start;
  $('again').onclick = start;
  $('menu').onclick = () => ui.showScreen('register');
  $('next').onclick = next;
  $('theme').onclick = ui.toggleTheme;
  addEventListener('keydown', onKey);
}
function toLobby() {
  save();
  ui.renderLobby(reg, cfg, () => {});
  ui.showScreen('lobby');
}
function start() {
  game = new Game(pickQuestions(bank, reg.car, reg.cur, cfg.rounds), ui.getNames(reg));
  ui.showScreen('game');
  ask();
}
function ask() {
  left = cfg.time;
  ui.renderQuestion(game, reg, onPick);
  ui.setTimer(left, cfg.time, true);
  clearInterval(timer);
  timer = setInterval(() => {
    left--; ui.setTimer(left, cfg.time);
    if (left <= 0) onPick(-1);
  }, 1000);
}
function onPick(choice) {
  if (game.locked) return;
  clearInterval(timer);
  ui.renderResult(game, choice, game.answer(choice, left));
}
function next() {
  if (!game.locked) return;
  if (game.isLast) return finish();
  game.next(); ask();
}
function finish() {
  const prev = top(reg.car, reg.cur, 1)[0];
  const date = Date.now();
  addScores(game.teams.map((t) => ({ name: t.name, score: t.score, correct: t.correct, played: t.played, car: reg.car, cur: String(reg.cur), date })));
  const best = game.ranking()[0];
  ui.renderEnd(game, reg);
  ui.renderRecord({ isRecord: best.score > 0 && (!prev || best.score > prev.score), best, prev, rows: top(reg.car, reg.cur, 5) });
}
function refreshHall() { ui.renderHall(top(hall.car, hall.cur, 10)); }
function openHall() {
  hall.car = reg.car || ''; hall.cur = reg.cur ? String(reg.cur) : '';
  ui.buildHall(hall, refreshHall); refreshHall(); ui.showScreen('hall');
}
function onKey(e) {
  if ($('game').classList.contains('hide')) return;
  const k = e.key.toUpperCase();
  const i = '1234'.includes(k) && k.length === 1 ? '1234'.indexOf(k) : LETTERS.indexOf(k);
  if (i >= 0 && !game.locked) onPick(i);
  else if ((e.key === ' ' || e.key === 'Enter') && game.locked) { e.preventDefault(); next(); }
}
init();
