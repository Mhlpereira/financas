import {
  addMonths,
  clampDay,
  competenceOf,
  daysInMonth,
  dueDateIn,
  formatDayHeader,
  formatMonthLong,
  formatMonthSlash,
  monthsBetween,
} from '../date';

describe('daysInMonth', () => {
  it('conhece o tamanho de cada mês', () => {
    expect(daysInMonth(2026, 1)).toBe(31);
    expect(daysInMonth(2026, 2)).toBe(28);
    expect(daysInMonth(2026, 4)).toBe(30);
  });

  it('reconhece ano bissexto', () => {
    expect(daysInMonth(2028, 2)).toBe(29);
    expect(daysInMonth(2100, 2)).toBe(28);
  });
});

describe('clampDay', () => {
  it('encaixa o dia 31 no último dia do mês', () => {
    expect(clampDay(2026, 2, 31)).toBe(28);
    expect(clampDay(2028, 2, 31)).toBe(29);
    expect(clampDay(2026, 4, 31)).toBe(30);
  });

  it('deixa dias válidos intactos', () => {
    expect(clampDay(2026, 3, 15)).toBe(15);
    expect(clampDay(2026, 1, 31)).toBe(31);
  });

  it('nunca devolve menos que 1', () => {
    expect(clampDay(2026, 3, 0)).toBe(1);
  });
});

describe('addMonths', () => {
  it('anda dentro do mesmo ano', () => {
    expect(addMonths('2026-03', 2)).toBe('2026-05');
  });

  it('vira o ano para frente', () => {
    expect(addMonths('2026-11', 3)).toBe('2027-02');
  });

  it('vira o ano para trás', () => {
    expect(addMonths('2026-02', -3)).toBe('2025-11');
  });

  it('anda vários anos', () => {
    expect(addMonths('2026-01', 36)).toBe('2029-01');
  });
});

describe('monthsBetween', () => {
  it('conta meses para frente', () => {
    expect(monthsBetween('2026-01', '2026-12')).toBe(11);
  });

  it('conta meses atravessando o ano', () => {
    expect(monthsBetween('2026-11', '2027-02')).toBe(3);
  });

  it('devolve negativo quando a ordem inverte', () => {
    expect(monthsBetween('2026-05', '2026-02')).toBe(-3);
  });
});

describe('competenceOf e dueDateIn', () => {
  it('extrai o mês de uma data', () => {
    expect(competenceOf('2026-09-15')).toBe('2026-09');
  });

  it('monta o vencimento com o dia ajustado', () => {
    expect(dueDateIn('2026-02', 31)).toBe('2026-02-28');
    expect(dueDateIn('2026-03', 5)).toBe('2026-03-05');
  });
});

describe('formatação', () => {
  it('escreve o mês por extenso', () => {
    expect(formatMonthLong('2026-09')).toBe('setembro 2026');
  });

  it('escreve o mês curto com barra', () => {
    expect(formatMonthSlash('2027-06')).toBe('jun/27');
  });

  it('usa hoje, amanhã e ontem no cabeçalho do dia', () => {
    expect(formatDayHeader('2026-09-15', '2026-09-15')).toBe('hoje');
    expect(formatDayHeader('2026-09-16', '2026-09-15')).toBe('amanhã');
    expect(formatDayHeader('2026-09-14', '2026-09-15')).toBe('ontem');
  });

  it('escreve dia da semana em datas distantes', () => {
    expect(formatDayHeader('2026-09-20', '2026-09-15')).toBe('dom, 20 de setembro');
  });
});
