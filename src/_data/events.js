import Fetch from "@11ty/eleventy-fetch";
import { parse } from "csv-parse/sync";
import { DateTime } from "luxon";
import markdownIt from "markdown-it";

const CSV_URL = process.env.SHEET_CSV_URL
const zone = "Europe/Oslo";
const expectedDateFormats = [
  "yyyy-MM-dd HH:mm",
  "MM/dd/yyyy HH:mm",
  "yyyy-MM-dd",
  "MM/dd/yyyy"
];

function parseDate(s) {
  s = (s || "").trim();
  let d = null, i = 0;
  for (; i < expectedDateFormats.length; i++) {
    d = DateTime.fromFormat(s, expectedDateFormats[i], { zone: zone });
    if (d.isValid) {
      break;
    }
  }
  return d.isValid ? d.setLocale("nb") : null;
}

export default async function() {
  const now = DateTime.now().setZone(zone);
  const csv = await Fetch(`${CSV_URL}&nocache=${now.toMillis()}`, {
    duration: "0s",
    type: "text",
    verbose: true
  });

  const rows = parse(csv, {
    columns: false,
    skip_empty_lines: true,
    bom: true
  });

  const [header, ...dataRows] = rows;

  const md = markdownIt();

  return dataRows.map(r => {
    if (r[5] !== "TRUE") {
      return null
    }
    const start = parseDate(r[0]);
    const end = parseDate(r[1]);
    return {
      date: start,
      start: start ? start.toFormat("EEEE dd.MM.yyyy HH:mm") : null,
      end: end ? end.toFormat("EEEE dd.MM.yyyy HH:mm") : null,
      tickets: r[2]?.trim(),
      place: r[3].trim(),
      map: r[4]?.trim(),
      title: r[6]?.trim(),
      body: md.render(r[7]?.trim()),
    }
  }).filter(r => r && r.date > now).toSorted(
    (l, r) => l.date == r.date ? 0 : (l.date > r.date ? 1 : -1)
  );
}
