import crypto from "crypto";

export function generateSignature(request_token, api_secret, api_key) {
  const key = api_key + request_token;
  const keyByte = Buffer.from(key, "utf8");
  const secretByte = Buffer.from(api_secret, "utf8");
  const hmac = crypto.createHmac("sha256", keyByte);
  hmac.update(secretByte);
  const hashBytes = hmac.digest();
  const signature = hashBytes.toString("hex").toLowerCase();
  console.log(signature);
  return signature;
}
