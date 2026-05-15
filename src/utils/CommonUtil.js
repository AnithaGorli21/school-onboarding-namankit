export const sanitizeInput = ({
  value,
  allowSpaces = true,
  allowNumbers = true,
  allowAlphabets = true,
  allowSpecialChars = false,
  allowedChars = "", // example: ".,-_"
}) => {
  if (allowSpecialChars) {
    return value;
  }

  let pattern = "";

  if (allowAlphabets) pattern += "a-zA-Z";
  if (allowNumbers) pattern += "0-9";
  if (allowSpaces) pattern += " ";

  // escape regex special chars
  const escapedAllowedChars = allowedChars.replace(
    /[-/\\^$*+?.()|[\]{}]/g,
    "\\$&"
  );

  pattern += escapedAllowedChars;

  const regex = new RegExp(`[^${pattern}]`, "g");

  return value.replace(regex, "");
};