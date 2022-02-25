// const updatedConfig = {
//   parallelism: undefined,
//   externals: [
//     "next",
//   ],
//   optimization: {
//     emitOnErrors: false,
//     checkWasmTypes: false,
//     nodeEnv: false,
//     splitChunks: false,
//     runtimeChunk: {
//       name: "webpack",
//     },
//     minimize: false,
//     minimizer: [
//       (compiler)=>{
//         // @ts-ignore No typings yet
//         const { TerserPlugin ,  } = require('./webpack/plugins/terser-webpack-plugin/src/index.js');
//         new TerserPlugin({
//             cacheDir: _path.default.join(distDir, 'cache', 'next-minifier'),
//             parallel: config.experimental.cpus,
//             swcMinify: config.swcMinify,
//             terserOptions
//         }).apply(compiler);
//       },
//       (compiler)=>{
//         const { CssMinimizerPlugin ,  } = require('./webpack/plugins/css-minimizer-plugin');
//         new CssMinimizerPlugin({
//             postcssOptions: {
//                 map: {
//                     // `inline: false` generates the source map in a separate file.
//                     // Otherwise, the CSS file is needlessly large.
//                     inline: false,
//                     // `annotation: false` skips appending the `sourceMappingURL`
//                     // to the end of the CSS file. Webpack already handles this.
//                     annotation: false
//                 }
//             }
//         }).apply(compiler);
//       },
//     ],
//     providedExports: false,
//     usedExports: false,
//   },
//   context: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app",
//   entry: async ()=>{
//     return {
//         ...clientEntries ? clientEntries : {
//         },
//         ...entrypoints
//     };
//   },
//   watchOptions: {
//     aggregateTimeout: 5,
//     ignored: [
//       "**/.git/**",
//       "**/node_modules/**",
//       "**/.next/**",
//     ],
//   },
//   output: {
//     publicPath: "/_next/",
//     path: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\.next",
//     filename: "static/chunks/[name].js",
//     library: "_N_E",
//     libraryTarget: "assign",
//     hotUpdateChunkFilename: "static/webpack/[id].[fullhash].hot-update.js",
//     hotUpdateMainFilename: "static/webpack/[fullhash].[runtime].hot-update.json",
//     chunkFilename: "static/chunks/[name].js",
//     strictModuleExceptionHandling: true,
//     crossOriginLoading: undefined,
//     webassemblyModuleFilename: "static/wasm/[modulehash].wasm",
//     hashFunction: "xxhash64",
//     hashDigestLength: 16,
//     enabledLibraryTypes: [
//       "assign",
//     ],
//   },
//   performance: false,
//   resolve: {
//     extensions: [
//       ".mjs",
//       ".js",
//       ".tsx",
//       ".ts",
//       ".jsx",
//       ".json",
//       ".wasm",
//     ],
//     modules: [
//       "node_modules",
//     ],
//     alias: {
//       next: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next",
//       "private-next-pages/_app": [
//         "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\pages\\_app.tsx",
//         "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\pages\\_app.ts",
//         "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\pages\\_app.jsx",
//         "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\pages\\_app.js",
//         "next/dist/pages/_app.js",
//       ],
//       "private-next-pages/_error": [
//         "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\pages\\_error.tsx",
//         "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\pages\\_error.ts",
//         "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\pages\\_error.jsx",
//         "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\pages\\_error.js",
//         "next/dist/pages/_error.js",
//       ],
//       "private-next-pages/_document": [
//         "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\pages\\_document.tsx",
//         "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\pages\\_document.ts",
//         "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\pages\\_document.jsx",
//         "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\pages\\_document.js",
//         "next/dist/pages/_document.js",
//       ],
//       "private-next-pages": "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\pages",
//       "private-dot-next": "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\.next",
//       unfetch$: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\polyfills\\fetch\\index.js",
//       "isomorphic-unfetch$": "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\polyfills\\fetch\\index.js",
//       "whatwg-fetch$": "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\polyfills\\fetch\\whatwg-fetch.js",
//       "object-assign$": "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\polyfills\\object-assign.js",
//       "object.assign/auto": "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\polyfills\\object.assign\\auto.js",
//       "object.assign/implementation": "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\polyfills\\object.assign\\implementation.js",
//       "object.assign$": "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\polyfills\\object.assign\\index.js",
//       "object.assign/polyfill": "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\polyfills\\object.assign\\polyfill.js",
//       "object.assign/shim": "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\polyfills\\object.assign\\shim.js",
//       url: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\compiled\\native-url\\index.js",
//       "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\shared\\lib\\router\\utils\\resolve-rewrites.js": false,
//       setimmediate: "next/dist/compiled/setimmediate",
//     },
//     fallback: {
//       assert: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\compiled\\assert\\assert.js",
//       buffer: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\compiled\\buffer\\index.js",
//       constants: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\compiled\\constants-browserify\\constants.json",
//       crypto: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\compiled\\crypto-browserify\\index.js",
//       domain: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\compiled\\domain-browser\\index.js",
//       http: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\compiled\\stream-http\\index.js",
//       https: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\compiled\\https-browserify\\index.js",
//       os: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\compiled\\os-browserify\\browser.js",
//       path: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\compiled\\path-browserify\\index.js",
//       punycode: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\compiled\\punycode\\punycode.js",
//       process: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\polyfills\\process.js",
//       querystring: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\compiled\\querystring-es3\\index.js",
//       stream: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\compiled\\stream-browserify\\index.js",
//       string_decoder: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\compiled\\string_decoder\\string_decoder.js",
//       sys: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\compiled\\util\\util.js",
//       timers: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\compiled\\timers-browserify\\main.js",
//       tty: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\compiled\\tty-browserify\\index.js",
//       util: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\compiled\\util\\util.js",
//       vm: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\compiled\\vm-browserify\\index.js",
//       zlib: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\compiled\\browserify-zlib\\index.js",
//       events: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\compiled\\events\\events.js",
//       setImmediate: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\compiled\\setimmediate\\setImmediate.js",
//     },
//     mainFields: [
//       "browser",
//       "module",
//       "main",
//     ],
//     plugins: [
//     ],
//   },
//   resolveLoader: {
//     alias: {
//       "error-loader": "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\webpack\\loaders\\error-loader",
//       "next-swc-loader": "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\webpack\\loaders\\next-swc-loader",
//       "next-client-pages-loader": "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\webpack\\loaders\\next-client-pages-loader",
//       "next-image-loader": "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\webpack\\loaders\\next-image-loader",
//       "next-serverless-loader": "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\webpack\\loaders\\next-serverless-loader",
//       "next-style-loader": "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\webpack\\loaders\\next-style-loader",
//       "next-flight-client-loader": "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\webpack\\loaders\\next-flight-client-loader",
//       "next-flight-server-loader": "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\webpack\\loaders\\next-flight-server-loader",
//       "noop-loader": "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\webpack\\loaders\\noop-loader",
//       "next-middleware-loader": "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\webpack\\loaders\\next-middleware-loader",
//       "next-middleware-ssr-loader": "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\webpack\\loaders\\next-middleware-ssr-loader",
//     },
//     modules: [
//       "node_modules",
//     ],
//     plugins: [
//     ],
//   },
//   module: {
//     rules: [
//       {
//         test: {
//         },
//         resolve: {
//           fullySpecified: false,
//         },
//       },
//       {
//         test: {
//         },
//         issuerLayer: "api",
//         parser: {
//           url: true,
//         },
//       },
//       {
//         oneOf: [
//           {
//             test: {
//             },
//             include: [
//               "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app",
//               {
//               },
//               {
//               },
//               {
//               },
//               {
//               },
//             ],
//             exclude: (excludePath)=>{
//               if (babelIncludeRegexes.some((r)=>r.test(excludePath)
//               )) {
//                   return false;
//               }
//               return /node_modules/.test(excludePath);
//             },
//             issuerLayer: "api",
//             parser: {
//               url: true,
//             },
//             use: {
//               loader: "next-swc-loader",
//               options: {
//                 isServer: false,
//                 pagesDir: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\pages",
//                 hasReactRefresh: true,
//                 fileReading: true,
//                 nextConfig: {
//                   env: {
//                   },
//                   webpack: (config, options) => {
//                     config.module.rules.push({
//                       test: /\.mdx/,
//                       use: [
//                         options.defaultLoaders.babel,
//                         {
//                           loader: '@mdx-js/loader',
//                           options: pluginOptions.options,
//                         },
//                       ],
//                     });

