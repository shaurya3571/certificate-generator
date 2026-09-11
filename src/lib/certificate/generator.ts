import {
  PDFDocument,
  StandardFonts,
  rgb,
} from "pdf-lib";

import type { TemplateType } from "@/types/certificate";

export interface CertificateGenerationInput {
  eventName: string;
  participantName: string;
  certificateId: string;
  template: TemplateType;
}

function drawCenteredText(
  page: ReturnType<PDFDocument["addPage"]>,
  text: string,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  size: number,
  y: number,
) {
  const { width } = page.getSize();

  const textWidth = font.widthOfTextAtSize(text, size);

  page.drawText(text, {
    x: (width - textWidth) / 2,
    y,
    size,
    font,
  });
}

async function generateClassicCertificate(
  pdfDoc: PDFDocument,
  input: CertificateGenerationInput,
) {
  const page = pdfDoc.addPage([842, 595]);

  const { width, height } = page.getSize();

  const titleFont = await pdfDoc.embedFont(
    StandardFonts.HelveticaBold,
  );

  const bodyFont = await pdfDoc.embedFont(
    StandardFonts.Helvetica,
  );

  const italicFont = await pdfDoc.embedFont(
    StandardFonts.HelveticaOblique,
  );

  /*
   * Classic double border.
   */
  page.drawRectangle({
    x: 28,
    y: 28,
    width: width - 56,
    height: height - 56,
    borderWidth: 2,
    borderColor: rgb(0.15, 0.15, 0.15),
  });

  page.drawRectangle({
    x: 38,
    y: 38,
    width: width - 76,
    height: height - 76,
    borderWidth: 1,
    borderColor: rgb(0.45, 0.45, 0.45),
  });

  drawCenteredText(
    page,
    "CERTIFICATE OF PARTICIPATION",
    titleFont,
    30,
    height - 130,
  );

  drawCenteredText(
    page,
    "This certificate is proudly presented to",
    bodyFont,
    16,
    height - 195,
  );

  drawCenteredText(
    page,
    input.participantName,
    titleFont,
    34,
    height - 260,
  );

  drawCenteredText(
    page,
    `For participating in ${input.eventName}`,
    bodyFont,
    17,
    height - 315,
  );

  drawCenteredText(
    page,
    `Certificate ID: ${input.certificateId}`,
    italicFont,
    11,
    75,
  );
}

async function generateModernCertificate(
  pdfDoc: PDFDocument,
  input: CertificateGenerationInput,
) {
  const page = pdfDoc.addPage([842, 595]);

  const { width, height } = page.getSize();

  const titleFont = await pdfDoc.embedFont(
    StandardFonts.HelveticaBold,
  );

  const bodyFont = await pdfDoc.embedFont(
    StandardFonts.Helvetica,
  );

  const italicFont = await pdfDoc.embedFont(
    StandardFonts.HelveticaOblique,
  );

  /*
   * Modern accent panel.
   */
  page.drawRectangle({
    x: 0,
    y: height - 18,
    width,
    height: 18,
    color: rgb(0.12, 0.12, 0.12),
  });

  /*
   * Minimal outer border.
   */
  page.drawRectangle({
    x: 45,
    y: 45,
    width: width - 90,
    height: height - 90,
    borderWidth: 1,
    borderColor: rgb(0.75, 0.75, 0.75),
  });

  drawCenteredText(
    page,
    "CERTIFICATE",
    titleFont,
    38,
    height - 145,
  );

  drawCenteredText(
    page,
    "OF PARTICIPATION",
    bodyFont,
    18,
    height - 180,
  );

  drawCenteredText(
    page,
    input.participantName,
    titleFont,
    36,
    height - 260,
  );

  drawCenteredText(
    page,
    `Participated in ${input.eventName}`,
    bodyFont,
    17,
    height - 315,
  );

  drawCenteredText(
    page,
    `Certificate ID: ${input.certificateId}`,
    italicFont,
    11,
    75,
  );
}

export async function generateCertificate(
  input: CertificateGenerationInput,
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  if (input.template === "modern") {
    await generateModernCertificate(pdfDoc, input);
  } else {
    /*
     * Classic is also the fallback for custom at this stage.
     * Custom template rendering will be implemented separately.
     */
    await generateClassicCertificate(pdfDoc, input);
  }

  return pdfDoc.save();
}