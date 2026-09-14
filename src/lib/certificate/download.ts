export function downloadCertificate(
  data: Uint8Array,
  fileName: string,
) {
  const blob = new Blob(
    [new Uint8Array(data)],
    {
      type: "application/pdf",
    },
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}