//                     return config;
//                   },
//                   webpackDevMiddleware: null,
//                   eslint: {
//                     ignoreDuringBuilds: false,
//                   },
//                   typescript: {
//                     ignoreBuildErrors: false,
//                     tsconfigPath: "tsconfig.json",
//                   },
//                   distDir: ".next",
//                   cleanDistDir: true,
//                   assetPrefix: "",
//                   configOrigin: "next.config.js",
//                   useFileSystemPublicRoutes: true,
//                   generateBuildId: ()=>null,
//                   generateEtags: true,
//                   pageExtensions: [
//                     "tsx",
//                     "ts",
//                     "jsx",
//                     "js",
//                   ],
//                   target: "server",
//                   poweredByHeader: true,
//                   compress: true,
//                   analyticsId: "",
//                   images: {
//                     deviceSizes: [
//                       640,
//                       750,
//                       828,
//                       1080,
//                       1200,
//                       1920,
//                       2048,
//                       3840,
//                     ],
//                     imageSizes: [
//                       16,
//                       32,
//                       48,
//                       64,
//                       96,
//                       128,
//                       256,
//                       384,
//                     ],
//                     path: "/_next/image",
//                     loader: "default",
//                     domains: [
//                     ],
//                     disableStaticImages: false,
//                     minimumCacheTTL: 60,
//                     formats: [
//                       "image/webp",
//                     ],
//                     dangerouslyAllowSVG: false,
//                     contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;",
//                   },
//                   devIndicators: {
//                     buildActivity: true,
//                     buildActivityPosition: "bottom-right",
//                   },
//                   onDemandEntries: {
//                     maxInactiveAge: 15000,
//                     pagesBufferLength: 2,
//                   },
//                   amp: {
//                     canonicalBase: "",
//                   },
//                   basePath: "",
//                   sassOptions: {
//                   },
//                   trailingSlash: false,
//                   i18n: null,
//                   productionBrowserSourceMaps: false,
//                   optimizeFonts: true,
//                   webpack5: undefined,
//                   excludeDefaultMomentLocales: true,
//                   serverRuntimeConfig: {
//                   },
//                   publicRuntimeConfig: {
//                   },
//                   reactStrictMode: false,
//                   httpAgentOptions: {
//                     keepAlive: true,
//                   },
//                   outputFileTracing: true,
//                   staticPageGenerationTimeout: 60,
//                   swcMinify: false,
//                   experimental: {
//                     cpus: 7,
//                     sharedPool: true,
//                     plugins: false,
//                     profiling: false,
//                     isrFlushToDisk: true,
//                     workerThreads: false,
//                     pageEnv: false,
//                     optimizeCss: false,
//                     scrollRestoration: false,
//                     externalDir: false,
//                     reactRoot: false,
//                     disableOptimizedLoading: false,
//                     gzipSize: true,
//                     swcFileReading: true,
//                     craCompat: false,
//                     esmExternals: true,
//                     isrMemoryCacheSize: 52428800,
//                     serverComponents: false,
//                     fullySpecified: false,
//                     outputFileTracingRoot: "",
//                     outputStandalone: false,
//                   },
//                   configFile: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\next.config.js",
//                   configFileName: "next.config.js",
//                 },
//                 jsConfig: {
//                   compilerOptions: {
//                     target: 1,
//                     lib: [
//                       "lib.dom.d.ts",
//                       "lib.dom.iterable.d.ts",
//                       "lib.esnext.d.ts",
//                     ],
//                     allowJs: true,
//                     skipLibCheck: true,
//                     strict: true,
//                     forceConsistentCasingInFileNames: true,
//                     noEmit: true,
//                     esModuleInterop: true,
//                     module: 99,
//                     moduleResolution: 2,
//                     resolveJsonModule: true,
//                     isolatedModules: true,
//                     jsx: 1,
//                     incremental: true,
//                     configFilePath: undefined,
//                   },
//                 },
//               },
//             },
//           },
//           {
//             test: {
//             },
//             include: [
//               "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app",
//               {
//               },
//               {
//               },
//               {
//               },
//               {
//               },
//             ],
//             exclude: (excludePath)=>{
//               if (babelIncludeRegexes.some((r)=>r.test(excludePath)
//               )) {
//                   return false;
//               }
//               return /node_modules/.test(excludePath);
//             },
//             issuerLayer: "middleware",
//             use: {
//               loader: "next-swc-loader",
//               options: {
//                 isServer: true,
//                 pagesDir: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\pages",
//                 hasReactRefresh: false,
//                 fileReading: true,
//                 nextConfig: {
//                   env: {
//                   },
//                   webpack: (config, options) => {
//                     config.module.rules.push({
//                       test: /\.mdx/,
//                       use: [
//                         options.defaultLoaders.babel,
//                         {
//                           loader: '@mdx-js/loader',
//                           options: pluginOptions.options,
//                         },
//                       ],
//                     });

//                     return config;
//                   },
//                   webpackDevMiddleware: null,
//                   eslint: {
//                     ignoreDuringBuilds: false,
//                   },
//                   typescript: {
//                     ignoreBuildErrors: false,
//                     tsconfigPath: "tsconfig.json",
//                   },
//                   distDir: ".next",
//                   cleanDistDir: true,
//                   assetPrefix: "",
//                   configOrigin: "next.config.js",
//                   useFileSystemPublicRoutes: true,
//                   generateBuildId: ()=>null,
//                   generateEtags: true,
//                   pageExtensions: [
//                     "tsx",
//                     "ts",
//                     "jsx",
//                     "js",
//                   ],
//                   target: "server",
//                   poweredByHeader: true,
//                   compress: true,
//                   analyticsId: "",
//                   images: {
//                     deviceSizes: [
//                       640,
//                       750,
//                       828,
//                       1080,
//                       1200,
//                       1920,
//                       2048,
//                       3840,
//                     ],
//                     imageSizes: [
//                       16,
//                       32,
//                       48,
//                       64,
//                       96,
//                       128,
//                       256,
//                       384,
//                     ],
//                     path: "/_next/image",
//                     loader: "default",
//                     domains: [
//                     ],
//                     disableStaticImages: false,
//                     minimumCacheTTL: 60,
//                     formats: [
//                       "image/webp",
//                     ],
//                     dangerouslyAllowSVG: false,
//                     contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;",
//                   },
//                   devIndicators: {
//                     buildActivity: true,
//                     buildActivityPosition: "bottom-right",
//                   },
//                   onDemandEntries: {
//                     maxInactiveAge: 15000,
//                     pagesBufferLength: 2,
//                   },
//                   amp: {
//                     canonicalBase: "",
//                   },
//                   basePath: "",
//                   sassOptions: {
//                   },
//                   trailingSlash: false,
//                   i18n: null,
//                   productionBrowserSourceMaps: false,
//                   optimizeFonts: true,
//                   webpack5: undefined,
//                   excludeDefaultMomentLocales: true,
//                   serverRuntimeConfig: {
//                   },
//                   publicRuntimeConfig: {
//                   },
//                   reactStrictMode: false,
//                   httpAgentOptions: {
//                     keepAlive: true,
//                   },
//                   outputFileTracing: true,
//                   staticPageGenerationTimeout: 60,
//                   swcMinify: false,
//                   experimental: {
//                     cpus: 7,
//                     sharedPool: true,
//                     plugins: false,
//                     profiling: false,
//                     isrFlushToDisk: true,
//                     workerThreads: false,
//                     pageEnv: false,
//                     optimizeCss: false,
//                     scrollRestoration: false,
//                     externalDir: false,
//                     reactRoot: false,
//                     disableOptimizedLoading: false,
//                     gzipSize: true,
//                     swcFileReading: true,
//                     craCompat: false,
//                     esmExternals: true,
//                     isrMemoryCacheSize: 52428800,
//                     serverComponents: false,
//                     fullySpecified: false,
//                     outputFileTracingRoot: "",
//                     outputStandalone: false,
//                   },
//                   configFile: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\next.config.js",
//                   configFileName: "next.config.js",
//                 },
//                 jsConfig: {
//                   compilerOptions: {
//                     target: 1,
//                     lib: [
//                       "lib.dom.d.ts",
//                       "lib.dom.iterable.d.ts",
//                       "lib.esnext.d.ts",
//                     ],
//                     allowJs: true,
//                     skipLibCheck: true,
//                     strict: true,
//                     forceConsistentCasingInFileNames: true,
//                     noEmit: true,
//                     esModuleInterop: true,
//                     module: 99,
//                     moduleResolution: 2,
//                     resolveJsonModule: true,
//                     isolatedModules: true,
//                     jsx: 1,
//                     incremental: true,
//                     configFilePath: undefined,
//                   },
//                 },
//               },
//             },
//           },
//           {
//             test: {
//             },
//             include: [
//               "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app",
//               {
//               },
//               {
//               },
//               {
//               },
//               {
//               },
//             ],
//             exclude: (excludePath)=>{
//               if (babelIncludeRegexes.some((r)=>r.test(excludePath)
//               )) {
//                   return false;
//               }
//               return /node_modules/.test(excludePath);
//             },
//             use: [
//               "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\compiled\\@next\\react-refresh-utils\\loader.js",
//               {
//                 loader: "next-swc-loader",
//                 options: {
//                   isServer: false,
//                   pagesDir: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\pages",
//                   hasReactRefresh: true,
//                   fileReading: true,
//                   nextConfig: {
//                     env: {
//                     },
//                     webpack: (config, options) => {
//                       config.module.rules.push({
//                         test: /\.mdx/,
//                         use: [
//                           options.defaultLoaders.babel,
//                           {
//                             loader: '@mdx-js/loader',
//                             options: pluginOptions.options,
//                           },
//                         ],
//                       });

