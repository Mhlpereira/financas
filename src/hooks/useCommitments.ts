import { useEffect, useState } from 'react';

import type { InstallmentPlan, RecurringPlan } from '@/domain/types';
import { listOpenInstallments, listRecurring } from '@/repositories/commitments';
import { useAppStore } from '@/stores/app';

export function useCommitments() {
  const scope = useAppStore((state) => state.scope);
  const revision = useAppStore((state) => state.revision);

  const [installments, setInstallments] = useState<InstallmentPlan[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<RecurringPlan[]>([]);
  const [fixedIncome, setFixedIncome] = useState<RecurringPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.all([
      listOpenInstallments(scope),
      listRecurring(scope, 'expense'),
      listRecurring(scope, 'income'),
    ]).then(([open, expenses, income]) => {
      if (!active) return;
      setInstallments(open);
      setFixedExpenses(expenses);
      setFixedIncome(income);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [scope, revision]);

  const remainingTotal = installments.reduce((acc, plan) => acc + plan.remainingAmount, 0);
  const fixedExpenseTotal = fixedExpenses.reduce((acc, plan) => acc + plan.commitment.amount, 0);
  const fixedIncomeTotal = fixedIncome.reduce((acc, plan) => acc + plan.commitment.amount, 0);

  return {
    installments,
    fixedExpenses,
    fixedIncome,
    remainingTotal,
    fixedExpenseTotal,
    fixedIncomeTotal,
    loading,
  };
}
