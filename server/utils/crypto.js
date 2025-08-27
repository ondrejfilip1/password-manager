const crypto = require("crypto");
// credit: https://medium.com/@tony.infisical/guide-to-nodes-crypto-module-for-encryption-decryption-65c077176980

const SECRET_KEY = crypto
  .createHash("sha256")
  .update(String(process.env.PASSWORD_SECRET || "default_secret"))
  .digest();

const encryptSymmetric = (plaintext) => {
  const iv = crypto.randomBytes(parseInt(process.env.IV_LENGTH));
  const cipher = crypto.createCipheriv(process.env.ALGORITHM, SECRET_KEY, iv);

  let ciphertext = cipher.update(plaintext, "utf8", "base64");
  ciphertext += cipher.final("base64");

  const tag = cipher.getAuthTag();

  return {
    ciphertext,
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
  };
};

const decryptSymmetric = ({ ciphertext, iv, tag }) => {
  const decipher = crypto.createDecipheriv(
    process.env.ALGORITHM,
    SECRET_KEY,
    Buffer.from(iv, "base64")
  );
  decipher.setAuthTag(Buffer.from(tag, "base64"));

  let plaintext = decipher.update(ciphertext, "base64", "utf8");
  plaintext += decipher.final("utf8");
  return plaintext;
};

module.exports = { encryptSymmetric, decryptSymmetric };