//                       return config;
//                     },
//                     webpackDevMiddleware: null,
//                     eslint: {
//                       ignoreDuringBuilds: false,
//                     },
//                     typescript: {
//                       ignoreBuildErrors: false,
//                       tsconfigPath: "tsconfig.json",
//                     },
//                     distDir: ".next",
//                     cleanDistDir: true,
//                     assetPrefix: "",
//                     configOrigin: "next.config.js",
//                     useFileSystemPublicRoutes: true,
//                     generateBuildId: ()=>null,
//                     generateEtags: true,
//                     pageExtensions: [
//                       "tsx",
//                       "ts",
//                       "jsx",
//                       "js",
//                     ],
//                     target: "server",
//                     poweredByHeader: true,
//                     compress: true,
//                     analyticsId: "",
//                     images: {
//                       deviceSizes: [
//                         640,
//                         750,
//                         828,
//                         1080,
//                         1200,
//                         1920,
//                         2048,
//                         3840,
//                       ],
//                       imageSizes: [
//                         16,
//                         32,
//                         48,
//                         64,
//                         96,
//                         128,
//                         256,
//                         384,
//                       ],
//                       path: "/_next/image",
//                       loader: "default",
//                       domains: [
//                       ],
//                       disableStaticImages: false,
//                       minimumCacheTTL: 60,
//                       formats: [
//                         "image/webp",
//                       ],
//                       dangerouslyAllowSVG: false,
//                       contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;",
//                     },
//                     devIndicators: {
//                       buildActivity: true,
//                       buildActivityPosition: "bottom-right",
//                     },
//                     onDemandEntries: {
//                       maxInactiveAge: 15000,
//                       pagesBufferLength: 2,
//                     },
//                     amp: {
//                       canonicalBase: "",
//                     },
//                     basePath: "",
//                     sassOptions: {
//                     },
//                     trailingSlash: false,
//                     i18n: null,
//                     productionBrowserSourceMaps: false,
//                     optimizeFonts: true,
//                     webpack5: undefined,
//                     excludeDefaultMomentLocales: true,
//                     serverRuntimeConfig: {
//                     },
//                     publicRuntimeConfig: {
//                     },
//                     reactStrictMode: false,
//                     httpAgentOptions: {
//                       keepAlive: true,
//                     },
//                     outputFileTracing: true,
//                     staticPageGenerationTimeout: 60,
//                     swcMinify: false,
//                     experimental: {
//                       cpus: 7,
//                       sharedPool: true,
//                       plugins: false,
//                       profiling: false,
//                       isrFlushToDisk: true,
//                       workerThreads: false,
//                       pageEnv: false,
//                       optimizeCss: false,
//                       scrollRestoration: false,
//                       externalDir: false,
//                       reactRoot: false,
//                       disableOptimizedLoading: false,
//                       gzipSize: true,
//                       swcFileReading: true,
//                       craCompat: false,
//                       esmExternals: true,
//                       isrMemoryCacheSize: 52428800,
//                       serverComponents: false,
//                       fullySpecified: false,
//                       outputFileTracingRoot: "",
//                       outputStandalone: false,
//                     },
//                     configFile: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\next.config.js",
//                     configFileName: "next.config.js",
//                   },
//                   jsConfig: {
//                     compilerOptions: {
//                       target: 1,
//                       lib: [
//                         "lib.dom.d.ts",
//                         "lib.dom.iterable.d.ts",
//                         "lib.esnext.d.ts",
//                       ],
//                       allowJs: true,
//                       skipLibCheck: true,
//                       strict: true,
//                       forceConsistentCasingInFileNames: true,
//                       noEmit: true,
//                       esModuleInterop: true,
//                       module: 99,
//                       moduleResolution: 2,
//                       resolveJsonModule: true,
//                       isolatedModules: true,
//                       jsx: 1,
//                       incremental: true,
//                       configFilePath: undefined,
//                     },
//                   },
//                 },
//               },
//             ],
//           },
//           {
//             test: {
//             },
//             issuer: {
//             },
//             use: {
//               loader: "error-loader",
//               options: {
//                 reason: "CSS \u001b[1mcannot\u001b[22m be imported within \u001b[36mpages/_document.js\u001b[39m. Please move global styles to \u001b[36mpages/_app.js\u001b[39m.",
//               },
//             },
//           },
//           {
//             sideEffects: false,
//             test: {
//             },
//             issuer: {
//               and: [
//                 "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app",
//               ],
//               not: [
//                 {
//                 },
//               ],
//             },
//             use: [
//               {
//                 loader: "next-style-loader",
//                 options: {
//                   insert: function(element) {
//                     // These elements should always exist. If they do not,
//                     // this code should fail.
//                     var anchorElement = document.querySelector('#__next_css__DO_NOT_USE__');
//                     var parentNode = anchorElement.parentNode// Normally <head>
//                     ;
//                     // Each style tag should be placed right before our
//                     // anchor. By inserting before and not after, we do not
//                     // need to track the last inserted element.
//                     parentNode.insertBefore(element, anchorElement);
//                   },
//                 },
//               },
//               {
//                 loader: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\webpack\\loaders\\css-loader\\src\\index.js",
//                 options: {
//                   postcss: function(ctx.rootDirectory, ctx.supportedBrowsers, ctx.experimental.disablePostcssPresetEnv),
//                   importLoaders: 1,
//                   esModule: false,
//                   url: (url, resourcePath)=>(0, _fileResolve).cssFileResolve(url, resourcePath, ctx.experimental.urlImports),
//                   import: (url, _, resourcePath)=>(0, _fileResolve).cssFileResolve(url, resourcePath, ctx.experimental.urlImports),
//                   modules: {
//                     exportLocalsConvention: "asIs",
//                     exportOnlyLocals: false,
//                     mode: "pure",
//                     getLocalIdent: function getCssModuleLocalIdent(context, _, exportName, options) {
//                       const relativePath = _path.default.relative(context.rootContext, context.resourcePath).replace(/\\+/g, '/');
//                       // Generate a more meaningful name (parent folder) when the user names the
//                       // file `index.module.css`.
//                       const fileNameOrFolder = regexLikeIndexModule.test(relativePath) ? '[folder]' : '[name]';
//                       // Generate a hash to make the class name unique.
//                       const hash = _loaderUtils3.default.getHashDigest(Buffer.from(`filePath:${relativePath}#className:${exportName}`), 'md5', 'base64', 5);
//                       // Have webpack interpolate the `[folder]` or `[name]` to its real value.
//                       return(_loaderUtils3.default.interpolateName(context, fileNameOrFolder + '_' + exportName + '__' + hash, options).replace(// Webpack name interpolation returns `about.module_root__2oFM9` for
//                       // `.root {}` inside a file named `about.module.css`. Let's simplify
//                       // this.
//                       /\.module_/, '_')// Replace invalid symbols with underscores instead of escaping
//                       // https://mathiasbynens.be/notes/css-escapes#identifiers-strings
//                       .replace(/[^a-zA-Z0-9-_]/g, '_')// "they cannot start with a digit, two hyphens, or a hyphen followed by a digit [sic]"
//                       // https://www.w3.org/TR/CSS21/syndata.html#characters
//                       .replace(/^(\d|--|-\d)/, '__$1'));
//                     },
//                   },
//                 },
//               },
//               {
//                 loader: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\webpack\\loaders\\postcss-loader\\src\\index.js",
//                 options: {
//                   postcss: function(ctx.rootDirectory, ctx.supportedBrowsers, ctx.experimental.disablePostcssPresetEnv),
//                 },
//               },
//             ],
//           },
//           {
//             sideEffects: false,
//             test: {
//             },
//             issuer: {
//               and: [
//                 "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app",
//               ],
//               not: [
//                 {
//                 },
//               ],
//             },
//             use: [
//               {
//                 loader: "next-style-loader",
//                 options: {
//                   insert: function(element) {
//                     // These elements should always exist. If they do not,
//                     // this code should fail.
//                     var anchorElement = document.querySelector('#__next_css__DO_NOT_USE__');
//                     var parentNode = anchorElement.parentNode// Normally <head>
//                     ;
//                     // Each style tag should be placed right before our
//                     // anchor. By inserting before and not after, we do not
//                     // need to track the last inserted element.
//                     parentNode.insertBefore(element, anchorElement);
//                   },
//                 },
//               },
//               {
//                 loader: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\webpack\\loaders\\css-loader\\src\\index.js",
//                 options: {
//                   postcss: function(ctx.rootDirectory, ctx.supportedBrowsers, ctx.experimental.disablePostcssPresetEnv),
//                   importLoaders: 3,
//                   esModule: false,
//                   url: (url, resourcePath)=>(0, _fileResolve).cssFileResolve(url, resourcePath, ctx.experimental.urlImports),
//                   import: (url, _, resourcePath)=>(0, _fileResolve).cssFileResolve(url, resourcePath, ctx.experimental.urlImports),
//                   modules: {
//                     exportLocalsConvention: "asIs",
//                     exportOnlyLocals: false,
//                     mode: "pure",
//                     getLocalIdent: function getCssModuleLocalIdent(context, _, exportName, options) {
//                       const relativePath = _path.default.relative(context.rootContext, context.resourcePath).replace(/\\+/g, '/');
//                       // Generate a more meaningful name (parent folder) when the user names the
//                       // file `index.module.css`.
//                       const fileNameOrFolder = regexLikeIndexModule.test(relativePath) ? '[folder]' : '[name]';
//                       // Generate a hash to make the class name unique.
//                       const hash = _loaderUtils3.default.getHashDigest(Buffer.from(`filePath:${relativePath}#className:${exportName}`), 'md5', 'base64', 5);
//                       // Have webpack interpolate the `[folder]` or `[name]` to its real value.
//                       return(_loaderUtils3.default.interpolateName(context, fileNameOrFolder + '_' + exportName + '__' + hash, options).replace(// Webpack name interpolation returns `about.module_root__2oFM9` for
//                       // `.root {}` inside a file named `about.module.css`. Let's simplify
//                       // this.
//                       /\.module_/, '_')// Replace invalid symbols with underscores instead of escaping
//                       // https://mathiasbynens.be/notes/css-escapes#identifiers-strings
//                       .replace(/[^a-zA-Z0-9-_]/g, '_')// "they cannot start with a digit, two hyphens, or a hyphen followed by a digit [sic]"
//                       // https://www.w3.org/TR/CSS21/syndata.html#characters
//                       .replace(/^(\d|--|-\d)/, '__$1'));
//                     },
//                   },
//                 },
//               },
//               {
//                 loader: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\webpack\\loaders\\postcss-loader\\src\\index.js",
//                 options: {
//                   postcss: function(ctx.rootDirectory, ctx.supportedBrowsers, ctx.experimental.disablePostcssPresetEnv),
//                 },
//               },
//               {
//                 loader: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\webpack\\loaders\\resolve-url-loader\\index.js",
//                 options: {
//                   postcss: function(ctx.rootDirectory, ctx.supportedBrowsers, ctx.experimental.disablePostcssPresetEnv),
//                   sourceMap: true,
//                 },
//               },
//               {
//                 loader: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\compiled\\sass-loader\\cjs.js",
//                 options: {
//                   sourceMap: true,
//                   sassOptions: {
//                   },
//                   additionalData: undefined,
//                 },
//               },
//             ],
//           },
//           {
//             test: [
//               {
//               },
//               {
//               },
//             ],
//             use: {
//               loader: "error-loader",
//               options: {
//                 reason: "CSS Modules \u001b[1mcannot\u001b[22m be imported from within \u001b[1mnode_modules\u001b[22m.\nRead more: https://nextjs.org/docs/messages/css-modules-npm",
//               },
//             },
//           },
//           {
//             sideEffects: true,
//             test: {
//             },
//             include: {
//               and: [
//                 {
//                 },
//               ],
//             },
//             issuer: {
//               and: [
//                 "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app",
//               ],
//               not: [
//                 {
//                 },
//               ],
//             },
//             use: [
//               {
//                 loader: "next-style-loader",
//                 options: {
//                   insert: function(element) {
//                     // These elements should always exist. If they do not,
//                     // this code should fail.
//                     var anchorElement = document.querySelector('#__next_css__DO_NOT_USE__');
//                     var parentNode = anchorElement.parentNode// Normally <head>
//                     ;
//                     // Each style tag should be placed right before our
//                     // anchor. By inserting before and not after, we do not
//                     // need to track the last inserted element.
//                     parentNode.insertBefore(element, anchorElement);
//                   },
//                 },
//               },
//               {
//                 loader: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\webpack\\loaders\\css-loader\\src\\index.js",
//                 options: {
//                   postcss: function(ctx.rootDirectory, ctx.supportedBrowsers, ctx.experimental.disablePostcssPresetEnv),
//                   importLoaders: 1,
//                   modules: false,
//                   url: (url, resourcePath)=>(0, _fileResolve).cssFileResolve(url, resourcePath, ctx.experimental.urlImports),
//                   import: (url, _, resourcePath)=>(0, _fileResolve).cssFileResolve(url, resourcePath, ctx.experimental.urlImports),
//                 },
//               },
//               {
//                 loader: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\webpack\\loaders\\postcss-loader\\src\\index.js",
//                 options: {
//                   postcss: function(ctx.rootDirectory, ctx.supportedBrowsers, ctx.experimental.disablePostcssPresetEnv),
//                 },
//               },
//             ],
//           },
//           {
//             sideEffects: true,
//             test: {
//             },
//             issuer: {
//               and: [
//                 {
//                 },
//               ],
//             },
//             use: [
//               {
//                 loader: "next-style-loader",
//                 options: {
//                   insert: function(element) {
//                     // These elements should always exist. If they do not,
//                     // this code should fail.
//                     var anchorElement = document.querySelector('#__next_css__DO_NOT_USE__');
//                     var parentNode = anchorElement.parentNode// Normally <head>
//                     ;
//                     // Each style tag should be placed right before our
//                     // anchor. By inserting before and not after, we do not
//                     // need to track the last inserted element.
//                     parentNode.insertBefore(element, anchorElement);
//                   },
//                 },
//               },
//               {
//                 loader: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\webpack\\loaders\\css-loader\\src\\index.js",
//                 options: {
//                   postcss: function(ctx.rootDirectory, ctx.supportedBrowsers, ctx.experimental.disablePostcssPresetEnv),
//                   importLoaders: 1,
//                   modules: false,
//                   url: (url, resourcePath)=>(0, _fileResolve).cssFileResolve(url, resourcePath, ctx.experimental.urlImports),
//                   import: (url, _, resourcePath)=>(0, _fileResolve).cssFileResolve(url, resourcePath, ctx.experimental.urlImports),
//                 },
//               },
//               {
//                 loader: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\webpack\\loaders\\postcss-loader\\src\\index.js",
//                 options: {
//                   postcss: function(ctx.rootDirectory, ctx.supportedBrowsers, ctx.experimental.disablePostcssPresetEnv),
//                 },
//               },
//             ],
//           },
//           {
//             sideEffects: true,
//             test: {
//             },
//             issuer: {
//               and: [
//                 {
//                 },
//               ],
//             },
//             use: [
//               {
//                 loader: "next-style-loader",
//                 options: {
//                   insert: function(element) {
//                     // These elements should always exist. If they do not,
//                     // this code should fail.
//                     var anchorElement = document.querySelector('#__next_css__DO_NOT_USE__');
//                     var parentNode = anchorElement.parentNode// Normally <head>
//                     ;
//                     // Each style tag should be placed right before our
//                     // anchor. By inserting before and not after, we do not
//                     // need to track the last inserted element.
//                     parentNode.insertBefore(element, anchorElement);
//                   },
//                 },
//               },
//               {
//                 loader: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\webpack\\loaders\\css-loader\\src\\index.js",
//                 options: {
//                   postcss: function(ctx.rootDirectory, ctx.supportedBrowsers, ctx.experimental.disablePostcssPresetEnv),
//                   importLoaders: 3,
//                   modules: false,
//                   url: (url, resourcePath)=>(0, _fileResolve).cssFileResolve(url, resourcePath, ctx.experimental.urlImports),
//                   import: (url, _, resourcePath)=>(0, _fileResolve).cssFileResolve(url, resourcePath, ctx.experimental.urlImports),
//                 },
//               },
//               {
//                 loader: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\webpack\\loaders\\postcss-loader\\src\\index.js",
//                 options: {
//                   postcss: function(ctx.rootDirectory, ctx.supportedBrowsers, ctx.experimental.disablePostcssPresetEnv),
//                 },
//               },
//               {
//                 loader: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\webpack\\loaders\\resolve-url-loader\\index.js",
//                 options: {
//                   postcss: function(ctx.rootDirectory, ctx.supportedBrowsers, ctx.experimental.disablePostcssPresetEnv),
//                   sourceMap: true,
//                 },
//               },
//               {
//                 loader: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\compiled\\sass-loader\\cjs.js",
//                 options: {
//                   sourceMap: true,
//                   sassOptions: {
//                   },
//                   additionalData: undefined,
//                 },
//               },
//             ],
//           },
//           {
//             test: [
//               {
//               },
//               {
//               },
//             ],
//             issuer: {
//               and: [
//                 {
//                 },
//               ],
//             },
//             use: {
//               loader: "error-loader",
//               options: {
//                 reason: "Global CSS \u001b[1mcannot\u001b[22m be imported from within \u001b[1mnode_modules\u001b[22m.\nRead more: https://nextjs.org/docs/messages/css-npm",
//               },
//             },
//           },
//           {
//             test: [
//               {
//               },
//               {
//               },
//             ],
//             use: {
//               loader: "error-loader",
//               options: {
//                 reason: "Global CSS \u001b[1mcannot\u001b[22m be imported from files other than your \u001b[1mCustom <App>\u001b[22m. Due to the Global nature of stylesheets, and to avoid conflicts, Please move all first-party global CSS imports to \u001b[36mpages/_app.js\u001b[39m. Or convert the import to Component-Level CSS (CSS Modules).\nRead more: https://nextjs.org/docs/messages/css-global",
//               },
//             },
//           },
//           {
//             issuer: {
//             },
//             exclude: [
//               {
//               },
//               {
//               },
//               {
//               },
//               {
//               },
//             ],
//             type: "asset/resource",
//           },
//           {
//             test: {
//             },
//             use: {
//               loader: "error-loader",
//               options: {
//                 reason: "Images \u001b[1mcannot\u001b[22m be imported within \u001b[36mpages/_document.js\u001b[39m. Please move image imports that need to be displayed on every page into \u001b[36mpages/_app.js\u001b[39m.\nRead more: https://nextjs.org/docs/messages/custom-document-image-import",
//               },
//             },
//             issuer: {
//             },
//           },
//         ],
//       },
//       {
//         test: {
//         },
//         loader: "next-image-loader",
//         issuer: {
//           not: {
//           },
//         },
//         dependency: {
//           not: [
//             "url",
//           ],
//         },
//         options: {
//           isServer: false,
//           isDev: true,
//           basePath: "",
//           assetPrefix: "",
//         },
//       },
//     ],
//     parser: {
//       javascript: {
//         url: "relative",
//       },
//     },
//     generator: {
//       asset: {
//         filename: "static/media/[name].[hash:8][ext]",
//       },
//     },
//     unsafeCache: function(module.resource),
//   },
//   plugins: [
//     {
//       webpackMajorVersion: 5,
//       RuntimeGlobals: {
//         require: "__webpack_require__",
//         requireScope: "__webpack_require__.*",
//         exports: "__webpack_exports__",
//         thisAsExports: "top-level-this-exports",
//         returnExportsFromRuntime: "return-exports-from-runtime",
//         module: "module",
//         moduleId: "module.id",
//         moduleLoaded: "module.loaded",
//         publicPath: "__webpack_require__.p",
//         entryModuleId: "__webpack_require__.s",
//         moduleCache: "__webpack_require__.c",
//         moduleFactories: "__webpack_require__.m",
//         moduleFactoriesAddOnly: "__webpack_require__.m (add only)",
//         ensureChunk: "__webpack_require__.e",
//         ensureChunkHandlers: "__webpack_require__.f",
//         ensureChunkIncludeEntries: "__webpack_require__.f (include entries)",
//         prefetchChunk: "__webpack_require__.E",
//         prefetchChunkHandlers: "__webpack_require__.F",
//         preloadChunk: "__webpack_require__.G",
//         preloadChunkHandlers: "__webpack_require__.H",
//         definePropertyGetters: "__webpack_require__.d",
//         makeNamespaceObject: "__webpack_require__.r",
//         createFakeNamespaceObject: "__webpack_require__.t",
//         compatGetDefaultExport: "__webpack_require__.n",
//         harmonyModuleDecorator: "__webpack_require__.hmd",
//         nodeModuleDecorator: "__webpack_require__.nmd",
//         getFullHash: "__webpack_require__.h",
//         wasmInstances: "__webpack_require__.w",
//         instantiateWasm: "__webpack_require__.v",
//         uncaughtErrorHandler: "__webpack_require__.oe",
//         scriptNonce: "__webpack_require__.nc",
//         loadScript: "__webpack_require__.l",
//         createScript: "__webpack_require__.ts",
//         createScriptUrl: "__webpack_require__.tu",
//         getTrustedTypesPolicy: "__webpack_require__.tt",
//         chunkName: "__webpack_require__.cn",
//         runtimeId: "__webpack_require__.j",
//         getChunkScriptFilename: "__webpack_require__.u",
//         getChunkCssFilename: "__webpack_require__.k",
//         hasCssModules: "has css modules",
//         getChunkUpdateScriptFilename: "__webpack_require__.hu",
//         getChunkUpdateCssFilename: "__webpack_require__.hk",
//         startup: "__webpack_require__.x",
//         startupNoDefault: "__webpack_require__.x (no default handler)",
//         startupOnlyAfter: "__webpack_require__.x (only after)",
//         startupOnlyBefore: "__webpack_require__.x (only before)",
//         chunkCallback: "webpackChunk",
//         startupEntrypoint: "__webpack_require__.X",
//         onChunksLoaded: "__webpack_require__.O",
//         externalInstallChunk: "__webpack_require__.C",
//         interceptModuleExecution: "__webpack_require__.i",
//         global: "__webpack_require__.g",
//         shareScopeMap: "__webpack_require__.S",
//         initializeSharing: "__webpack_require__.I",
//         currentRemoteGetScope: "__webpack_require__.R",
//         getUpdateManifestFilename: "__webpack_require__.hmrF",
//         hmrDownloadManifest: "__webpack_require__.hmrM",
//         hmrDownloadUpdateHandlers: "__webpack_require__.hmrC",
//         hmrModuleData: "__webpack_require__.hmrD",
//         hmrInvalidateModuleHandlers: "__webpack_require__.hmrI",
//         hmrRuntimeStatePrefix: "__webpack_require__.hmrS",
//         amdDefine: "__webpack_require__.amdD",
//         amdOptions: "__webpack_require__.amdO",
//         system: "__webpack_require__.System",
//         hasOwnProperty: "__webpack_require__.o",
//         systemContext: "__webpack_require__.y",
//         baseURI: "__webpack_require__.b",
//         relativeUrl: "__webpack_require__.U",
//         asyncModule: "__webpack_require__.a",
//       },
//       RuntimeModule: class RuntimeModule extends Module {
//         /**
//          * @param {string} name a readable name
//          * @param {number=} stage an optional stage
//          */
//         constructor(name, stage = 0) {
//         	super("runtime");
//         	this.name = name;
//         	this.stage = stage;
//         	this.buildMeta = {};
//         	this.buildInfo = {};
//         	/** @type {Compilation} */
//         	this.compilation = undefined;
//         	/** @type {Chunk} */
//         	this.chunk = undefined;
//         	/** @type {ChunkGraph} */
//         	this.chunkGraph = undefined;
//         	this.fullHash = false;
//         	this.dependentHash = false;
//         	/** @type {string} */
//         	this._cachedGeneratedCode = undefined;
//         }

