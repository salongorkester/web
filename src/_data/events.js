import EleventyFetch from "@11ty/eleventy-fetch";
import { parse } from "csv-parse/sync";
import { DateTime } from "luxon";
import markdownIt from "markdown-it";

const CSV_URL = process.env.SHEET_CSV_URL
const zone = "Europe/Oslo";

function parseDate(s) {
  s = (s || "").trim();
  let d = DateTime.fromFormat(s, "yyyy-MM-dd HH:mm", { zone: zone });
  if (!d.isValid) {
    d = DateTime.fromFormat(s, "yyyy-MM-dd", { zone: zone });
  }
  return d.isValid ? d.setLocale("nb").toFormat("EEEE dd.MM.yyyy HH:mm") : null;
}

export default async function() {
  const csv = await EleventyFetch(CSV_URL, {
    duration: "30s",
    type: "text"
  });

  const rows = parse(csv, {
    columns: false,
    skip_empty_lines: true,
    bom: true
  });

  const [header, ...dataRows] = rows;

  const now = DateTime.now().setZone(zone);
  const md = markdownIt();

  return dataRows.map(r => {
    if (r[5] !== "TRUE") {
      return null
    }
    return {
      start: parseDate(r[0]),
      end: parseDate(r[1]),
      tickets: r[2]?.trim(),
      place: r[3].trim(),
      map: r[4]?.trim(),
      title: r[6]?.trim(),
      body: md.render(r[7]?.trim()),
    }
  }).filter(r => r);
}
