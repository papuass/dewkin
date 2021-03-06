/**
 * DEep WiKi INspector (DEWKIN)
 * Copyright (C) 2013-2015 Ricordisamoa
 *
 * https://meta.wikimedia.org/wiki/User:Ricordisamoa
 * https://tools.wmflabs.org/ricordisamoa/
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Generate a pie chart.
 *
 * @param {string} selector CSS selector for the element to put the chart into
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {number} radius
 * @param {Object[]} data Objects storing id, name, value, label and color
 * @return {Object} For custom interactions
 */
window.charts.pie = function ( selector, x, y, width, height, radius, data ) {
	'use strict';

	var arc, arcOver, pie, svg, chart, legend, u, g, paths;

	arc = d3.svg.arc()
		.outerRadius( radius )
		.innerRadius( 0 );

	arcOver = d3.svg.arc()
		.outerRadius( radius * 1.1 )
		.innerRadius( 0 );

	pie = d3.layout.pie()
		.sort( null )
		.value( function ( d ) { return d.value; } );

	svg = d3.select( selector )
		.append( 'svg' )
			.attr( 'width', width )
			.attr( 'height', height );

	chart = svg
		.append( 'g' )
			.attr( 'transform', 'translate(' + ( x + radius ) + ',' + ( y + radius ) + ')' );

	legend = svg
		.append( 'g' )
			.attr( 'class', 'legend' )
			.attr( 'transform', 'translate(' + ( x + radius * 2 + 20 ) + ',' + y + ')' );

	u = legend.selectAll( '.leg' )
			.data( pie( data ) )
		.enter().append( 'g' )
			.attr( 'class', 'leg' )
			.attr( 'transform', function ( d, i ) { return 'translate(0,' + i * 20 + ')'; } );

	u.append( 'circle' )
		.attr( 'cx', 9 )
		.attr( 'cy', 9 )
		.attr( 'r', 5 )
		.attr( 'fill', function ( d ) { return d.data.color; } );

	u.append( 'text' )
		.attr( 'x', 20 )
		.attr( 'y', 9 )
		.attr( 'dy', '.35em' )
		.text( function ( d ) { return d.data.label; } );

	g = chart.selectAll( '.arc' )
			.data( pie( data ) )
		.enter().append( 'g' )
			.attr( 'class', 'arc' );

	paths = g.append( 'path' )
		.attr( 'd', arc )
		.attr( 'fill', function ( d ) { return d.data.color; } )
		.on( 'mouseover', function ( d ) {
			var leg;

			d3.select( this )
				.interrupt()
				.attr( 'd', arcOver );

			leg = u
				.filter( function ( dd ) { return dd.data.id === d.data.id; } );

			leg.selectAll( 'text' )
				.attr( 'font-weight', 'bold' );

			leg.selectAll( 'circle' )
				.interrupt()
				.attr( 'r', 7.5 );
		} )
		.on( 'mouseout', function ( d ) {
			var self, leg;

			self = d3.select( this )
				.interrupt();

			if ( !self.classed( 'selected' ) ) {
				self.transition()
					.ease( 'bounce' )
					.duration( 500 )
					.attr( 'd', arc );
			}

			leg = u
				.filter( function ( dd ) { return dd.data.id === d.data.id; } );

			leg.selectAll( 'text' )
				.attr( 'font-weight', null );

			leg.selectAll( 'circle' )
				.interrupt()
			.transition()
				.ease( 'bounce' )
				.duration( 500 )
				.attr( 'r', 5 );
		} );

	return {
		arc: arc,
		arcOver: arcOver,
		svg: svg,
		g: g,
		paths: paths
	};

};
