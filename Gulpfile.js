var gulp = require('gulp');
  // sass = require('gulp-ruby-sass'),
  // sourcemaps = require('gulp-sourcemaps'),
  // cleanCSS = require('gulp-clean-css'),
  // rename = require('gulp-rename'),
  // concat = require('gulp-concat'),
  // uglify = require('gulp-uglify'),
  // imagemin = require('gulp-imagemin'),
  // htmlmin = require('gulp-htmlmin'),
  // minifyHTML = require('gulp-minify-html');
// browserSync = require('browser-sync'),
  // watch = require('gulp-watch'),

  paths = {
    'index': ['src/*.html', 'src/**/*.json', 'src/**/**/*.+(jpg|png|gif|svg)'],
    'html': ['src/*.html'],
    'image': ['src/**/**/*.+(jpg|png|gif|svg)'],
    'scss': ['src/**/*.scss'],
    'css': ['src/**/*.css', 'src/**/*.min.css'],
    'js': ['src/**/*.js']
  };

//    var  rollup = require('rollup'),
//   rollupTypescript = require('rollup-plugin-typescript')
// ;

// gulp.task('build', function () {
//   return rollup.rollup({
//     entry: "./src/main.ts",
//     plugins: [
//       rollupTypescript()
//     ],
//   })
//     .then(function (bundle) {
//       bundle.write({
//         format: "umd",
//         moduleName: "library",
//         dest: "./dist/library.js",
//         sourceMap: true
//       });
//     })
// });



// var babel = require('gulp-babel'),
//   plumber = require('gulp-plumber');


//           var babelify = require('babelify');
// var browserify = require('browserify');
// var source = require('vinyl-source-stream');




gulp.task('index', function () {
  return gulp.src(paths.index)
    .pipe(gulp.dest('dist'))
});

gulp.task('scss', function () {
  return sass('src/styles/scss/*.scss', { sourcemap: true })
    .on('error', sass.logError)
    .pipe(sourcemaps.write())
    // .pipe(sourcemaps.write('maps', {
    //   includeContent: false,
    //   sourceRoot: 'source'
    // }))
    .pipe(gulp.dest('src/styles/css'));
});

gulp.task('htmlmin', function () {
  return gulp.src(paths.html)
    .pipe(minifyHTML({ empty: true }))
    .pipe(gulp.dest('dist'));
});

gulp.task('minify', function () {
  return gulp.src(paths.css)
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist'));
});
gulp.task('uglify', function () {
  return gulp.src(paths.js)
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
});

/* es6 */
gulp.task('es6', function () {
  return gulp.src('src/es6/*.js')
    .pipe(plumber())
    .pipe(babel({
      modules: 'a;md',
      presets: ['es2015']
    }))
    .pipe(gulp.dest('src/es5/'));

  // browserify({
  //   entries: 'src/es6/a.js',
  //   debug: true
  // })
  // .transform(babelify, {
  //         presets: ["es2015"],
  //         // "plugins": ["transform-decorators-legacy"], "stage-0", "stage-1"
  //     })
  // .bundle()
  // .pipe(source('abc.js'))
  // .pipe(gulp.dest('src/es5/'))

});

// gulp.task('imagemin',function(){
//     return gulp.src(paths.image)
//       .pipe(imagemin({optimizationLevel: 5}))
//       .pipe(gulp.dest('dist'));
// });

gulp.task('watch', function () {
  // gulp.watch(paths.scss, ['scss']);
  gulp.watch(['*.scss', '*.js', '*.html']);
  // gulp.watch(['src/es6/*.js'], ['es6']);
});

// gulp.task('browsersync', function () {
//   var files = [
//     '**/*.js',
//     '**/*.scss',
//     '**/*.css',
//     '**/*.json',
//     '**/*.html'
//   ];
//   browserSync.init(files, {
//     startPath: "src/index.html",
//     server: {
//       baseDir: './'
//     },
//     port: 5555,
//     ghostMode: { // 点击，滚动和表单在任何设备上输入将被镜像到所有设备里
//       clicks: true,
//       forms: false,
//       scroll: true
//     },
//     notify: false,
//     // browser: ["google chrome"], // , "firefox"
//     reloadDelay: 800,
//     timestamps: true,
//     online: false //不会尝试确定你的网络状况，假设你离线 
//   });
// });
var browserSync = require('browser-sync').create();
gulp.task('browsersync', function() {
  browserSync.init({
        // startPath: "src/index.html",
      server: {
          baseDir: "./"
      }
  });
});



gulp.task('dev', ['watch'], function () {
  gulp.start('browsersync');
  // gulp.start('scss');
});

gulp.task('default', function () {
  gulp.start('index');
  gulp.start('minify');
  gulp.start('uglify');
  gulp.start('htmlmin');
});