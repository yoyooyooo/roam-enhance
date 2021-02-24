import { uglify } from "rollup-plugin-uglify";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "src/index.js",
  output: {
    file: "dist/main.js",
    format: "iife"
  },
  plugins: [
    nodeResolve()
    //uglify(),
  ]
};
