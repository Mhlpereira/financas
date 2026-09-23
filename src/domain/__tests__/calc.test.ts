import { buildProjection, groupByDueDate, savingsRate, spentRatio, summarizeMonth } from '../calc';
import type { OccurrenceView } from '../types';

function view(overrides: Partial<OccurrenceView> = {}): OccurrenceView {
  return {
    id: 'o1',
    commitmentId: 'c1',
    profileId: 'p1',
    kind: 'expense',
    competence: '2026-09',
    dueDate: '2026-09-15',
    amount: 10_000,
    installmentIndex: null,
    status: 'pending',
    paidAt: null,
    isOverridden: false,
    description: 'Teste',
    commitmentType: 'single',
    installmentsTotal: null,
    categoryId: null,
    categoryName: null,
    categoryIcon: null,
    categoryColor: null,
    profileName: 'Pessoal',
    profileColor: '#6366F1',
    ...overrides,
  };
}

describe('summarizeMonth', () => {
  it('calcula saldo como entradas menos saídas', () => {
    const summary = summarizeMonth('2026-09', [
      view({ kind: 'income', amount: 800_000 }),
      view({ kind: 'expense', amount: 566_000 }),
    ]);

    expect(summary.incomePlanned).toBe(800_000);
    expect(summary.expensePlanned).toBe(566_000);
    expect(summary.balancePlanned).toBe(234_000);
  });

  it('conta só parcelas e recorrentes como comprometido', () => {
    const summary = summarizeMonth('2026-09', [
      view({ amount: 32_000, commitmentType: 'installment' }),
      view({ amount: 5_500, commitmentType: 'recurring' }),
      view({ amount: 17_990, commitmentType: 'single' }),
    ]);

    expect(summary.committed).toBe(37_500);
  });

  it('tira ocorrências puladas de todas as somas', () => {
    const summary = summarizeMonth('2026-09', [
      view({ kind: 'income', amount: 800_000 }),
      view({ kind: 'expense', amount: 10_000, status: 'skipped' }),
      view({ kind: 'expense', amount: 20_000 }),
    ]);

    expect(summary.expensePlanned).toBe(20_000);
    expect(summary.balancePlanned).toBe(780_000);
  });

  it('separa previsto de realizado', () => {
    const summary = summarizeMonth('2026-09', [
      view({ kind: 'income', amount: 800_000, status: 'paid' }),
      view({ kind: 'expense', amount: 30_000, status: 'paid' }),
      view({ kind: 'expense', amount: 20_000 }),
    ]);

    expect(summary.balancePlanned).toBe(750_000);
    expect(summary.balanceActual).toBe(770_000);
    expect(summary.toPay).toBe(20_000);
    expect(summary.toReceive).toBe(0);
  });

  it('calcula livre como receita menos comprometido', () => {
    const summary = summarizeMonth('2026-09', [
      view({ kind: 'income', amount: 800_000 }),
      view({ kind: 'expense', amount: 318_000, commitmentType: 'recurring' }),
      view({ kind: 'expense', amount: 50_000, commitmentType: 'single' }),
    ]);

    expect(summary.free).toBe(482_000);
  });
});

describe('spentRatio e savingsRate', () => {
  it('limita a razão de gasto em 1', () => {
    const summary = summarizeMonth('2026-09', [
      view({ kind: 'income', amount: 100_000 }),
      view({ kind: 'expense', amount: 300_000 }),
    ]);

    expect(spentRatio(summary)).toBe(1);
  });

  it('não calcula taxa de poupança sem receita', () => {
    const summary = summarizeMonth('2026-09', [view({ kind: 'expense', amount: 10_000 })]);

    expect(savingsRate(summary)).toBeNull();
  });

  it('calcula taxa de poupança com receita', () => {
    const summary = summarizeMonth('2026-09', [
      view({ kind: 'income', amount: 100_000 }),
      view({ kind: 'expense', amount: 75_000 }),
    ]);

    expect(savingsRate(summary)).toBeCloseTo(0.25);
  });
});

describe('buildProjection', () => {
  it('acumula o saldo mês a mês a partir do primeiro', () => {
    const projection = buildProjection('2026-09', 3, [
      { competence: '2026-09', income: 800_000, expense: 566_000 },
      { competence: '2026-10', income: 800_000, expense: 566_000 },
      { competence: '2026-11', income: 800_000, expense: 534_000 },
    ]);

    expect(projection[0].accumulated).toBe(234_000);
    expect(projection[1].accumulated).toBe(468_000);
    expect(projection[2].accumulated).toBe(734_000);
  });

  it('trata meses sem lançamento como zero', () => {
    const projection = buildProjection('2026-09', 3, [
      { competence: '2026-09', income: 100_000, expense: 0 },
    ]);

    expect(projection[1].balance).toBe(0);
    expect(projection[2].accumulated).toBe(100_000);
  });

  it('reduz o acumulado num mês negativo', () => {
    const projection = buildProjection('2026-09', 2, [
      { competence: '2026-09', income: 100_000, expense: 50_000 },
      { competence: '2026-10', income: 100_000, expense: 180_000 },
    ]);

    expect(projection[1].balance).toBe(-80_000);
    expect(projection[1].accumulated).toBe(-30_000);
  });
});

describe('groupByDueDate', () => {
  it('agrupa por dia em ordem de vencimento', () => {
    const groups = groupByDueDate([
      view({ id: 'a', dueDate: '2026-09-15' }),
      view({ id: 'b', dueDate: '2026-09-05' }),
      view({ id: 'c', dueDate: '2026-09-15' }),
    ]);

    expect(groups.map((group) => group.dueDate)).toEqual(['2026-09-05', '2026-09-15']);
    expect(groups[1].items).toHaveLength(2);
  });
});
