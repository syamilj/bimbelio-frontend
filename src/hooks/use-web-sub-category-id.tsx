export const website_sub_category_id =
  localStorage?.getItem('website_sub_category_id') || null;

const urlPathname = window.location.pathname.split('/');

export const website_sub_category_id_params =
  urlPathname.length > 1 ? urlPathname[1] : website_sub_category_id;
