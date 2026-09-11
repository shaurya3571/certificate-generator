import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export interface CertificateGenerationInput {
  eventName: string;
  participantName: string;
  certificateId: string;
}

export async function generateCertificate(
  input: CertificateGenerationInput,
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  /*
   * Landscape certificate:
   * 842 × 595 points ≈ A4 landscape
   */
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
   * Outer certificate border.
   */
  page.drawRectangle({
    x: 30,
    y: 30,
    width: width - 60,
    height: height - 60,
    borderWidth: 2,
    borderColor: rgb(0.15, 0.15, 0.15),
  });

  /*
   * Certificate title.
   */
  const title = "CERTIFICATE OF PARTICIPATION";

  const titleSize = 30;
  const titleWidth = titleFont.widthOfTextAtSize(
    title,
    titleSize,
  );

  page.drawText(title, {
    x: (width - titleWidth) / 2,
    y: height - 130,
    size: titleSize,
    font: titleFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  /*
   * Supporting text.
   */
  const subtitle = "This certificate is proudly presented to";

  const subtitleSize = 16;
  const subtitleWidth = bodyFont.widthOfTextAtSize(
    subtitle,
    subtitleSize,
  );

  page.drawText(subtitle, {
    x: (width - subtitleWidth) / 2,
    y: height - 195,
    size: subtitleSize,
    font: bodyFont,
    color: rgb(0.35, 0.35, 0.35),
  });

  /*
   * Participant name.
   */
  const nameSize = 34;
  const nameWidth = titleFont.widthOfTextAtSize(
    input.participantName,
    nameSize,
  );

  page.drawText(input.participantName, {
    x: (width - nameWidth) / 2,
    y: height - 260,
    size: nameSize,
    font: titleFont,
    color: rgb(0.05, 0.05, 0.05),
  });

  /*
   * Event information.
   */
  const eventText = `For participating in ${input.eventName}`;

  const eventSize = 17;
  const eventWidth = bodyFont.widthOfTextAtSize(
    eventText,
    eventSize,
  );

  page.drawText(eventText, {
    x: (width - eventWidth) / 2,
    y: height - 315,
    size: eventSize,
    font: bodyFont,
    color: rgb(0.25, 0.25, 0.25),
  });

  /*
   * Certificate ID.
   */
  const idText = `Certificate ID: ${input.certificateId}`;

  const idSize = 11;
  const idWidth = italicFont.widthOfTextAtSize(
    idText,
    idSize,
  );

  page.drawText(idText, {
    x: (width - idWidth) / 2,
    y: 75,
    size: idSize,
    font: italicFont,
    color: rgb(0.4, 0.4, 0.4),
  });

  return pdfDoc.save();
}