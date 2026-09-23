export type Competence = string;
export type ISODate = string;

const MESES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
] as const;

const MESES_CURTOS = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
] as const;

const DIAS_SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'] as const;

const pad = (n: number) => String(n).padStart(2, '0');

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function clampDay(year: number, month: number, day: number): number {
  const max = daysInMonth(year, month);
  if (day < 1) return 1;
  return day > max ? max : day;
}

export function parseCompetence(competence: Competence): { year: number; month: number } {
  return {
    year: Number(competence.slice(0, 4)),
    month: Number(competence.slice(5, 7)),
  };
}

export function makeCompetence(year: number, month: number): Competence {
  return `${year}-${pad(month)}`;
}

export function parseISODate(iso: ISODate): { year: number; month: number; day: number } {
  return {
    year: Number(iso.slice(0, 4)),
    month: Number(iso.slice(5, 7)),
    day: Number(iso.slice(8, 10)),
  };
}

export function makeISODate(year: number, month: number, day: number): ISODate {
  return `${year}-${pad(month)}-${pad(day)}`;
}

export function competenceOf(iso: ISODate): Competence {
  return iso.slice(0, 7);
}

export function addMonths(competence: Competence, n: number): Competence {
  const { year, month } = parseCompetence(competence);
  const absoluteMonths = year * 12 + (month - 1) + n;
  return makeCompetence(Math.floor(absoluteMonths / 12), (absoluteMonths % 12) + 1);
}

export function monthsBetween(from: Competence, to: Competence): number {
  const a = parseCompetence(from);
  const b = parseCompetence(to);
  return (b.year - a.year) * 12 + (b.month - a.month);
}

export function dueDateIn(competence: Competence, day: number): ISODate {
  const { year, month } = parseCompetence(competence);
  return makeISODate(year, month, clampDay(year, month, day));
}

export function compareCompetence(a: Competence, b: Competence): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function minCompetence(a: Competence, b: Competence): Competence {
  return a <= b ? a : b;
}

export function todayISO(now: Date = new Date()): ISODate {
  return makeISODate(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function currentCompetence(now: Date = new Date()): Competence {
  return makeCompetence(now.getFullYear(), now.getMonth() + 1);
}

export function formatMonthLong(competence: Competence): string {
  const { year, month } = parseCompetence(competence);
  return `${MESES[month - 1]} ${year}`;
}

export function formatMonthShort(competence: Competence): string {
  const { year, month } = parseCompetence(competence);
  return `${MESES_CURTOS[month - 1]} ${String(year).slice(2)}`;
}

export function formatMonthSlash(competence: Competence): string {
  const { year, month } = parseCompetence(competence);
  return `${MESES_CURTOS[month - 1]}/${String(year).slice(2)}`;
}

export function formatDateBR(iso: ISODate): string {
  const { year, month, day } = parseISODate(iso);
  return `${pad(day)}/${pad(month)}/${year}`;
}

function daysApart(a: ISODate, b: ISODate): number {
  const x = parseISODate(a);
  const y = parseISODate(b);
  return Math.round(
    (Date.UTC(x.year, x.month - 1, x.day) - Date.UTC(y.year, y.month - 1, y.day)) / 86_400_000,
  );
}

export function formatDayHeader(iso: ISODate, today: ISODate = todayISO()): string {
  if (iso === today) return 'hoje';

  const diff = daysApart(iso, today);
  if (diff === 1) return 'amanhã';
  if (diff === -1) return 'ontem';

  const { year, month, day } = parseISODate(iso);
  const weekday = DIAS_SEMANA[new Date(year, month - 1, day).getDay()];
  return `${weekday}, ${day} de ${MESES[month - 1]}`;
}

export function isPast(iso: ISODate, today: ISODate = todayISO()): boolean {
  return iso < today;
}
