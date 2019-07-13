d3.json(
  'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json'
).then(dataset => {
  const svgWidth = 1400;
  const svgHeight = 700;

  const container = d3
    .select('body')
    .append('div')
    .attr('id', 'container')
    .style('position', 'absolute')
    .style('top', '50%')
    .style('left', '50%')
    .style('transform', 'translate(-50%, -50%)')
    .style('width', `${svgWidth}px`)
    .style('height', `${svgHeight}px`)
    .style('box-shadow', '0 0 5px gray');

  const title = d3
    .select('#container')
    .append('h1')
    .attr('id', 'title')
    .text('Movie Sales')
    .style('position', 'absolute')
    .style('left', `${svgWidth / 2}px`)
    .style('top', '-55px')
    .style('transform', 'translate(-50%, -50%)');

  const description = d3
    .select('#container')
    .append('p')
    .attr('id', 'description')
    .text('Top 100 Most Sold Video Games Grouped by Platform')
    .style('position', 'absolute')
    .style('left', `${svgWidth / 2}px`)
    .style('top', '-25px')
    .style('transform', 'translate(-50%, -50%)');

  const svg = d3
    .select('#container')
    .append('svg')
    .attr('class', 'svg-container')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .style('background-color', 'white');

  // Tooltip
  const tooltip = d3
    .select('#container')
    .append('p')
    .text('')
    .attr('id', 'tooltip')
    .style('position', 'absolute')
    .style('pointer-events', 'none')
    .style('visibility', 'hidden');

  // Tree Map
  const root = d3
    .hierarchy(dataset)
    .sum(d => d.value)
    .sort((a, b) => b.height - a.height || b.value - a.value);

  const treemap = d3
    .treemap()
    .size([svgWidth, svgHeight])
    .paddingInner(1)(root);

  const color = d3.scaleOrdinal(d3.schemeAccent);

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
        .style('font-size', '12px')
        .style('color', 'white')
        .style('left', `${d.x0}px`)
        .style('top', `${d.y0}px`)
        .style('width', `${d.x1 - d.x0}px`)
        .style('height', `${d.y1 - d.y0}px`)
        .style('visibility', 'visible');
    })
    .on('mouseout', () => tooltip.style('visibility', 'hidden'));

  d3.select('#container')
    .selectAll('h4')
    .data(root.leaves())
    .enter()
    .append('h4')
    .text(d => d.data.name)
    .style('position', 'absolute')
    .style('left', d => `${d.x0}px`)
    .style('top', d => `${d.y0}px`)
    .style('width', d => `${d.x1 - d.x0}px`)
    .style('height', d => `${d.y1 - d.y0}px`)
    .style('font-size', '12px')
    .style('color', '#333')
    .style('pointer-events', 'none');

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
    .attr('x', (d, i) => 10 + (svgWidth / dataset.children.length) * i)
    .attr('y', 40)
    .attr('width', svgWidth / dataset.children.length)
    .attr('height', 60)
    .attr('fill', 'white')
    .style('font-size', '25px')
    .style('text-shadow', '2px 2px black');
});
