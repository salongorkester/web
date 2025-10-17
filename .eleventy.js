import { DateTime } from "luxon";

export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "public": "/" });

  eleventyConfig.addFilter("date", (value, fmt = "yyyy") => {
    const d = value === "now" ? new Date() : new Date(value);
    return DateTime.fromJSDate(d)
      .setZone("Europe/Oslo")
      .setLocale("nb")
      .toFormat(fmt);
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_includes/layouts",
      output: "_site"
    }
  };
};
