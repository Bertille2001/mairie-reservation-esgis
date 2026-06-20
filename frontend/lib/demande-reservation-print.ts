import { jsPDF } from "jspdf";

import { formatSlotLabel, parseQueryDateRange } from "@/lib/dates";
import {
  formatDateTimeFr,
  formatPrice,
  formatTypeDemandeur,
} from "@/lib/format";
import type { DemandeReservation } from "@/lib/types";

const PAGE_MARGIN = 18;
const CONTENT_WIDTH = 210 - PAGE_MARGIN * 2;

function formatSlotForPrint(demande: DemandeReservation): string {
  const slotRange = parseQueryDateRange(demande.date_debut, demande.date_fin);
  if (slotRange) {
    return formatSlotLabel(slotRange);
  }
  return `${demande.date_debut} – ${demande.date_fin}`;
}

type PdfRow = { label: string; value: string };

function buildPdfRows(demande: DemandeReservation): PdfRow[] {
  const statutLabel = "En attente de traitement";
  const dateDepot = formatDateTimeFr(demande.date_soumission);
  const typeDemandeur = formatTypeDemandeur(demande.type_demandeur);
  const slotLabel = formatSlotForPrint(demande);
  const prixLabel = formatPrice(demande.prix_total);

  return [
    { label: "Numéro de demande", value: String(demande.id) },
    { label: "Date de dépôt", value: dateDepot },
    { label: "Statut", value: statutLabel },
    { label: "Salle", value: demande.salle_nom },
    { label: "Créneau", value: slotLabel },
    { label: "Manifestation", value: demande.nom_manifestation },
    { label: "Participants", value: `${demande.nb_personnes} personnes` },
    { label: "Demandeur", value: demande.demandeur_nom },
    { label: "E-mail", value: demande.demandeur_email },
    { label: "Type de demandeur", value: typeDemandeur },
    { label: "Prix estimé", value: prixLabel },
  ];
}

function drawWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  for (const line of lines) {
    doc.text(line, x, y);
    y += lineHeight;
  }
  return y;
}

export function downloadDemandeReservationPdf(demande: DemandeReservation): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const documentTitle = `Demande de réservation n° ${demande.id}`;
  const statutLabel = "En attente de traitement";
  const rows = buildPdfRows(demande);

  let y = PAGE_MARGIN;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(26, 26, 26);
  doc.text("Mairie de Lomé", PAGE_MARGIN, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(68, 68, 68);
  doc.text("Réservation des salles municipales", PAGE_MARGIN, y);
  y += 4;

  doc.setDrawColor(26, 26, 26);
  doc.setLineWidth(0.6);
  doc.line(PAGE_MARGIN, y, PAGE_MARGIN + CONTENT_WIDTH, y);
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(26, 26, 26);
  y = drawWrappedText(doc, documentTitle, PAGE_MARGIN, y, CONTENT_WIDTH, 7);
  y += 2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(68, 68, 68);
  doc.text("Récapitulatif transmis au service municipal", PAGE_MARGIN, y);
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(26, 26, 26);
  doc.text(statutLabel.toUpperCase(), PAGE_MARGIN + 2, y + 4);
  const statusWidth = doc.getTextWidth(statutLabel.toUpperCase()) + 6;
  doc.setDrawColor(102, 102, 102);
  doc.setLineWidth(0.3);
  doc.roundedRect(PAGE_MARGIN, y, statusWidth, 7, 1, 1, "S");
  y += 14;

  const labelWidth = CONTENT_WIDTH * 0.38;
  const valueWidth = CONTENT_WIDTH - labelWidth - 4;
  const valueX = PAGE_MARGIN + labelWidth + 4;

  for (const row of rows) {
    const labelLines = doc.splitTextToSize(row.label, labelWidth) as string[];
    const valueLines = doc.splitTextToSize(row.value, valueWidth) as string[];
    const rowHeight = Math.max(labelLines.length, valueLines.length) * 4.5 + 4;

    if (y + rowHeight > 297 - PAGE_MARGIN - 20) {
      doc.addPage();
      y = PAGE_MARGIN;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(68, 68, 68);
    let labelY = y + 3.5;
    for (const line of labelLines) {
      doc.text(line, PAGE_MARGIN, labelY);
      labelY += 4.5;
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(26, 26, 26);
    let valueY = y + 3.5;
    for (const line of valueLines) {
      doc.text(line, valueX, valueY);
      valueY += 4.5;
    }

    y += rowHeight;
    doc.setDrawColor(221, 221, 221);
    doc.setLineWidth(0.2);
    doc.line(PAGE_MARGIN, y, PAGE_MARGIN + CONTENT_WIDTH, y);
  }

  y += 8;
  if (y + 18 > 297 - PAGE_MARGIN) {
    doc.addPage();
    y = PAGE_MARGIN;
  }

  doc.setDrawColor(221, 221, 221);
  doc.setLineWidth(0.2);
  doc.line(PAGE_MARGIN, y, PAGE_MARGIN + CONTENT_WIDTH, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(85, 85, 85);
  const footer =
    `Document généré le ${formatDateTimeFr(new Date().toISOString())}. ` +
    "Conservez ce récapitulatif pour vos échanges avec la mairie. " +
    "Cette demande ne peut plus être modifiée en ligne.";
  drawWrappedText(doc, footer, PAGE_MARGIN, y, CONTENT_WIDTH, 4);

  doc.save(`demande-reservation-${demande.id}.pdf`);
}
