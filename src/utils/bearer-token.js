export function extractBearerToken(
  authorizationHeader
) {
  if (typeof authorizationHeader !== "string") {
    return null;
  }

  const parts = authorizationHeader.trim().split(/\s+/);

  if (
    parts.length !== 2 ||
    parts[0].toLowerCase() !== "bearer" ||
    parts[1] === ""
  ) {
    return null;
  }

  return parts[1];
}