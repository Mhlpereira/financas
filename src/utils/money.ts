export type Cents = number;

const MAX_CENTS = 9_999_999_999;

export function formatMoney(cents: Cents, opts: { sign?: boolean } = {}): string {
  const negative = cents < 0;
  const abs = Math.abs(cents);
  const reais = Math.floor(abs / 100);
  const centavos = abs % 100;

  const withThousands = String(reais).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const body = `R$ ${withThousands},${String(centavos).padStart(2, '0')}`;

  if (negative) return `- ${body}`;
  if (opts.sign) return `+ ${body}`;
  return body;
}

export function formatAmount(cents: Cents): string {
  return formatMoney(cents).replace('R$ ', '');
}

export function formatMoneyCompact(cents: Cents): string {
  const abs = Math.abs(cents);
  const prefix = cents < 0 ? '- ' : '';
  if (abs >= 100_000_000) {
    return `${prefix}R$ ${(abs / 100_000_000).toFixed(1).replace('.', ',')} mi`;
  }
  if (abs >= 100_000) {
    return `${prefix}R$ ${(abs / 100_000).toFixed(1).replace('.', ',')} mil`;
  }
  return formatMoney(cents);
}

export function appendDigit(cents: Cents, digit: string): Cents {
  const value = Number(digit);
  if (!Number.isInteger(value) || value < 0 || value > 9) return cents;
  const next = cents * 10 + value;
  return next > MAX_CENTS ? cents : next;
}

export function removeDigit(cents: Cents): Cents {
  return Math.floor(cents / 10);
}

export function parseMoney(input: string): Cents {
  const cleaned = input.replace(/[^\d,.-]/g, '').trim();
  if (!cleaned) return 0;

  const negative = cleaned.startsWith('-');
  let body = negative ? cleaned.slice(1) : cleaned;

  const hasDecimalComma = body.includes(',');
  const hasDecimalDot = /\.\d{1,2}$/.test(body);

  if (hasDecimalComma) {
    body = body.replace(/\./g, '').replace(',', '.');
  } else if (!hasDecimalDot) {
    body = body.replace(/\./g, '');
  }

  const value = Number(body);
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 100) * (negative ? -1 : 1);
}

export function splitInstallments(total: Cents, count: number): Cents[] {
  if (count < 1) return [];
  const base = Math.floor(total / count);
  const remainder = total - base * count;
  return Array.from({ length: count }, (_, i) => (i === 0 ? base + remainder : base));
}

export function installmentOf(total: Cents, count: number): Cents {
  if (count < 1) return total;
  return Math.round(total / count);
}

export function totalOf(installment: Cents, count: number): Cents {
  return installment * Math.max(count, 1);
}
