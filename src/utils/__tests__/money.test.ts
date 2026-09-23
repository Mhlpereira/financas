import {
  appendDigit,
  formatMoney,
  formatMoneyCompact,
  installmentOf,
  parseMoney,
  removeDigit,
  splitInstallments,
  totalOf,
} from '../money';

describe('formatMoney', () => {
  it('formata no padrão brasileiro', () => {
    expect(formatMoney(32_000)).toBe('R$ 320,00');
    expect(formatMoney(123_456)).toBe('R$ 1.234,56');
    expect(formatMoney(0)).toBe('R$ 0,00');
  });

  it('separa milhares corretamente em valores grandes', () => {
    expect(formatMoney(123_456_789)).toBe('R$ 1.234.567,89');
  });

  it('mostra o sinal quando pedido', () => {
    expect(formatMoney(-32_000)).toBe('- R$ 320,00');
    expect(formatMoney(32_000, { sign: true })).toBe('+ R$ 320,00');
  });

  it('preserva centavos com zero à esquerda', () => {
    expect(formatMoney(105)).toBe('R$ 1,05');
  });
});

describe('formatMoneyCompact', () => {
  it('abrevia milhares e milhões', () => {
    expect(formatMoneyCompact(284_000)).toBe('R$ 2,8 mil');
    expect(formatMoneyCompact(250_000_000)).toBe('R$ 2,5 mi');
  });

  it('mostra valores pequenos por extenso', () => {
    expect(formatMoneyCompact(5_000)).toBe('R$ 50,00');
  });
});

describe('appendDigit e removeDigit', () => {
  it('monta o valor da direita para a esquerda', () => {
    let value = 0;
    for (const digit of '32000') value = appendDigit(value, digit);
    expect(value).toBe(32_000);
    expect(formatMoney(value)).toBe('R$ 320,00');
  });

  it('apaga o último dígito', () => {
    expect(removeDigit(32_000)).toBe(3_200);
    expect(removeDigit(0)).toBe(0);
  });

  it('ignora entrada que não é dígito', () => {
    expect(appendDigit(100, 'a')).toBe(100);
  });

  it('respeita o teto de valor', () => {
    expect(appendDigit(9_999_999_999, '9')).toBe(9_999_999_999);
  });
});

describe('parseMoney', () => {
  it('lê o padrão brasileiro', () => {
    expect(parseMoney('1.234,56')).toBe(123_456);
    expect(parseMoney('R$ 320,00')).toBe(32_000);
  });

  it('lê ponto decimal', () => {
    expect(parseMoney('1234.56')).toBe(123_456);
  });

  it('lê inteiro sem separador', () => {
    expect(parseMoney('1234')).toBe(123_400);
  });

  it('devolve zero para texto vazio', () => {
    expect(parseMoney('')).toBe(0);
    expect(parseMoney('abc')).toBe(0);
  });
});

describe('parcelamento', () => {
  it('divide sem perder centavo', () => {
    const parts = splitInstallments(10_000, 3);
    expect(parts).toEqual([3_334, 3_333, 3_333]);
    expect(parts.reduce((a, b) => a + b, 0)).toBe(10_000);
  });

  it('divide exato quando dá', () => {
    expect(splitInstallments(30_000, 3)).toEqual([10_000, 10_000, 10_000]);
  });

  it('converte entre total e parcela', () => {
    expect(installmentOf(320_000, 10)).toBe(32_000);
    expect(totalOf(32_000, 10)).toBe(320_000);
  });
});
