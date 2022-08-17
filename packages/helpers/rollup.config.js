import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";

export default {
  input: "src/index.js",
  output: [
    {
      file: "cjs/index.js",
      format: "cjs",
    },
    {
      file: "es/index.js",
      format: "es",
    },
  ],
  plugins: [
    commonjs(),
    resolve(),
    babel({
      babelHelpers: "runtime",
      exclude: "node_modules/**",
    }),
  ],
};
