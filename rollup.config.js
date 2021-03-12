import uglify from "rollup-plugin-uglify-es";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import css from "rollup-plugin-import-css";
import styles from "rollup-plugin-styles";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";

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
  uglify()
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
