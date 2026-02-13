export function getAdvisorIdFromToken(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);

    return payload["UserId"] ?? null;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}
