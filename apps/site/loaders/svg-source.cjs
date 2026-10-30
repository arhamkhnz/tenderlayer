// Bundle SVG source for generated images without runtime filesystem access.
module.exports = function svgSource(source) {
  return `export default ${JSON.stringify(source)};`;
};
