import { Layout } from '../components/layout/Layout';
import { DevotionalContainer } from '../components/devotional/DevotionalContainer';
import { LoadingSpinner } from '../components/loading/LoadingSpinner';
import { ErrorMessage } from '../components/error/ErrorMessage';
import { useDevotional } from '../hooks/useDevotional';
import { formatDate } from '../utils/formatters';

export function DevotionalPage() {
  const { devotional, isLoading, error } = useDevotional();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!devotional) {
    return <ErrorMessage message="Devocional não encontrado" />;
  }

  const today = formatDate(new Date().toISOString());

  return (
    <Layout>
      <DevotionalContainer devotional={devotional} today={today} />
    </Layout>
  );
}