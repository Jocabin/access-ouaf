export function encodeRoomName(roomName: string): string {
  const salt = "chatApp2025";
  const encoded = Buffer.from(salt + roomName)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return encoded;
}

export function decodeRoomName(encoded: string): string {
  const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");

  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4 || 4)) % 4),
    "="
  );

  const salt = "chatApp2025";
  const decoded = Buffer.from(padded, "base64").toString();

  if (decoded.startsWith(salt)) {
    return decoded.substring(salt.length);
  }

  return encoded;
}
