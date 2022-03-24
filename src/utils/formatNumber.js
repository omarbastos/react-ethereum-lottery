export const moneyMask = (value) => {
  const newValue = value.replace('.', '').replace(',', '').replace(/\D/g, '');
  const options = { minimumFractionDigits: 2 };
  const result = new Intl.NumberFormat('en-US', options).format(
    parseFloat(newValue) / 100,
  );
  return Number.isNaN(+result) ? '0.00' : result;
};

export const unMoneyMask = (currency) =>
  Number(currency?.replace ? currency.replace(/[^0-9.-]+/g, '') : 0);
