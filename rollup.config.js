import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import globby from "globby";
import fs from "fs";
import { dirname, basename } from "path";
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
    plugins: [
      ["import", { libraryName: "antd", libraryDirectory: "es", style: true }, "antd"],
      [
        "import",
        {
          libraryName: "lodash",
          libraryDirectory: "",
          camel2DashComponentName: false
        },
        "lodash"
      ]
    ],
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
    delimiters: ["", ""],
    preventAssignment: true,
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "production"),
    API_URL:
      process.env.NODE_ENV === "debug"
        ? `https://pure-post-yooo.vercel.app/api`
        : `https://pure-post-yooo.vercel.app/api`
  }),
  ...(process.env.NODE_ENV === "debug" ? [] : [terser()])
];

// const pluginPaths = fs.readdirSync("./src/plugins");
const pluginPaths = globby.sync("./src/plugins/**/index.(ts|tsx)");
// const dynamicMenuPaths = fs.readdirSync("./src/contextmenu/dynamic-menu");
const dynamicMenuPaths = globby.sync("./src/contextmenu/dynamic-menu/**/*.(ts|tsx)");

const libGlobals = {
  // antd: "window.roamEnhance.libs.antd",
  react: "window.roamEnhance.libs.React",
  "react-dom": "window.roamEnhance.libs.ReactDOM",
  arrive: "arrive"
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
  ...pluginPaths.map((path) => {
    const name = basename(dirname(path));
    return {
      input: path,
      external: Object.keys(libGlobals),
      output: {
        file: `dist/plugins/${name}.js`,
        format: "iife",
        name: camelCase(name),
        globals: libGlobals
      },
      plugins
    };
  }),
  ...dynamicMenuPaths.map((path) => {
    const name = basename(dirname(path));
    return {
      input: path,
      external: Object.keys(libGlobals),
      output: {
        file: `dist/dynamicMenu/${name}.js`,
        format: "iife",
        name: camelCase(name),
        globals: libGlobals
      },
      plugins
    };
  }),
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
