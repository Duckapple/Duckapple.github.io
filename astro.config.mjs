import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import solidJs from "@astrojs/solid-js";

import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

import { normalizeUri } from "micromark-util-sanitize-uri";

import { remarkSpoilerParser } from "./src/remark-rehype-plug";

// @ts-check

// https://astro.build/config
export default defineConfig({
  site: "https://simon-green.dev",
  integrations: [mdx(), sitemap(), tailwind(), solidJs()],
  markdown: {
    remarkPlugins: [remarkMath, remarkSpoilerParser],
    rehypePlugins: [
      [
        rehypeKatex,
        {
          // Katex plugin options
          macros: {},
        },
      ],
    ],
    remarkRehype: {
      handlers: {
        spoiler: (state, node) => {
          return state.applyData(node, {
            type: "element",
            tagName: "span",
            properties: { className: "spoiler" },
            children: node.children,
          });
        },
        image: (state, node) => {
          const properties = { src: normalizeUri(node.url) };

          if (node.alt !== null && node.alt !== undefined) {
            properties.alt = node.alt;
          }

          /** @type {Element} */
          let elem = {
            type: "element",
            tagName: "img",
            properties,
            children: [],
          };
          state.patch(node, elem);

          if (node.title != null) {
            elem = {
              type: "element",
              tagName: "figure",
              properties: {},
              children: [
                elem,
                {
                  type: "element",
                  tagName: "figcaption",
                  properties: {},
                  children: [{ type: "text", value: node.title }],
                },
              ],
            };
          }

          return state.applyData(node, elem);
        },
      },
    },
    shikiConfig: {
      theme: "rose-pine",
      // theme: "rose-pine-moon",
    },
  },
});
