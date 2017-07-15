# simple, clean and minimal
This is a clean example React Project. It has everything you need for a quick and comfortable start into React.

## use it
1) Setup: `npm install`
2) development-server: `npm start` (live-server should be accessible at  `https://0.0.0.0:8080`) (your browser may require you to "trust" this custom ssl certifcate)
3) production build: `npm run production`
(Production build will be in projects sub-folder `bunde` - just copy everything in there to your 
web-server and browser to `index.html`)

## features

* Hot Building: view your changes live after saving (using `webpackHotMiddleware`)
* ES6 Support (`babel-es2015`)
* Production optimization
    * UglifyJs (minimization)
    * Common Chunks
    * Deduplicate
    * CSS, SCSS (SASS), LESS support
    * ESLint linting
    * ... results at the time of writing to a production-build with a total size of `244 kB`
    
