import gulp from 'gulp';
import composer from 'gulp-composer';
import gutil from 'gulp-util';
import {spawnSync} from 'child_process';

const
  tmp_dir = 'tmp',
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
  const cmd = spawnSync(satis.binary, ['build', satis.config, tmp_dir, '--no-interaction']);

  cmd.stdout.toString().split('\n').forEach( function (line) {
    gutil.log(gutil.colors.green(line));
  });

  cmd.stderr.toString().split('\n').forEach( function (line) {
    gutil.log(gutil.colors.red(line));
  });

  if (cmd.status > 0) {
    cb('Satis exited with code ' + cmd.status.toString());
  } else {
    cb();
  }
});

gulp.task("copy", (cb) => {
  gulp.src('./jekyll/**/*')
    .pipe(gulp.dest(tmp_dir));
});

gulp.task("bundler", (cb) => {
  const cmd = spawnSync('bundle', ['install', '--jobs=3', '--retry=3' ], {
    cwd: tmp_dir,
  });

  cmd.stdout.toString().split('\n').forEach( function (line) {
    gutil.log(gutil.colors.green(line));
  });

  cmd.stderr.toString().split('\n').forEach( function (line) {
    gutil.log(gutil.colors.red(line));
  });

  if (cmd.status > 0) {
    cb('Bundler exited with code ' + cmd.status.toString());
  } else {
    cb();
  }
});

gulp.task("jekyll", (cb) => {
  const cmd = spawnSync('bundle', ['exec', 'jekyll', 'build', '--destination', '../' + build_dir ], {
    cwd: tmp_dir,
  });

  cmd.stdout.toString().split('\n').forEach( function (line) {
    gutil.log(gutil.colors.green(line));
  });

  cmd.stderr.toString().split('\n').forEach( function (line) {
    gutil.log(gutil.colors.red(line));
  });

  if (cmd.status > 0) {
    cb('Jekyll exited with code ' + cmd.status.toString());
  } else {
    cb();
  }
});

gulp.task('default', ['composer', 'satis', 'copy', 'bundler', 'jekyll']);