//         /**
//          * @param {Compilation} compilation the compilation
//          * @param {Chunk} chunk the chunk
//          * @param {ChunkGraph} chunkGraph the chunk graph
//          * @returns {void}
//          */
//         attach(compilation, chunk, chunkGraph = compilation.chunkGraph) {
//         	this.compilation = compilation;
//         	this.chunk = chunk;
//         	this.chunkGraph = chunkGraph;
//         }

//         /**
//          * @returns {string} a unique identifier of the module
//          */
//         identifier() {
//         	return `webpack/runtime/${this.name}`;
//         }

//         /**
//          * @param {RequestShortener} requestShortener the request shortener
//          * @returns {string} a user readable identifier of the module
//          */
//         readableIdentifier(requestShortener) {
//         	return `webpack/runtime/${this.name}`;
//         }

//         /**
//          * @param {NeedBuildContext} context context info
//          * @param {function((WebpackError | null)=, boolean=): void} callback callback function, returns true, if the module needs a rebuild
//          * @returns {void}
//          */
//         needBuild(context, callback) {
//         	return callback(null, false);
//         }

//         /**
//          * @param {WebpackOptions} options webpack options
//          * @param {Compilation} compilation the compilation
//          * @param {ResolverWithOptions} resolver the resolver
//          * @param {InputFileSystem} fs the file system
//          * @param {function(WebpackError=): void} callback callback function
//          * @returns {void}
//          */
//         build(options, compilation, resolver, fs, callback) {
//         	// do nothing
//         	// should not be called as runtime modules are added later to the compilation
//         	callback();
//         }

