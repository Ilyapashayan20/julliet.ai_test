import { formatRelative, subDays, formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';
const formatRelativeDate = (date: any, locale: Locale | null = null) => {
  locale = locale || es;
  return formatRelative(subDays(new Date(date), 0), new Date(), { locale: es });
};

const formatDistanceDate = (date: any, locale: Locale | null = null) => {
  locale = locale || es;
  return formatDistance(subDays(new Date(date), 0), new Date(), {
    addSuffix: true,
    locale: es
  });
};

export { formatRelativeDate, formatDistanceDate };
