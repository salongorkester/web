module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "public": "/" });
  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_includes/layouts",
      output: "_site"
    }
  };
};
