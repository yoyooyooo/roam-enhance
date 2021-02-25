import { uglify } from "rollup-plugin-uglify";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import css from "rollup-plugin-import-css";

export default {
  input: "src/index.js",
  output: {
    file: "dist/main.js",
    format: "iife"
  },
  plugins: [nodeResolve(), css({ output: "main.css" }), uglify()]
};
