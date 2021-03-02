import { uglify } from "rollup-plugin-uglify";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import css from "rollup-plugin-import-css";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";

export default {
  input: "src/index.ts",
  output: {
    name: "roamEnhance",
    file: "dist/main.js",
    format: "iife"
  },
  plugins: [
    typescript({ sourceMap: false }),
    nodeResolve(),
    commonjs(),
    css({ output: "main.css" }),
    replace({
      preventAssignment: true,
      "process.env.NODE_ENV": '"production"'
    }),
    uglify()
  ]
};
