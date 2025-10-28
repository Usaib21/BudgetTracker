import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export function BudgetBar({
    budget,
    actual,
}: {
    budget: number;
    actual: number;
}) {
    const ref = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const width = 400;
        const height = 160;
        const margin = { left: 50, right: 30, top: 30, bottom: 30 };

        const svg = d3.select(ref.current);
        svg.selectAll('*').remove();
        svg.attr('viewBox', `0 0 ${width} ${height}`);

        const maxValue = Math.max(budget, actual, 1);
        const x = d3.scaleLinear().domain([0, maxValue]).range([margin.left, width - margin.right]);

        // Bars background
        svg.append('rect')
            .attr('x', margin.left)
            .attr('y', 60)
            .attr('height', 30)
            .attr('width', x(budget) - margin.left)
            .attr('fill', '#dbeafe')
            .attr('rx', 6);

        // Actual expenses bar with animation
        svg.append('rect')
            .attr('x', margin.left)
            .attr('y', 60)
            .attr('height', 30)
            .attr('width', 0)
            .attr('fill', actual > budget ? '#ef4444' : '#22c55e')
            .attr('rx', 6)
            .transition()
            .duration(800)
            .attr('width', x(actual) - margin.left);

        // Text labels
        svg
            .append('text')
            .attr('x', margin.left)
            .attr('y', 40)
            .attr('class', 'font-semibold')
            .attr('fill', '#374151')
            .text(`Budget: ₹${budget}`);

        svg
            .append('text')
            .attr('x', margin.left)
            .attr('y', 120)
            .attr('fill', actual > budget ? '#ef4444' : '#16a34a')
            .text(`Actual: ₹${actual}`);
    }, [budget, actual]);

    return <svg ref={ref} width="100%" height="160" />;
}