//         /**
//          * @param {Hash} hash the hash used to track dependencies
//          * @param {UpdateHashContext} context context
//          * @returns {void}
//          */
//         updateHash(hash, context) {
//         	hash.update(this.name);
//         	hash.update(`${this.stage}`);
//         	try {
//         		if (this.fullHash || this.dependentHash) {
//         			// Do not use getGeneratedCode here, because i. e. compilation hash might be not
//         			// ready at this point. We will cache it later instead.
//         			hash.update(this.generate());
//         		} else {
//         			hash.update(this.getGeneratedCode());
//         		}
//         	} catch (err) {
//         		hash.update(err.message);
//         	}
//         	super.updateHash(hash, context);
//         }

//         /**
//          * @returns {Set<string>} types available (do not mutate)
//          */
//         getSourceTypes() {
//         	return TYPES;
//         }

//         /**
//          * @param {CodeGenerationContext} context context for code generation
//          * @returns {CodeGenerationResult} result
//          */
//         codeGeneration(context) {
//         	const sources = new Map();
//         	const generatedCode = this.getGeneratedCode();
//         	if (generatedCode) {
//         		sources.set(
//         			"runtime",
//         			this.useSourceMap || this.useSimpleSourceMap
//         				? new OriginalSource(generatedCode, this.identifier())
//         				: new RawSource(generatedCode)
//         		);
//         	}
//         	return {
//         		sources,
//         		runtimeRequirements: null
//         	};
//         }

