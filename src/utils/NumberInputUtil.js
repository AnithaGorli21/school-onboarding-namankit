export const handleDecimalInputChange = ({
  value,
  field,
  setForm,
  setL,
  allowNegative = false,
}) => {
  const num = parseFloat(value);

  // prevent negative values
  if (
    value !== '' &&
    !allowNegative &&
    !isNaN(num) &&
    num < 0
  ) {
    return;
  }

  setForm((prev) => ({
    ...prev,
    [field]: value,
  }));

  if (setL) setL(field);
};

export const handleNumberInputChange = ({
  value,
  field,
  setForm,
  setL,
  allowZero = false,
  allowNegative = false,
}) => {
  // allow empty value
  if (value === '') {
    setForm((prev) => ({
      ...prev,
      [field]: '',
    }));

    if (setL) setL(field);
    return;
  }

  const num = Number(value);

  // invalid number
  if (isNaN(num)) return;

  // prevent negative values
  if (!allowNegative && num < 0) return;

  // prevent zero
  if (!allowZero && num === 0) return;

  setForm((prev) => ({
    ...prev,
    [field]: value,
  }));

  if (setL) setL(field);
};