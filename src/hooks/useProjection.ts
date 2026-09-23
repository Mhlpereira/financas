import { useEffect, useState } from 'react';

import { buildProjection } from '@/domain/calc';
import type { ProjectionMonth } from '@/domain/types';
import { listMonthTotals } from '@/repositories/occurrences';
import { useAppStore } from '@/stores/app';
import { addMonths, currentCompetence } from '@/utils/date';

export function useProjection(months: number) {
  const scope = useAppStore((state) => state.scope);
  const revision = useAppStore((state) => state.revision);

  const [projection, setProjection] = useState<ProjectionMonth[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const start = currentCompetence();
    const end = addMonths(start, months - 1);

    setLoading(true);
    listMonthTotals(start, end, scope).then((totals) => {
      if (!active) return;
      setProjection(buildProjection(start, months, totals));
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [scope, months, revision]);

  return { projection, loading };
}
