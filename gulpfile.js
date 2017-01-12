let gulp = require('gulp'),
    del = require('del'),
    sourcemaps = require('gulp-sourcemaps'),
    concatCss = require('gulp-concat-css'),
    webpack = require('webpack-stream'),
    rsync = require('rsync-slim'),
    secrets = require('./secrets.json'),
    connect = require('gulp-connect'),
    replace = require('gulp-replace');

const outputFolder = 'dist';

gulp.task('css', () => {
   return gulp.src([
      'node_modules/leaflet/dist/leaflet.css',
      'node_modules/leaflet.markercluster/dist/MarkerCluster.css',
      'node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css',
      'node_modules/leaflet-draw/dist/leaflet.draw.css',
      'node_modules/select2/dist/css/select2.min.css',
      'stylesheets/index.css']
    )
    .pipe(concatCss('bundle.css', {
      rebaseUrls: false
    }))
    .pipe(gulp.dest(outputFolder));
});

gulp.task('images', ['clean'], function () {
  return gulp.src(['node_modules/leaflet-draw/dist/images/*', 'images/**/*'])
    .pipe(gulp.dest(outputFolder + '/images'));
});

gulp.task('default', ['clean', 'css', 'images'], () => {

  gulp.src('api/**/*')
    .pipe(gulp.dest(outputFolder + '/api'));

  gulp.src(['node_modules/leaflet-draw/dist/images/spritesheet-2x.png'])
    .pipe(gulp.dest(outputFolder))

  gulp.src(['index.html',
    'api.php',
    'staticmap.php',
    'favicon.ico',
    'config.php',
    'functions.php',
    'map.php'
    ])
    .pipe(gulp.dest(outputFolder));

  return gulp.src('js/crashbrowser.js')
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(gulp.dest(outputFolder));
});

gulp.task('clean', () => {
  return del([outputFolder]).then(paths => {
    console.log('Deleted files and folders:\n', paths.join('\n'));
  });
});

gulp.task('watch', () => {
  gulp.watch(['js/**/*.js', 'stylesheets/index.css', 'index.html'], ['default'])
});

gulp.task('serve', ['clean', 'default', 'watch'], () => {
  gulp.src([outputFolder + '/bundle.js'])
    .pipe(replace('@@API_HOST', 'http://www.chicagocrashes.org'))
    .pipe(gulp.dest(outputFolder, {overwrite: true}));

  connect.server({root: 'dist'});
});

gulp.task('replaceProd', ['default'], () => {
  return gulp.src([outputFolder + '/bundle.js'])
    .pipe(replace('@@API_HOST', ''))
    .pipe(gulp.dest(outputFolder, {overwrite: true}));
})

gulp.task('deploy', ['default', 'replaceProd'], () => {
  rsync({
    src: outputFolder + '/',
    dest: secrets.username + '@' + secrets.hostname + ':/var/www/chicagocrashes/htdocs',
    options: '-rvhcz --delete --progress'
  }, function (err) {
    console.error(err);
  });
});

gulp.task('deploy-beta', ['default', 'replaceProd'], () => {
  rsync({
    src: outputFolder + '/',
    dest: secrets.username + '@' + secrets.hostname + ':/var/www/chicagocrashes/htdocs/beta',
    options: '-rvhcz --delete --progress'
  }, err => {
    console.error(err);
  });
});