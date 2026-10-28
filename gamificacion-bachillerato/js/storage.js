// Persistencia de puntajes en el navegador (localStorage). Sin DOM.
const KEY = 'arena-puntajes';
export const loadScores = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
export function addScores(list) {
  try { localStorage.setItem(KEY, JSON.stringify(loadScores().concat(list))); } catch {}
}
// car/cur vacíos = todos. Orden: mayor puntaje; en empate, el más reciente.
export function top(car = '', cur = '', n = 10) {
  return loadScores()
    .filter((s) => (!car || s.car === car) && (!cur || String(s.cur) === String(cur)))
    .sort((a, b) => b.score - a.score || b.date - a.date)
    .slice(0, n);
}
export const clearScores = () => { try { localStorage.removeItem(KEY); } catch {} };
