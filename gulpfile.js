import gulp from 'gulp';
import gulpif from 'gulp-if';
import babel from 'gulp-babel';
import panini from 'panini';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import * as dartsass from 'sass';
import gulpsass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import browsersync from 'browser-sync';
import hasflag from 'has-flag';
import { deleteAsync } from 'del';

const sass = gulpsass(dartsass);
const production = hasflag('production');

// Pages

export const pages = () => {
    panini.refresh();
    
    return gulp.src('src/pages/**/*.html')
        .pipe(panini({
            root: 'src/pages',
            layouts: 'src/layouts',
            partials: 'src/partials',
            data: 'src/data'
        }))
        .pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true,
        }))
        .pipe(gulp.dest('dist'))
        .pipe(browsersync.stream());
};

// Styles

export const styles = () => {
    return gulp.src('src/styles/app.scss')
    .pipe(gulpif(!production, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
        autoprefixer(),
        cssnano({
            preset: ['default', {
                cssDeclarationSorter: false
            }]
        })
    ]))
    .pipe(gulpif(!production, sourcemaps.write('.')))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(browsersync.stream());
}

// Scripts

export const scripts = () => {
    return gulp.src('src/scripts/index.js')
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(terser())
        .pipe(gulp.dest('dist/assets/scripts'))
        .pipe(browsersync.stream());
};

// Copy

export const copy = () => {
    return gulp.src([
            'src/assets/favicons/**/*',
            'src/assets/fonts/**/*',
            'src/assets/images/**/*',
            'src/assets/icons/sprite.svg',
            'src/manifest.webmanifest'
        ], {
            base: 'src'
        })
        .pipe(gulp.dest('dist'))
        .pipe(browsersync.stream({
            once: true
        }));
};

// Clean

export const clean = () => {
    return deleteAsync(['dist']);
};

// Server

export const server = () => {
    browsersync.init({
        server: 'dist',
        port: 9001,
        ui: false,
        notify: false
    });
};

// Watch

export const watch = () => {
    gulp.watch('src/styles/**/*.scss', gulp.series(styles));
    gulp.watch('src/scripts/**/*.js', gulp.series(scripts));
    gulp.watch([
        'src/layouts/**/*',
        'src/pages/**/*',
        'src/partials/**/*',
        'src/data/**/*',
    ], gulp.series(pages));
    gulp.watch([
        'src/assets/favicons/**/*',
        'src/assets/fonts/**/*',
        'src/assets/images/**/*',
        'src/assets/icons/sprite.svg',
    ], gulp.series(copy));
};

// Build

export const build = gulp.series(
    clean,
    pages,
    styles,
    scripts,
    copy
);

// Default

export default gulp.series(
    build,
    gulp.parallel(
        watch,
        server
    ),
);