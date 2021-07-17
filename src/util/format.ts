export const localizePrice = (num) =>
  num || num === 0
    ? String(round(num, 3)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
    : '-';

export const round = (value, decimals = 2) => {
  const mod = decimals !== 0 ? 10 ** decimals : 1;
  return Math.round(value * mod) / mod;
};
