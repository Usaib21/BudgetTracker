import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export function IncomeExpenseDonut({
    income,
    expense,
}: {
    income: number;
    expense: number;
}) {
    const ref = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const width = 260;
        const height = 260;
        const radius = Math.min(width, height) / 2;

        const svg = d3.select(ref.current);
        svg.selectAll('*').remove();

        const color = d3.scaleOrdinal<string>()
            .domain(['Income', 'Expense'])
            .range(['#22c55e', '#ef4444']); // green = income, red = expense

        const pie = d3.pie<number>()
            .value((d) => d)
            .sort(null);

        const data = [income, expense];
        const labels = ['Income', 'Expense'];

        const arc = d3.arc<d3.PieArcDatum<number>>()
            .innerRadius(radius * 0.6)
            .outerRadius(radius - 10)
            .cornerRadius(8);

        const g = svg
            .attr('viewBox', `0 0 ${width} ${height + 50}`) // extra space for legend
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        // === Donut Arcs ===
        g.selectAll('path')
            .data(pie(data))
            .enter()
            .append('path')
            .attr('fill', (_, i) => color(String(i))!)
            .attr('d', arc as any)
            .each(function (d) {
                (this as any)._current = d;
            })
            .transition()
            .duration(800)
            .attrTween('d', function (d) {
                const el = this as any;
                const i = d3.interpolate(el._current, d);
                el._current = i(0);
                return (t) => arc(i(t))!;
            });

        // === Center total text ===
        g.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .attr('font-size', '18px')
            .attr('font-weight', 'bold')
            .attr('fill', '#374151')
            .text(`₹${(income - expense).toLocaleString()}`);

        // === Legend (with bottom spacing like mb-2) ===
        const legend = svg
            .append('g')
            .attr('transform', `translate(${width / 2 - 60}, ${height + 30})`); // ⬅ shifted down slightly

        const legendItems = legend
            .selectAll('.legend-item')
            .data(labels)
            .enter()
            .append('g')
            .attr('class', 'legend-item')
            .attr('transform', (_, i) => `translate(${i * 100}, 0)`);

        // Rounded square color dots
        legendItems
            .append('rect')
            .attr('width', 14)
            .attr('height', 14)
            .attr('rx', 3)
            .attr('ry', 3)
            .attr('fill', (d) => color(d)!);

        // Legend text
        legendItems
            .append('text')
            .attr('x', 22)
            .attr('y', 11)
            .attr('font-size', '13px')
            .attr('fill', '#374151')
            .text((d) => d);
    }, [income, expense]);

    return <svg ref={ref} width="100%" height="300" />; // slightly taller SVG
}