//         /**
//          * @param {string=} type the source type for which the size should be estimated
//          * @returns {number} the estimated size of the module (must be non-zero)
//          */
//         size(type) {
//         	try {
//         		const source = this.getGeneratedCode();
//         		return source ? source.length : 0;
//         	} catch (e) {
//         		return 0;
//         	}
//         }

//         /* istanbul ignore next */
//         /**
//          * @abstract
//          * @returns {string} runtime code
//          */
//         generate() {
//         	const AbstractMethodError = __webpack_require__(77198);
//         	throw new AbstractMethodError();
//         }

//         /**
//          * @returns {string} runtime code
//          */
//         getGeneratedCode() {
//         	if (this._cachedGeneratedCode) {
//         		return this._cachedGeneratedCode;
//         	}
//         	return (this._cachedGeneratedCode = this.generate());
//         }

//         /**
//          * @returns {boolean} true, if the runtime module should get it's own scope
//          */
//         shouldIsolate() {
//         	return true;
//         }
//       },
//       Template: class Template {
//         /**
//          *
//          * @param {Function} fn a runtime function (.runtime.js) "template"
//          * @returns {string} the updated and normalized function string
//          */
//         static getFunctionContent(fn) {
//         	return fn
//         		.toString()
//         		.replace(FUNCTION_CONTENT_REGEX, "")
//         		.replace(INDENT_MULTILINE_REGEX, "")
//         		.replace(LINE_SEPARATOR_REGEX, "\n");
//         }

