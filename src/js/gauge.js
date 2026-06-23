/**
 * gauge.js — D3.js Guilt Level Gauge
 * Renders and animates a semi-circular gauge (0–100) using D3.js v7.
 */

import * as d3 from 'd3';

let guiltGauge = null;

const RADIUS = 90;
const CX = 150;
const CY = 160;

/**
 * Initialize the gauge SVG, arc, and needle.
 */
export function initGauge() {
    const svg = d3
        .select('#guiltGauge')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', '0 0 300 180')
        .attr('preserveAspectRatio', 'xMidYMax meet');

    // Background arc
    const arc = d3
        .arc()
        .innerRadius(RADIUS - 20)
        .outerRadius(RADIUS)
        .startAngle(-Math.PI * 0.8)
        .endAngle(Math.PI * 0.8);

    svg
        .append('path')
        .attr('d', arc({}))
        .attr('transform', `translate(${CX}, ${CY})`)
        .attr('fill', '#e0e0e0');

    // Foreground arc (colored fill)
    const foreground = svg
        .append('path')
        .datum({ endAngle: -Math.PI * 0.8 })
        .attr('transform', `translate(${CX}, ${CY})`)
        .attr('fill', '#4caf50');

    // Needle group
    const needleGroup = svg
        .append('g')
        .attr('transform', `translate(${CX}, ${CY})`);

    const needle = needleGroup
        .append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', -RADIUS + 40)
        .attr('stroke', '#d32f2f')
        .attr('stroke-width', 4)
        .attr('transform', 'rotate(-144)');

    // Needle pivot circle
    needleGroup.append('circle').attr('r', 8).attr('fill', '#d32f2f');

    // Label
    svg
        .append('text')
        .attr('x', CX)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('fill', '#888')
        .text('Guilt Level');

    guiltGauge = { svg, foreground, needle, needleGroup, radius: RADIUS, cx: CX, cy: CY };
}

/**
 * Update the gauge display based on a guilt score (0–100).
 * @param {number} score
 */
export function updateGauge(score) {
    if (!guiltGauge) return;

    const { foreground, needle, radius: R } = guiltGauge;

    const angle = -144 + (score / 100) * 288;
    const radians = (angle * Math.PI) / 180;

    // Smooth needle transition
    needle
        .transition()
        .duration(1000)
        .ease(d3.easeCubicOut)
        .attr('transform', `rotate(${angle})`);

    // Determine color based on score
    let color;
    if (score < 30) color = '#4caf50';
    else if (score < 70) color = '#fb8c00';
    else color = '#d32f2f';

    // Animate arc fill
    const arc = d3
        .arc()
        .innerRadius(R - 20)
        .outerRadius(R)
        .startAngle(-Math.PI * 0.8);

    foreground
        .transition()
        .duration(1000)
        .attrTween('d', function (d) {
            const interpolate = d3.interpolate(d.endAngle, radians);
            return function (t) {
                d.endAngle = interpolate(t);
                return arc(d);
            };
        })
        .on('end', function () {
            d3.select(this).attr('fill', color);
        });
}
