import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './communityVisual.css';

const CommunityVisual = () => {

    const contacts = [
        { name: 'Person 1', frequency:"daily" },
        { name: 'Person 2', frequency:"weekly"},
        { name: 'Person 3', frequency:"yearly"},
    ]

    const svgRef = useRef();

    useEffect(() => {
      const width = 600;
      const height = 400;
      const userRadius = 30;
  
      const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height);
  
      // Create a circle for the user in the center
      const userCircle = svg.append('circle')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', userRadius)
        .style('fill', 'purple')
        .style('stroke-width', 2)
        .raise();
  
      // Define a scale for mapping frequency to both radius and distance
      const scale = d3.scaleOrdinal()
        .domain(['daily', 'weekly', 'monthly', 'yearly'])
        .range([{ radius: 30, distance: 80 }, { radius: 20, distance: 120 }, { radius: 15, distance: 160 }, { radius: 10, distance: 200 }]);
  
      // Calculate the positions of the contact circles
      const angleIncrement = (2 * Math.PI) / contacts.length;
  
      contacts.forEach((contact, index) => {
        const angle = index * angleIncrement;
        const { radius, distance } = scale(contact.frequency);
        const x = width / 2 + distance * Math.cos(angle);
        const y = height / 2 + distance * Math.sin(angle);
  
        // Create a circle for each contact
        svg.append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', radius)
          .style('fill', 'red');
  
        // Connect the user to the contact with a line
        svg.append('line')
          .attr('x1', width / 2)
          .attr('y1', height / 2)
          .attr('x2', x)
          .attr('y2', y)
          .style('stroke', 'black')
          .lower();
      });
    }, [contacts]);
  
    return <svg ref={svgRef}></svg>;
  };

export default CommunityVisual