//         /**
//          * @param {string} str the string converted to identifier
//          * @returns {string} created identifier
//          */
//         static toIdentifier(str) {
//         	if (typeof str !== "string") return "";
//         	return str
//         		.replace(IDENTIFIER_NAME_REPLACE_REGEX, "_$1")
//         		.replace(IDENTIFIER_ALPHA_NUMERIC_NAME_REPLACE_REGEX, "_");
//         }
//         /**
//          *
//          * @param {string} str string to be converted to commented in bundle code
//          * @returns {string} returns a commented version of string
//          */
//         static toComment(str) {
//         	if (!str) return "";
//         	return `/*! ${str.replace(COMMENT_END_REGEX, "* /")} */`;
//         }

//         /**
//          *
//          * @param {string} str string to be converted to "normal comment"
//          * @returns {string} returns a commented version of string
//          */
//         static toNormalComment(str) {
//         	if (!str) return "";
//         	return `/* ${str.replace(COMMENT_END_REGEX, "* /")} */`;
//         }

//         /**
//          * @param {string} str string path to be normalized
//          * @returns {string} normalized bundle-safe path
//          */
//         static toPath(str) {
//         	if (typeof str !== "string") return "";
//         	return str
//         		.replace(PATH_NAME_NORMALIZE_REPLACE_REGEX, "-")
//         		.replace(MATCH_PADDED_HYPHENS_REPLACE_REGEX, "");
//         }

//         // map number to a single character a-z, A-Z or multiple characters if number is too big
//         /**
//          * @param {number} n number to convert to ident
//          * @returns {string} returns single character ident
//          */
//         static numberToIdentifier(n) {
//         	if (n >= NUMBER_OF_IDENTIFIER_START_CHARS) {
//         		// use multiple letters
//         		return (
//         			Template.numberToIdentifier(n % NUMBER_OF_IDENTIFIER_START_CHARS) +
//         			Template.numberToIdentifierContinuation(
//         				Math.floor(n / NUMBER_OF_IDENTIFIER_START_CHARS)
//         			)
//         		);
//         	}

//         	// lower case
//         	if (n < DELTA_A_TO_Z) {
//         		return String.fromCharCode(START_LOWERCASE_ALPHABET_CODE + n);
//         	}
//         	n -= DELTA_A_TO_Z;

//         	// upper case
//         	if (n < DELTA_A_TO_Z) {
//         		return String.fromCharCode(START_UPPERCASE_ALPHABET_CODE + n);
//         	}

//         	if (n === DELTA_A_TO_Z) return "_";
//         	return "$";
//         }

//         /**
//          * @param {number} n number to convert to ident
//          * @returns {string} returns single character ident
//          */
//         static numberToIdentifierContinuation(n) {
//         	if (n >= NUMBER_OF_IDENTIFIER_CONTINUATION_CHARS) {
//         		// use multiple letters
//         		return (
//         			Template.numberToIdentifierContinuation(
//         				n % NUMBER_OF_IDENTIFIER_CONTINUATION_CHARS
//         			) +
//         			Template.numberToIdentifierContinuation(
//         				Math.floor(n / NUMBER_OF_IDENTIFIER_CONTINUATION_CHARS)
//         			)
//         		);
//         	}

//         	// lower case
//         	if (n < DELTA_A_TO_Z) {
//         		return String.fromCharCode(START_LOWERCASE_ALPHABET_CODE + n);
//         	}
//         	n -= DELTA_A_TO_Z;

//         	// upper case
//         	if (n < DELTA_A_TO_Z) {
//         		return String.fromCharCode(START_UPPERCASE_ALPHABET_CODE + n);
//         	}
//         	n -= DELTA_A_TO_Z;

//         	// numbers
//         	if (n < 10) {
//         		return `${n}`;
//         	}

//         	if (n === 10) return "_";
//         	return "$";
//         }

//         /**
//          *
//          * @param {string | string[]} s string to convert to identity
//          * @returns {string} converted identity
//          */
//         static indent(s) {
//         	if (Array.isArray(s)) {
//         		return s.map(Template.indent).join("\n");
//         	} else {
//         		const str = s.trimRight();
//         		if (!str) return "";
//         		const ind = str[0] === "\n" ? "" : "\t";
//         		return ind + str.replace(/\n([^\n])/g, "\n\t$1");
//         	}
//         }

//         /**
//          *
//          * @param {string|string[]} s string to create prefix for
//          * @param {string} prefix prefix to compose
//          * @returns {string} returns new prefix string
//          */
//         static prefix(s, prefix) {
//         	const str = Template.asString(s).trim();
//         	if (!str) return "";
//         	const ind = str[0] === "\n" ? "" : prefix;
//         	return ind + str.replace(/\n([^\n])/g, "\n" + prefix + "$1");
//         }

//         /**
//          *
//          * @param {string|string[]} str string or string collection
//          * @returns {string} returns a single string from array
//          */
//         static asString(str) {
//         	if (Array.isArray(str)) {
//         		return str.join("\n");
//         	}
//         	return str;
//         }

//         /**
//          * @typedef {Object} WithId
//          * @property {string|number} id
//          */

//         /**
//          * @param {WithId[]} modules a collection of modules to get array bounds for
//          * @returns {[number, number] | false} returns the upper and lower array bounds
//          * or false if not every module has a number based id
//          */
//         static getModulesArrayBounds(modules) {
//         	let maxId = -Infinity;
//         	let minId = Infinity;
//         	for (const module of modules) {
//         		const moduleId = module.id;
//         		if (typeof moduleId !== "number") return false;
//         		if (maxId < moduleId) maxId = moduleId;
//         		if (minId > moduleId) minId = moduleId;
//         	}
//         	if (minId < 16 + ("" + minId).length) {
//         		// add minId x ',' instead of 'Array(minId).concat(…)'
//         		minId = 0;
//         	}
//         	// start with -1 because the first module needs no comma
//         	let objectOverhead = -1;
//         	for (const module of modules) {
//         		// module id + colon + comma
//         		objectOverhead += `${module.id}`.length + 2;
//         	}
//         	// number of commas, or when starting non-zero the length of Array(minId).concat()
//         	const arrayOverhead = minId === 0 ? maxId : 16 + `${minId}`.length + maxId;
//         	return arrayOverhead < objectOverhead ? [minId, maxId] : false;
//         }

//         /**
//          * @param {ChunkRenderContext} renderContext render context
//          * @param {Module[]} modules modules to render (should be ordered by identifier)
//          * @param {function(Module): Source} renderModule function to render a module
//          * @param {string=} prefix applying prefix strings
//          * @returns {Source} rendered chunk modules in a Source object
//          */
//         static renderChunkModules(renderContext, modules, renderModule, prefix = "") {
//         	const { chunkGraph } = renderContext;
//         	var source = new ConcatSource();
//         	if (modules.length === 0) {
//         		return null;
//         	}
//         	/** @type {{id: string|number, source: Source|string}[]} */
//         	const allModules = modules.map(module => {
//         		return {
//         			id: chunkGraph.getModuleId(module),
//         			source: renderModule(module) || "false"
//         		};
//         	});
//         	const bounds = Template.getModulesArrayBounds(allModules);
//         	if (bounds) {
//         		// Render a spare array
//         		const minId = bounds[0];
//         		const maxId = bounds[1];
//         		if (minId !== 0) {
//         			source.add(`Array(${minId}).concat(`);
//         		}
//         		source.add("[\n");
//         		/** @type {Map<string|number, {id: string|number, source: Source|string}>} */
//         		const modules = new Map();
//         		for (const module of allModules) {
//         			modules.set(module.id, module);
//         		}
//         		for (let idx = minId; idx <= maxId; idx++) {
//         			const module = modules.get(idx);
//         			if (idx !== minId) {
//         				source.add(",\n");
//         			}
//         			source.add(`/* ${idx} */`);
//         			if (module) {
//         				source.add("\n");
//         				source.add(module.source);
//         			}
//         		}
//         		source.add("\n" + prefix + "]");
//         		if (minId !== 0) {
//         			source.add(")");
//         		}
//         	} else {
//         		// Render an object
//         		source.add("{\n");
//         		for (let i = 0; i < allModules.length; i++) {
//         			const module = allModules[i];
//         			if (i !== 0) {
//         				source.add(",\n");
//         			}
//         			source.add(`\n/***/ ${JSON.stringify(module.id)}:\n`);
//         			source.add(module.source);
//         		}
//         		source.add(`\n\n${prefix}}`);
//         	}
//         	return source;
//         }

