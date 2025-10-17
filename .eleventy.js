import { DateTime } from "luxon";
import pluginSitemap from "@quasibit/eleventy-plugin-sitemap";;

export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "public": "/" });

  eleventyConfig.addFilter("date", (value, fmt = "yyyy") => {
    const d = value === "now" ? new Date() : new Date(value);
    return DateTime.fromJSDate(d)
      .setZone("Europe/Oslo")
      .setLocale("nb")
      .toFormat(fmt);
  });

  const baseUrl = process.env.BUILD_ENV === "prod"
        ? "https://salongorkester.no"
        : "https://staging.salongorkester.no";

  eleventyConfig.addGlobalData("env", process.env.BUILD_ENV || "staging");
  eleventyConfig.addGlobalData("site", { baseUrl: baseUrl });

  eleventyConfig.addPlugin(pluginSitemap, {
    sitemap: { hostname: baseUrl }
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
