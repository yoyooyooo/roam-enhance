import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import fs from "fs";
import { camelCase } from "lodash";
import styles from "rollup-plugin-styles";
import { terser } from "rollup-plugin-terser";

const plugins = [
  typescript({ sourceMap: false }),
  nodeResolve(),
  commonjs(),
  // css({ output: "main.css" }),
  styles({ mode: "inject" }),
  replace({
    preventAssignment: true,
    "process.env.NODE_ENV": '"production"'
  }),
  terser()
];

const pluginPaths = fs.readdirSync("./src/plugins");

export default [
  {
    input: "src/index.ts",
    output: {
      name: "roamEnhance",
      file: "dist/main.js",
      format: "iife"
    },
    plugins
  },
  ...pluginPaths.map((pluginName) => ({
    input: `src/plugins/${pluginName}/index.ts`,
    output: {
      file: `dist/plugins/${pluginName}.js`,
      format: "iife",
      name: camelCase(pluginName)
    },
    plugins
  }))
];
