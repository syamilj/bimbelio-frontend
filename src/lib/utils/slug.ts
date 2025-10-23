export const getSlug = (title: string) => {
  return title
    .toLocaleLowerCase()
    .replace(/ /g, '-')
    .replace(/[^a-z0-9-]/g, '');
};
