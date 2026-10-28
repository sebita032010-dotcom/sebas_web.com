// Configuración editable: carreras, cursos y reglas del juego.
export const CAREERS = {
  conta: { emoji: '💼', name: 'Contabilidad y Finanzas', desc: 'Economía, negocios, gestión' },
  info:  { emoji: '💻', name: 'Informática',             desc: 'Programación, redes, datos' },
  salud: { emoji: '🧬', name: 'Ciencias de la Salud',    desc: 'Biología, medicina, nutrición' },
  ing:   { emoji: '⚡', name: 'Electricidad y Mecánica', desc: 'Circuitos, energía, máquinas' },
  exact: { emoji: '🧪', name: 'Ciencias Exactas',        desc: 'Matemáticas, química, física' },
  soc:   { emoji: '📚', name: 'Ciencias Sociales',       desc: 'Historia, derecho, psicología' },
};
export const COURSES = { 1: '1.º Bachillerato', 2: '2.º Bachillerato', 3: '3.º Bachillerato' };
export const RULES = { rounds: 10, time: 30, basePoints: 100, timeBonus: 3, streakBonus: 25, maxStreak: 5 };
export const LETTERS = ['A', 'B', 'C', 'D'];
export const OPTIONS = { rounds: [5, 10, 15], time: [20, 30, 45] };
