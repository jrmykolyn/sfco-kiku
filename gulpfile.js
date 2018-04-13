// --------------------------------------------------
// IMPORT MODULES
// --------------------------------------------------
// Node

// Vendor
const eslint = require( 'gulp-eslint' );
const gulp = require( 'gulp' );
const gulpIf = require( 'gulp-if' );
const babel = require( 'gulp-babel' );
const PathMap = require( 'sfco-path-map' );
const sjmConfigs = require( '@sjmdev/sjm-configs' );

// --------------------------------------------------
// DECLARE VARS
// --------------------------------------------------
const { eslintConfig } =  sjmConfigs;
const PATHS = new PathMap( {
	'src': 'src',
	'dest': 'dist',
} );

// --------------------------------------------------
// DEFINE TASKS
// --------------------------------------------------
/**
 * Wrapper around any/all tasks to be executed when `gulp` is run.
 */
gulp.task( 'default', [ 'scripts' ] );

gulp.task( 'scripts:lint', () => {
	return gulp.src( `${PATHS.src}/*.js` )
		.pipe( eslint( eslintConfig ) )
		.pipe( eslint.format() );
} );

gulp.task( 'scripts:fix', () => {
	return gulp.src( `${PATHS.src}/*.js` )
		.pipe( eslint( {
			rules: eslintConfig.rules,
			fix: true,
		} ) )
		.pipe( eslint.format() )
		.pipe( gulpIf(
			( file ) => {
				return !!file.eslint && file.eslint.fixed;
			},
			gulp.dest( PATHS.src )
		) );
} )

gulp.task( 'scripts:compile', function() {
	return gulp.src( `${PATHS.src}/*.js` )
		.pipe( babel( {
			presets: [ 'env' ],
		} ) )
		.pipe( gulp.dest( PATHS.dest ) );
} );

/**
 * Wrapper around script-related tasks.
 *
 * NOTE: `scripts:fix` task is exluded (ie. it must be run manually).
 */
gulp.task( 'scripts', [ 'scripts:lint', 'scripts:compile' ] );