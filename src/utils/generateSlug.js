/**
 * 
 * @param {*} title 
 * @returns 
 */
export const generateSlug = (title) => {
  const sluglifyTitle = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return sluglifyTitle;
};
