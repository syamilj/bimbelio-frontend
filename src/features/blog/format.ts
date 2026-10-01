export const formatPostDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export const formatViews = (views: number) =>
  views >= 1000
    ? `${(views / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} rb`
    : views.toLocaleString('id-ID');
