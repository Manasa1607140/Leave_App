export const makeId = (prefix = 'id') => {
  const rand = Math.floor(Math.random() * 1e6).toString().padStart(6, '0');
  return `${prefix}_${Date.now()}_${rand}`;
};

export const sortByCreatedAtDesc = (a, b) => {
  if (!a?.createdAt || !b?.createdAt) return 0;
  return a.createdAt > b.createdAt ? -1 : 1;
};
