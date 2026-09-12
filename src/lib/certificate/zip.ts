import JSZip from "jszip";

import type { GeneratedCertificate } from "./bulk-generator";

export async function createCertificatesZip(
  certificates: GeneratedCertificate[],
): Promise<Uint8Array> {
  if (certificates.length === 0) {
    throw new Error(
      "No certificates available to create ZIP.",
    );
  }

  const zip = new JSZip();

  for (const certificate of certificates) {
    zip.file(certificate.fileName, certificate.data);
  }

  return zip.generateAsync({
    type: "uint8array",
    compression: "DEFLATE",
    compressionOptions: {
      level: 6,
    },
  });
}