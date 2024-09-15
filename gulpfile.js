var cachebust = require('gulp-cache-bust');
 
gulp.src('./public/*.html')
    .pipe(cachebust({
        type: 'timestamp'
    }))
    .pipe(gulp.dest('./public'));

gulp.src('./public/assets/styles/*.css')
    .pipe(cachebust({
        type: 'timestamp'
    }))
    .pipe(gulp.dest('./public/assets/styles'));

gulp.src('./public/*.js')
    .pipe(cachebust({
        type: 'timestamp'
    }))
    .pipe(gulp.dest('./public'));