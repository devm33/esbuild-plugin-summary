# esbuild-plugin-summary

Plugin for [esbuild](https://esbuild.github.io/) to output the same build
summary info (time and filesize) when using the API to build as the CLI.

## Install

```shell
npm i esbuild esbuild-plugin-summary
```

## Usage

```js
import * as esbuild from 'esbuild';
import { summaryPlugin } from 'esbuild-plugin-summary';

esbuild.build({
  entryPoints: ['src/index.js'],
  outfile: 'dist/index.js',
  plugins: [summaryPlugin()],
});
```

To include the sizes of the output files set `includeSizes` to `true`.

```js
esbuild.build({
  entryPoints: ['src/index.js'],
  outfile: 'dist/index.js',
  plugins: [summaryPlugin({includeSizes: true})],
});
```
