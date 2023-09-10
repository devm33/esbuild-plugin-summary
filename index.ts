import chalk from "chalk";
import columnify from "columnify";
import * as esbuild from "esbuild";
import { parse, sep } from "node:path";
import prettyBytes from "pretty-bytes";

/** Plugin to output build time and bundle size. */
export function summaryPlugin({ includeSize = false } = {}): esbuild.Plugin {
  return {
    name: "buildPlugin",
    setup(build) {
      let startTime: number;

      if (includeSize) {
        // metafile is required to get bundle size
        build.initialOptions.metafile = true;
      }

      build.onStart(() => {
        startTime = Date.now();
      });

      build.onEnd((result) => {
        const duration = Date.now() - startTime;
        if (result.errors.length > 0) return; // Skip summary if errored
        if (includeSize) printOutputs(result.metafile!);
        console.log(`\n⚡ ${chalk.green("Done in %sms")}`, duration);
      });
    },
  };
}

function printOutputs(metafile: esbuild.Metafile) {
  console.log(
    columnify(
      Object.entries(metafile.outputs)
        .filter(([path]) => !path.endsWith(".map")) // Skip sourcemaps
        .map(([path, { bytes }]) => ["", formatPath(path), formatSize(bytes)]),
      { showHeaders: false, paddingChr: "  " },
    ),
  );
}

function formatSize(bytes: number): string {
  return chalk.cyan(
    prettyBytes(bytes, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  );
}

function formatPath(path: string): string {
  const p = parse(path);
  return `${p.dir}${sep}${chalk.white(p.base)}`;
}
