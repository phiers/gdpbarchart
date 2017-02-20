import * as d3 from 'd3';
/* eslint-disable */
// Load foundation
$(document).foundation();
// App css
require('style!css!sass!applicationStyles');
/* eslint-enable */
const height = window.innerHeight - 100;
const width = window.innerWidth - 100;
const svg = d3.select('body').append('svg').attr('height', '100%').attr('width', '100%');
const parseDate = d3.timeParse('%Y-%m-%d');
const tooltip = d3.select('body').append('div')
                .style('opacity', '0')
                .style('position', 'absolute')
                .style('padding', '5px')
                .style('background', 'lightgray');
fetch('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(response => response.json())
  .then((data) => {
    const max = d3.max(data.data, d => d[1]);
    const minDate = d3.min(data.data, d => parseDate(d[0]));
    const maxDate = d3.max(data.data, d => parseDate(d[0]));
    const margin = { top: 50, left: 50, right: 20, bottom: 0 };
    const y = d3.scaleLinear()
                .domain([0, max])
                .range([height, 0]);
    const x = d3.scaleTime()
                .domain([minDate, maxDate])
                .range([0, width]);
    const yAxis = d3.axisLeft(y);
    const xAxis = d3.axisBottom(x);
    const chartGroup = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);
    chartGroup.selectAll('rect')
      .data(data.data)
      .enter().append('rect')
        .attr('class', 'rect')
        .attr('fill', 'blue')
        .attr('height', d => height - y(d[1]))
        .attr('width', 2)
        .attr('x', d => x(parseDate(d[0])))
        .attr('y', d => y(d[1]))
        .on('mousemove', (d) => {
          tooltip.style('opacity', '1')
                    .style('left', `${width / 2}px`)
                    .style('top', `${0 + margin.top + 10}px`);
                 // .style('left', `${d3.event.pageX}px`)
                 // .style('top', `${height}px`);
          tooltip.html(`<p>Qtr:  ${d[0]}</p>
                        <p>GDP: ${d[1]}</p>
                      `);
        })
        .on('mouseout', () => tooltip.style('opacity', '0'));
    chartGroup.append('g').call(yAxis);
    chartGroup.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);
    chartGroup.append('text')
                .attr('text-anchor', 'middle')
                .attr('transform', `translate(${width / 2}, 0)`)
                .text('US GDP by Quarter, in millions of $US');
    chartGroup.append('text')
              .attr('text-anchor', 'middle')
              .attr('transform', `translate(${width / 2}, ${height + margin.top})`)
              .text('YEAR');
  });