//         /**
//          * @param {RuntimeModule[]} runtimeModules array of runtime modules in order
//          * @param {RenderContext & { codeGenerationResults?: CodeGenerationResults }} renderContext render context
//          * @returns {Source} rendered runtime modules in a Source object
//          */
//         static renderRuntimeModules(runtimeModules, renderContext) {
//         	const source = new ConcatSource();
//         	for (const module of runtimeModules) {
//         		const codeGenerationResults = renderContext.codeGenerationResults;
//         		let runtimeSource;
//         		if (codeGenerationResults) {
//         			runtimeSource = codeGenerationResults.getSource(
//         				module,
//         				renderContext.chunk.runtime,
//         				"runtime"
//         			);
//         		} else {
//         			const codeGenResult = module.codeGeneration({
//         				chunkGraph: renderContext.chunkGraph,
//         				dependencyTemplates: renderContext.dependencyTemplates,
//         				moduleGraph: renderContext.moduleGraph,
//         				runtimeTemplate: renderContext.runtimeTemplate,
//         				runtime: renderContext.chunk.runtime,
//         				codeGenerationResults
//         			});
//         			if (!codeGenResult) continue;
//         			runtimeSource = codeGenResult.sources.get("runtime");
//         		}
//         		if (runtimeSource) {
//         			source.add(Template.toNormalComment(module.identifier()) + "\n");
//         			if (!module.shouldIsolate()) {
//         				source.add(runtimeSource);
//         				source.add("\n\n");
//         			} else if (renderContext.runtimeTemplate.supportsArrowFunction()) {
//         				source.add("(() => {\n");
//         				source.add(new PrefixSource("\t", runtimeSource));
//         				source.add("\n})();\n\n");
//         			} else {
//         				source.add("!function() {\n");
//         				source.add(new PrefixSource("\t", runtimeSource));
//         				source.add("\n}();\n\n");
//         			}
//         		}
//         	}
//         	return source;
//         }

//         /**
//          * @param {RuntimeModule[]} runtimeModules array of runtime modules in order
//          * @param {RenderContext} renderContext render context
//          * @returns {Source} rendered chunk runtime modules in a Source object
//          */
//         static renderChunkRuntimeModules(runtimeModules, renderContext) {
//         	return new PrefixSource(
//         		"/******/ ",
//         		new ConcatSource(
//         			"function(__webpack_require__) { // webpackRuntimeModules\n",
//         			this.renderRuntimeModules(runtimeModules, renderContext),
//         			"}\n"
//         		)
//         	);
//         }
//       },
//     },
//     {
//       definitions: {
//         Buffer: [
//           "buffer",
//           "Buffer",
//         ],
//         process: [
//           "process",
//         ],
//       },
//     },
//     {
//       definitions: {
//         "process.env.NODE_ENV": "\"development\"",
//         "process.env.__NEXT_CROSS_ORIGIN": undefined,
//         "process.browser": "true",
//         "process.env.__NEXT_TEST_MODE": undefined,
//         "process.env.__NEXT_DIST_DIR": "\"C:\\\\Users\\\\Grahn\\\\Desktop\\\\Next Play\\\\my-app\\\\.next\"",
//         "process.env.__NEXT_TRAILING_SLASH": "false",
//         "process.env.__NEXT_BUILD_INDICATOR": "true",
//         "process.env.__NEXT_BUILD_INDICATOR_POSITION": "\"bottom-right\"",
//         "process.env.__NEXT_PLUGINS": "false",
//         "process.env.__NEXT_STRICT_MODE": "false",
//         "process.env.__NEXT_REACT_ROOT": "false",
//         "process.env.__NEXT_CONCURRENT_FEATURES": "false",
//         "process.env.__NEXT_RSC": "false",
//         "process.env.__NEXT_OPTIMIZE_FONTS": "false",
//         "process.env.__NEXT_OPTIMIZE_CSS": "false",
//         "process.env.__NEXT_SCROLL_RESTORATION": "false",
//         "process.env.__NEXT_IMAGE_OPTS": "{\"deviceSizes\":[640,750,828,1080,1200,1920,2048,3840],\"imageSizes\":[16,32,48,64,96,128,256,384],\"path\":\"/_next/image\",\"loader\":\"default\",\"domains\":[]}",
//         "process.env.__NEXT_ROUTER_BASEPATH": "\"\"",
//         "process.env.__NEXT_HAS_REWRITES": "false",
//         "process.env.__NEXT_I18N_SUPPORT": "false",
//         "process.env.__NEXT_I18N_DOMAINS": undefined,
//         "process.env.__NEXT_ANALYTICS_ID": "\"\"",
//       },
//     },
//     {
//       filename: "react-loadable-manifest.json",
//       pagesDir: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\pages",
//       runtimeAsset: undefined,
//       dev: true,
//     },
//     {
//       ampPages: {
//       },
//     },
//     {
//       options: {
//         resourceRegExp: {
//         },
//         contextRegExp: {
//         },
//       },
//       checkIgnore: function () { [native code] },
//     },
//     {
//       prevAssets: null,
//       previousOutputPathsWebpack5: {
//       },
//       currentOutputPathsWebpack5: {
//       },
//     },
//     {
//       options: {
//       },
//     },
//     {
//       dev: true,
//       isEdgeRuntime: false,
//     },
//     {
//       buildId: "development",
//       isDevFallback: false,
//       rewrites: {
//         beforeFiles: [
//         ],
//         afterFiles: [
//         ],
//         fallback: [
//         ],
//       },
//       exportRuntime: false,
//     },
//     {
//       runWebpackSpan: {
//         name: "hot-reloader",
//         parentId: undefined,
//         duration: null,
//         attrs: {
//           version: "12.1.0",
//         },
//         status: 1,
//         id: 1,
//         _start: 535357775545300n,
//       },
//     },
//     {
//     },
//     {
//       filePath: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\node_modules\\next\\dist\\build\\polyfills\\polyfill-nomodule.js",
//       cacheKey: "12.1.0",
//       name: "static/chunks/polyfills.js",
//       info: {
//         minimized: true,
//       },
//     },
//   ],
//   experiments: {
//     layers: true,
//     cacheUnaffected: true,
//     buildHttp: undefined,
//   },
//   snapshot: {
//     managedPaths: [
//       {
//       },
//     ],
//   },
//   cache: {
//     type: "filesystem",
//     version: "12.1.0|{\"pageExtensions\":[\"tsx\",\"ts\",\"jsx\",\"js\"],\"trailingSlash\":false,\"buildActivity\":true,\"buildActivityPosition\":\"bottom-right\",\"productionBrowserSourceMaps\":false,\"plugins\":false,\"reactStrictMode\":false,\"optimizeFonts\":true,\"optimizeCss\":false,\"scrollRestoration\":false,\"basePath\":\"\",\"pageEnv\":false,\"excludeDefaultMomentLocales\":true,\"assetPrefix\":\"\",\"disableOptimizedLoading\":false,\"target\":\"server\",\"isEdgeRuntime\":false,\"reactProductionProfiling\":false,\"webpack\":true,\"hasRewrites\":false,\"reactRoot\":false,\"swcMinify\":false,\"swcLoader\":true}",
//     cacheDirectory: "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\.next\\cache\\webpack",
//     buildDependencies: {
//       config: [
//         "C:\\Users\\Grahn\\Desktop\\Next Play\\my-app\\next.config.js",
//       ],
//     },
//     name: "client-development",
//   },
//   mode: "development",
//   name: "client",
//   target: [
//     "web",
//     "es5",
//   ],
//   devtool: "eval-source-map",
// }
