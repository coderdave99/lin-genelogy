// Declare the x (horizontal position) scale.
export async function render(data, opt) {
  let { width, onNodeClick = () => {} } = opt || {};
  const margin = 60;
  const fontSize = 12;

  const hierarchy = d3.hierarchy(data);
  // deeper the hierarchy, we need more space to draw
  if (!width) width = hierarchy.height * 250;

  const height = width;
  const cx = width * 0.5;
  const cy = height * 0.5;
  const radius = Math.min(width, height) / 2 - margin;

  // Create a radial tree layout. The layout’s first dimension (x)
  // is the angle, while the second (y) is the radius.
  const tree = d3
    .tree()
    .size([2 * Math.PI, radius])
    .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);

  // Apply the layout.
  const root = tree(hierarchy);

  // Creates the SVG container.
  const svg = d3
    .select("#chart")
    .attr("width", width)
    .attr("height", height)
    // move the origin to the center of the SVG element
    .attr("viewBox", [-cx, -cy, width, height])
    .attr(
      "style",
      `width: ${width}px; height: ${height}px; font: ${fontSize}px sans-serif;`
    );

  svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
    .selectAll()
    .data(root.links())
    .join("path")
    .attr(
      "d",
      d3
        .linkRadial()
        .angle((d) => d.x)
        .radius((d) => d.y)
    );

  // Append nodes.
  svg
    .append("g")
    .selectAll()
    .data(root.descendants())
    .join("circle")
    .attr(
      "transform",
      (d) => `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`
    )
    .attr("stroke", (d) => (d.children ? "#555" : "#999"))
    .attr("stroke-width", 1.5)
    .attr("fill", "white")
    .style("cursor", "pointer")
    .on("click", (e, d) => onNodeClick(d))
    .attr("r", 4);

  // Append labels.
  svg
    .append("g")
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 2)
    .selectAll()
    .data(root.descendants())
    .join("text")
    .attr("transform", (d) => {
      const yOffset = d.data.data.partnerName ? -(fontSize / 3 + 1) : 0;
      return `rotate(${(d.x * 180) / Math.PI - 90}) translate(${
        d.y
      }, ${yOffset}) rotate(${d.x >= Math.PI ? 180 : 0})`;
    })
    .attr("dy", "0.31em")
    .attr("x", (d) => (d.x < Math.PI ? 6 : -6))
    .attr("text-anchor", (d) => (d.x < Math.PI ? "start" : "end"))
    .attr("paint-order", "stroke")
    .attr("stroke", "white")
    .attr("fill", "currentColor")
    .text((d) => d.data.data.name)
    .style("cursor", "pointer")
    .on("click", (e, d) => onNodeClick(d));

  // Append partner labels.
  svg
    .append("g")
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 2)
    .selectAll()
    .data(root.descendants())
    .join("text")
    .attr("transform", (d) => {
      const yOffset = d.data.data.partnerName ? (fontSize / 3) * 2 + 1 : 0;
      return `rotate(${(d.x * 180) / Math.PI - 90}) translate(${
        d.y
      }, ${yOffset}) rotate(${d.x >= Math.PI ? 180 : 0})`;
    })
    .attr("dy", "0.31em")
    .attr("x", (d) => (d.x < Math.PI ? 6 : -6))
    .attr("text-anchor", (d) => (d.x < Math.PI ? "start" : "end"))
    .attr("paint-order", "stroke")
    .attr("stroke", "white")
    .attr("fill", "red")
    .text((d) => d.data.data.partnerName);
}
