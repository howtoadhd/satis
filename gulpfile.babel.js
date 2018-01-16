import gulp from 'gulp';
import composer from 'gulp-composer';
import gutil from 'gulp-util';
import {spawn} from 'child_process';

const
    build_dir = 'public',
    satis = {
        binary: './vendor/bin/satis',
        config: './satis.json',
    };

gulp.task("composer", () => {
    composer({
        async: false
    });
});

gulp.task("satis", (cb) => {
  const cmd = spawn(satis.binary, ['build', satis.config, build_dir, '--no-interaction']);
  cmd.stdout.on('data', data => {
    gutil.log(gutil.colors.green(data.toString()));
  });

  cmd.stderr.on('data', data => {
    gutil.log(gutil.colors.red(data.toString()));
  });

  cmd.on('exit', code => {
    if (code > 0) {
      cb('Satis exited with code ' + code.toString());
    } else {
      cb();
    }
  });
});

gulp.task("copy", (cb) => {
  gulp.src('./jekyll/**/*')
    .pipe(gulp.dest('./public'));
});

gulp.task('prepare', ['composer']);

gulp.task('build', ['satis', 'copy']);

gulp.task('default', ['prepare', 'build']);
