const data =
  'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json';
const svgWidth = 1400;
const svgHeight = 700;

d3.select('#container')
  .style('width', `${svgWidth}px`)
  .style('height', `${svgHeight}px`);

d3.select('#title').style('left', `${svgWidth / 2}px`);
d3.select('#description').style('left', `${svgWidth / 2}px`);

d3.json(data).then(dataset => {
  visualize(dataset);
});

const visualize = dataset => {
  // SVG
  const svg = d3
    .select('#container')
    .append('svg')
    .attr('class', 'svg-container')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  // Tree Map
  const root = d3
    .hierarchy(dataset)
    .sum(d => d.value)
    .sort((a, b) => b.height - a.height || b.value - a.value);

  d3
    .treemap()
    .size([svgWidth, svgHeight])
    .paddingInner(1)(root);

  const color = d3.scaleOrdinal(d3.schemeAccent);

  // Tooltip
  const tooltip = d3.select('#tooltip');

  // Selector
  d3.select('#container')
    .selectAll('h4')
    .data(root.leaves())
    .enter()
    .append('h4')
    .text(d => d.data.name)
    .style('left', d => `${d.x0}px`)
    .style('top', d => `${d.y0}px`)
    .style('width', d => `${d.x1 - d.x0}px`)
    .style('height', d => `${d.y1 - d.y0}px`);

  // Legend
  const legend = d3
    .select('#container')
    .append('svg')
    .attr('id', 'legend');

  legend
    .selectAll('rect')
    .data(dataset.children)
    .enter()
    .append('rect')
    .attr('class', 'legend-item')
    .attr('x', (d, i) => (svgWidth / dataset.children.length) * i)
    .attr('y', 0)
    .attr('width', svgWidth / dataset.children.length)
    .attr('height', 60)
    .attr('fill', d => color(d.name));

  legend
    .selectAll('text')
    .data(dataset.children)
    .enter()
    .append('text')
    .text(d => d.name)
    .attr('class', 'legend-text')
    .attr('x', (d, i) => 10 + (svgWidth / dataset.children.length) * i)
    .attr('y', 40)
    .attr('width', svgWidth / dataset.children.length)
    .attr('height', 60)
    .attr('fill', 'white');

  // Draw Treemap
  svg
    .selectAll('rect')
    .data(root.leaves())
    .enter()
    .append('rect')
    .attr('class', 'tile')
    .attr('data-name', d => d.data.name)
    .attr('data-category', d => d.data.category)
    .attr('data-value', d => d.data.value)
    .attr('x', d => d.x0)
    .attr('y', d => d.y0)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .style('stroke', 'white')
    .style('fill', d => color(d.data.category))
    .on('mouseover', d => {
      tooltip
        .html(
          `Category: ${d.data.category}
          <br/>Value: ${d.data.value}`
        )
        .attr('id', 'tooltip')
        .attr('data-value', d.data.value)
        .style('left', `${d.x0}px`)
        .style('top', `${d.y0}px`)
        .style('width', `${d.x1 - d.x0}px`)
        .style('height', `${d.y1 - d.y0}px`)
        .style('visibility', 'visible');
    })
    .on('mouseout', () => tooltip.style('visibility', 'hidden'));
};
