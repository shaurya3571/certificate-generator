const ID_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const ID_LENGTH = 6;

export function generateCertificateId(): string {
  let randomPart = "";

  for (let i = 0; i < ID_LENGTH; i++) {
    const randomIndex = Math.floor(
      Math.random() * ID_CHARACTERS.length,
    );

    randomPart += ID_CHARACTERS[randomIndex];
  }

  const year = new Date().getFullYear();

  return `CERT-${year}-${randomPart}`;
}