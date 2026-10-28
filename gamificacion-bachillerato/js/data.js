// Capa de datos: carga el banco y selecciona preguntas. Sin DOM.
export async function loadBank(url = 'data/questions.json') {
  const res = await fetch(url);
  if (!res.ok) throw new Error('No se pudo cargar ' + url);
  return res.json(); // { carrera: { curso: [[pregunta, [a,b,c,d], idxCorrecta]] } }
}
export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export function pickQuestions(bank, career, course, n) {
  return shuffle(bank[career][course]).slice(0, n)
    .map(([text, options, correct]) => ({ text, options, correct }));
}
