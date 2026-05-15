export const handleDecimalInputChange = ({
  value,
  field,
  setForm,
  setL,
  allowNegative = false,
}) => {
  // allow empty
  if (value === '') {
    setForm((prev) => ({
      ...prev,
      [field]: '',
    }));

    if (setL) setL(field);
    return;
  }

  // allow only valid decimal pattern
  if (!/^-?\d*\.?\d*$/.test(value)) return;

  const num = parseFloat(value);

  // prevent negative values
  if (
    !allowNegative &&
    !isNaN(num) &&
    num < 0
  ) {
    return;
  }

  // prevent multiple leading zeros
  // invalid: 0001, 000.1, 01
  // valid: 0, 0.1, 10, 100
  if (/^0\d+/.test(value)) {
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