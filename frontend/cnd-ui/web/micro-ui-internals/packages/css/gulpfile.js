/** 
 * @author - Shivank - NUDM 
 * Why we use Gulp in This project - 
 * We are using SCSS (sass) so this gulp file helps - 
 * 1. Compiling SCSS --> to CSS, as browser dont understand SCSS so Gulp Convert it
 * 2. Ensured Compatibility with differnet browsers
 * 3. Minify the files as well for the faster Loading
 * 
 */




const { series, src, dest, watch, task } = require("gulp");
const clean = require("gulp-clean");
const postcss = require("gulp-postcss");
const sass = require("gulp-sass");
const postcssPresetEnv = require("postcss-preset-env");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const livereload = require("gulp-livereload");

let output = "./example";
if (true) {
  output = "./dist";
}

function cleanStyles() {
  return src(`${output}/*.css`, { read: false }).pipe(clean());
}

function styles() {
  const plugins = [
    require("postcss-import"),
    require("tailwindcss"),
    postcssPresetEnv({ stage: 2, autoprefixer: { cascade: false }, features: { "custom-properties": true } }),
    require("autoprefixer"),
    require("cssnano"),
  ];
  return src("src/index.scss").pipe(postcss(plugins)).pipe(sass()).pipe(dest(output));
}

function minify() {
  return src(`${output}/index.css`).pipe(cleanCSS()).pipe(rename(`index.min.css`)).pipe(dest(output));
}

function stylesLive() {
  styles().pipe(livereload({ start: true }));
}

function livereloadStyles() {
  livereload.listen();
  watch("src/**/*.scss", series(stylesLive));
}

exports.styles = styles;
exports.default = series(styles);
exports.watch = livereloadStyles;
if (true) {
  exports.build = series(cleanStyles, styles, minify);
} else {
  exports.build = series(styles, livereloadStyles);
}

// gulp.task("watch:styles", function () {
//   livereload.listen();
//   gulp.watch("**/*.scss", ["styles"]);
// });
