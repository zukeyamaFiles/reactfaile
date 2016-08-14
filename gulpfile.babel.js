    const gulp        = require('gulp'),
        through = require('through2'),
        browserify  = require('browserify'),
        tab = require('gulp-html-prettify'),
        babelify    = require('babelify'),        
        uglify = require("gulp-uglify"),
        source = require('vinyl-source-stream'),
        jade = require('gulp-jade'),
        plumber     = require('gulp-plumber'),
        buffer     = require( 'vinyl-buffer' ),
        spritesmith = require('gulp.spritesmith'),
        watchify = require('watchify'),
        data = require('gulp-data'),
        path = require('path'),
        fs   = require('fs'),
        tho   = require('stream'),
        trans   = require('stream').Transform,
        read   = require('stream').Readable,
        prettify = require('gulp-html-prettify'),

        //postCss
        postcss = require('gulp-postcss'),
        nested = require('postcss-nested'),
        vars = require('postcss-simple-vars'),
        _import = require('postcss-import'),
        autoprefixer = require('autoprefixer');


    gulp.task('jade',() => {
       return  gulp.src(['./assets/**/*.jade','!./assets/**/_*.jade'])
            .pipe(plumber())  
            .pipe(data(function(file) {

              return {test: require('./test.json')};
            }))
        .pipe(jade({
          pretty: true
        }))
        .pipe(prettify({indent_char: ' ', indent_size: 2}))
        .pipe(gulp.dest('./public/'))
    });
     

    gulp.task('browserify',() => {
        browserify(["./assets/js/index.js"])
        .transform(babelify, { presets: ['es2015'] })
        .on("error", function (err) { console.log("Error : " + err.message); })
            .bundle()
            .pipe(source("main.js"))
            .pipe(gulp.dest("./public/js"))
            .on('end',function(){
                gulp.src(["./public/js/main.js"])
                    .pipe(plumber())
                    .pipe(uglify({mangle: false}))
                    .pipe(gulp.dest("./public/js/min"))
            })
    });
    

    gulp.task('jsx',() => {
        browserify("./assets/jsx/index.jsx")
        .transform(babelify, { presets: ['es2015','react'] })
        .on("error", function (err) { console.log("Error : " + err.message); })
            .bundle()
            .pipe(source("main.js"))
            .pipe(gulp.dest("./public/jsx"))
            .on('end',function(){
                gulp.src(["./public/jsx/main.js"])
                    .pipe(plumber())
                    .pipe(uglify({mangle: false}))
                    .pipe(gulp.dest("./public/jsx/min"))
            })
    });

     let getFolders = (dir_path) => {
      return fs.readdirSync(dir_path).filter(function(file) {
        return fs.statSync(path.join(dir_path, file)).isDirectory();
      });
    };

    let option = [".png",".jpg"];
    gulp.task('sprite', function() {
        let folders = getFolders('./');
        folders.forEach(function(folder){
            let spriteData = gulp.src('./app/img/sprite/'+ folder +'/*' + option[0])
                .pipe(spritesmith({
                    imgName: 'sprite'+option[0],                        
                    cssName: '_sprite.scss',                   
                    imgPath: './img/sprite'+option[0],
                    cssFormat: 'scss',                           
                    cssVarMap: function(sprite) {
                        sprite.name = "sprite-" + sprite.name; 
                    }
            }));
            spriteData.img
                .pipe(gulp.dest('./public/assets/images/'+ folder));     // imgName で指定したスプライト画像の保存先
            return spriteData.css
                .pipe(gulp.dest('./app/styles/commons'+ folder));    

        });
    });

    let mod = [
        nested,
        autoprefixer({ browsers: ['android >= 4.1'] }),
        _import,
        vars
    ];
    gulp.task('css', () => {
      gulp.src( './assets/css/*.css' )
        .pipe(plumber())
        .pipe(postcss(mod))
       .pipe(gulp.dest('./public/css') );
    });


    // watch 
    gulp.task('watch',() => {
        gulp.watch('./assets/**/*.jade', ['jade']);
        gulp.watch('./assets/js/*.js', ['browserify']);
        gulp.watch('./assets/jsx/*.jsx', ['jsx']);
        gulp.watch('./assets/css/*.css', ['css']);
    });
     

    gulp.task("default",['watch']);