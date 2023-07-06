import flatmap from "unist-util-flatmap";
/** @typedef {import('mdast').Root} MDRoot */

/**
 * @type {import('unified').Plugin<[], MDRoot>}
 */
export function remarkSpoilerParser() {
  return (root, file) => {
    flatmap(root, (node, _, givenParent) => {
      if (!node.value || !node.value.includes("||")) return [node];
      const v = node.value;
      let i = 0;
      i = v.indexOf("||");
      const nextI = v.indexOf("||", i + 1);
      if (nextI < i) return [node];
      const before = v.slice(0, i);
      const contents = v.slice(i + 2, nextI);
      const after = v.slice(nextI + 2);
      const children = [];
      if (before) {
        children.push({ type: "text", value: before });
      }
      if (contents) {
        children.push({
          type: "spoiler",
          children: [{ type: "text", value: contents }],
        });
      }
      if (after) {
        children.push({ type: "text", value: after });
      }
      return children;
    });
  };
}
