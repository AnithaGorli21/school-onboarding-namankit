export const sanitizeInput = ({
  value,
  allowSpaces = true,
  allowNumbers = true,
  allowAlphabets = true,
  allowSpecialChars = false,
}) => {
  if (allowSpecialChars) {
    return value;
  }

  let pattern = "";

  if (allowAlphabets) pattern += "a-zA-Z";
  if (allowNumbers) pattern += "0-9";
  if (allowSpaces) pattern += " ";

  const regex = new RegExp(`[^${pattern}]`, "g");

  return value.replace(regex, "");
};