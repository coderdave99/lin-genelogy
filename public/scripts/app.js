import { render } from "./chart.js";
import { loadData } from "./dataSource.js";

// immediately invoked main function
(async function main() {
  const params = new URL(document.location.toString()).searchParams;

  // root data is fetched from a unlisted google sheet
  const id = params.get("id");
  const root = await loadData({
    id,
    sheet: "data",
    rootId: params.get("root") ?? 1,
  });

  if (root) d3.select("#title").text(root.data.name + " 派下");
  if (id)
    d3.select("#link")
      .attr("href", `https://docs.google.com/spreadsheets/d/${id}`)
      .attr("target", "_blank");

  await render(root, {
    onNodeClick(node) {
      document.location = `?id=${params.get("id")}&root=${node.data.id}`;
    },
  });
})();
