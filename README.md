# simple, clean and minimal
This is a clean example React Project. It has everything you need for a quick and comfortable start into React.

## use it
1) Setup: `npm install`
2) development-server: `npm start` (live-server should be accessible at  `http://0.0.0.0:8080`)
3) production build: `npm run production`
(Production build will be in projects sub-folder `bundle` - just copy everything in there to your 
web-server navigate to `index.html`)

## features

* Hot Building: view your changes live after saving (using `webpackHotMiddleware`)
* ES6 Support (`babel-es2015`)
* Production optimization
    * UglifyJs (minimization)
    * Common Chunks
    * Deduplicate
    * CSS, SCSS (SASS), LESS support
    * ESLint linting
    * ... results at the time of writing to a production-build with a total size of `148 kB`
    
