import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import fs from "fs";
import { camelCase } from "lodash";
import styles from "rollup-plugin-styles";
import { terser } from "rollup-plugin-terser";
import { babel } from "@rollup/plugin-babel";
import postcss from "rollup-plugin-postcss";

const plugins = [
  typescript({ sourceMap: false }),
  babel({
    babelrc: false,
    babelHelpers: "bundled",
    plugins: [["import", { libraryName: "antd", libraryDirectory: "es", style: true }]],
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    exclude: "node_modules/**"
  }),
  nodeResolve(),
  commonjs({
    include: "node_modules/**"
  }),
  postcss({
    extensions: [".css", ".scss", ".less"],
    use: [
      "sass",
      [
        "less",
        {
          javascriptEnabled: true,
          modifyVars: {
            "primary-color": "#1DA57A"
          }
        }
      ]
    ]
  }),
  // css({ output: "main.css" }),
  styles({ mode: "inject" }),
  replace({
    preventAssignment: true,
    "process.env.NODE_ENV": '"production"'
  }),
  terser()
];

const pluginPaths = fs.readdirSync("./src/plugins");

const libGlobals = {
  // antd: "window.roamEnhance.libs.antd",
  react: "window.roamEnhance.libs.React",
  "react-dom": "window.roamEnhance.libs.ReactDOM"
};

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
  ...pluginPaths.map((name) => ({
    input: `src/plugins/${name}/index.ts`,
    external: Object.keys(libGlobals),
    output: {
      file: `dist/plugins/${name}.js`,
      format: "iife",
      name: camelCase(name),
      globals: libGlobals
    },
    plugins
  })),
  ...Object.keys(libGlobals).map((name) => ({
    input: `node_modules/${name}`,
    external: Object.keys(libGlobals),
    output: {
      file: `dist/libs/${name}.js`,
      format: "umd",
      name: libGlobals[name],
      globals: libGlobals
    },
    plugins
  }))
];
