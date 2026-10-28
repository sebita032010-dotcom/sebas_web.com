// Lógica pura del juego (sin DOM): turnos, puntaje, rachas y ranking.
import { RULES } from './config.js';

export class Game {
  constructor(questions, names) {
    this.questions = questions;
    this.index = 0;
    this.turn = 0;
    this.locked = false;
    this.teams = names.map((name) => ({
      name,
      score: 0, streak: 0, correct: 0, played: 0,
    }));
  }
  get question() { return this.questions[this.index]; }
  get total() { return this.questions.length; }
  get isLast() { return this.index + 1 >= this.total; }
  get team() { return this.teams[this.turn]; }

  answer(choice, timeLeft) {
    this.locked = true;
    const t = this.team, q = this.question;
    const right = choice === q.correct;
    t.played++;
    let points = 0;
    if (right) {
      t.streak++; t.correct++;
      points = RULES.basePoints + Math.max(timeLeft, 0) * RULES.timeBonus
             + Math.min(t.streak - 1, RULES.maxStreak) * RULES.streakBonus;
      t.score += points;
    } else t.streak = 0;
    return { right, points, correct: q.correct, timedOut: choice < 0 };
  }
  next() {
    this.index++;
    this.turn = (this.turn + 1) % this.teams.length;
    this.locked = false;
  }
  ranking() { return this.teams.slice().sort((a, b) => b.score - a.score); }
  accuracy() { return this.teams.reduce((s, t) => s + t.correct, 0) / this.total; }
  badges() {
    const p = this.accuracy(), b = [];
    b.push(p >= .9 ? '🌟 Leyenda del saber' : p >= .7 ? '🚀 Experto/a' : p >= .5 ? '📈 Aprendiz en ascenso' : '💪 ¡A seguir practicando!');
    if (this.teams.some(t => t.correct >= 5)) b.push('🔥 Racha de fuego');
    return b;
  }
}
