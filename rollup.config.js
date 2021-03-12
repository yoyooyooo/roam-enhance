import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
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
  {
    input: "src/plugins/metadata/index.ts",
    output: {
      file: "dist/plugins/metadata.js",
      format: "iife",
      name: "metadata"
    },
    plugins
  }
];
