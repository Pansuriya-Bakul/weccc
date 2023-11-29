import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './communityVisual.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFaceSmile } from '@fortawesome/free-solid-svg-icons'
import { set } from 'joi/lib/types/lazy';

const CommunityVisual = (props) => {

  const { reports, collection } = props;
  const [personalnetwork, setPersonalNetwork] = useState([]);
  const [informalCare, setInformalCare] = useState([]);
  const [formalCare, setFormalCare] = useState([]);

  const initPersonalNetwork = () => {
    let newPersonalNetwork = personalnetwork;

    // Add Family
    if (reports.total_relatives[collection] && reports.total_relatives[collection] !== 999) {

      const num_family = reports.total_relatives[collection];
      let familyFrequency = '';

      if (reports.frequency_of_contact_family[collection] && reports.frequency_of_contact_family[collection] !== 999) {
        familyFrequency = reports.frequency_of_contact_family[collection];
      }

      newPersonalNetwork.push({ name: `${num_family} Family Members`, frequency: familyFrequency });

    }

    // Add Friends
    if (reports.total_close_friends[collection] && reports.total_close_friends[collection] !== 999) {

      const num_friends = reports.total_close_friends[collection];
      let friendsFrequency = '';

      if (reports.frequency_of_contact_friends[collection] && reports.frequency_of_contact_friends[collection] !== 999) {
        friendsFrequency = reports.frequency_of_contact_friends[collection];
      }

      newPersonalNetwork.push({ name: `${num_friends} Friends`, frequency: friendsFrequency });

    }

    // Add Neighbours
    if (reports.total_well_known_neighbours[collection] && reports.total_well_known_neighbours[collection] !== 999) {

      const num_neighbours = reports.total_well_known_neighbours[collection];
      let neighboursFrequency = '';

      if (reports.frequency_of_contact_neighbours[collection] && reports.frequency_of_contact_neighbours[collection] !== 999) {
        neighboursFrequency = reports.frequency_of_contact_neighbours[collection];
      }

      newPersonalNetwork.push({ name: `${num_neighbours} Neighbours`, frequency: neighboursFrequency });
    }

    // Add Trusted People
    if (reports.trusted_people[collection] && reports.trusted_people[collection] !== 999) {

      const trusted = reports.trusted_people[collection];

      trusted.forEach((person) => {
        if (person.name != "" && person.name != " ") {
          newPersonalNetwork.push({ name: `${person.relation}, ${person.name}`, frequency: person.frequency });
        }

      });
    }

    setPersonalNetwork(newPersonalNetwork);

  }


  const initInformalCare = () => {
    let newInformalCare = informalCare;

    if (reports.support_informal[collection] && reports.support_informal[collection] !== 999) {
      newInformalCare.push({ name: 'Informal care', frequency: reports.support_informal[collection] });
    }

    setInformalCare(newInformalCare);


  }

  const initFormalCare = () => {
    let newFormalCare = formalCare;

    if (reports.support_healthcare[collection] && reports.support_healthcare[collection] !== 999) {
      newFormalCare.push({ name: 'Healthcare Provider', frequency: reports.support_healthcare[collection] });
    }

    
    if (reports.support_home_healthcare[collection] && reports.support_home_healthcare[collection] !== 999) {
      newFormalCare.push({ name: 'Homecare', frequency: reports.support_home_healthcare[collection] });
    }

    if (reports.support_private_healthcare[collection] && reports.support_private_healthcare[collection] !== 999) {
      newFormalCare.push({ name: 'Private home help', frequency: reports.support_private_healthcare[collection] });
    }

    if (reports.support_wellness_program[collection] && reports.support_wellness_program[collection] !== 999) {
      newFormalCare.push({ name: 'Wellness program', frequency: reports.support_wellness_program[collection] });
    }

    setFormalCare(newFormalCare);


  }

  const generatePersonalNetwork = (svg, scale, width, height) => {
    // Calculate the positions of the contact circles
    const startAngle =  180 * (Math.PI / 180);
    const endAngle = 270 * (Math.PI / 180);
    const totalAngle = Math.abs(endAngle - startAngle);
    const angleIncrement = totalAngle / (personalnetwork.length - 1);

    personalnetwork.forEach((contact, index) => {
      const angle = startAngle + index * angleIncrement;
      const { radius, distance } = scale(contact.frequency);
      const x = width / 2 + distance * Math.cos(angle);
      const y = height / 2 + distance * Math.sin(angle);

      // Create a circle for each contact
      svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', radius)
        .style('fill', '#008e9e');

      // Add the emoji
      svg.append('text')
        .attr('x', x)
        .attr('y', y - 12) // center the emoji in the circle
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '20px') // Increase the font size to make the emoji visible
        .text('👪');

      // Add the contact's name
      svg.append('foreignObject')
        .attr('x', x - radius)
        .attr('y', y + 12 - radius)
        .attr('width', radius * 2)
        .attr('height', radius * 2)
        .append('xhtml:div')
        .style('padding', '5px')
        .style('font-size', '10px')
        .style('color', 'white')
        .style('width', `${radius * 2}px`)
        .style('height', `${radius * 2}px`)
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('justify-content', 'center')
        .style('text-align', 'center')
        .style('overflow-wrap', 'break-word')
        .style('font-weight', '500')
        .text(contact.name);

      // Connect the user to the contact with a line
      svg.append('line')
        .attr('x1', width / 2)
        .attr('y1', height / 2)
        .attr('x2', x)
        .attr('y2', y)
        .style('stroke', 'black')
        .lower();
    });
  }

  const generateInformalCare = (svg, scale, width, height) => {
    // Convert angles to radians
    const startAngle =  300 * (Math.PI / 180);
    const endAngle = 360 * (Math.PI / 180);
    const totalAngle = Math.abs(endAngle - startAngle);
    const angleIncrement = (totalAngle / (personalnetwork.length - 1));

    informalCare.forEach((contact, index) => {
      const angle = startAngle + index * angleIncrement;
      const { radius, distance } = scale(contact.frequency);
      const x = width / 2 + distance * Math.cos(angle);
      const y = height / 2 + distance * Math.sin(angle);

      // Create a circle for each contact
      svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', radius)
        .style('fill', '#37765d');

      // Add the emoji
      svg.append('text')
        .attr('x', x)
        .attr('y', y - 12) // center the emoji in the circle
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '20px') // Increase the font size to make the emoji visible
        .text('🤝');

      // Add the contact's name
      svg.append('foreignObject')
        .attr('x', x - radius)
        .attr('y', y + 12 - radius)
        .attr('width', radius * 2)
        .attr('height', radius * 2)
        .append('xhtml:div')
        .style('padding', '5px')
        .style('font-size', '10px')
        .style('color', 'white')
        .style('width', `${radius * 2}px`)
        .style('height', `${radius * 2}px`)
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('justify-content', 'center')
        .style('text-align', 'center')
        .style('overflow-wrap', 'break-word')
        .style('font-weight', '500')
        .text(contact.name);

      // Connect the user to the contact with a line
      svg.append('line')
        .attr('x1', width / 2)
        .attr('y1', height / 2)
        .attr('x2', x)
        .attr('y2', y)
        .style('stroke', 'black')
        .lower();
    });
  }

  const generateFormalCare = (svg, scale, width, height) => {
    // Convert angles to radians
    const startAngle =  20 * (Math.PI / 180);
    const endAngle = 90 * (Math.PI / 180);
    const totalAngle = Math.abs(endAngle - startAngle);
    const angleIncrement = (totalAngle / (personalnetwork.length - 1));

    formalCare.forEach((contact, index) => {
      const angle = startAngle + index * angleIncrement;
      const { radius, distance } = scale(contact.frequency);
      const x = width / 2 + distance * Math.cos(angle);
      const y = height / 2 + distance * Math.sin(angle);

      // Create a circle for each contact
      svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', radius)
        .style('fill', '#f6546a');

      // Add the emoji
      svg.append('text')
        .attr('x', x)
        .attr('y', y - 12) // center the emoji in the circle
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-size', '20px') // Increase the font size to make the emoji visible
        .text('👩‍⚕️');

      // Add the contact's name
      svg.append('foreignObject')
        .attr('x', x - radius)
        .attr('y', y + 12 - radius)
        .attr('width', radius * 2)
        .attr('height', radius * 2)
        .append('xhtml:div')
        .style('padding', '5px')
        .style('font-size', '10px')
        .style('color', 'white')
        .style('width', `${radius * 2}px`)
        .style('height', `${radius * 2}px`)
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('justify-content', 'center')
        .style('text-align', 'center')
        .style('overflow-wrap', 'break-word')
        .style('font-weight', '500')
        .text(contact.name);

      // Connect the user to the contact with a line
      svg.append('line')
        .attr('x1', width / 2)
        .attr('y1', height / 2)
        .attr('x2', x)
        .attr('y2', y)
        .style('stroke', 'black')
        .lower();
    });
  }


  // const contacts = [
  //   { name: 'Person 1', frequency: "daily" },
  //   { name: 'Person 2', frequency: "weekly" },
  //   { name: 'Person 3', frequency: "yearly" },
  // ]

  useEffect(() => {
    initPersonalNetwork();
    initInformalCare();
    initFormalCare();
  }, [reports]);

  const svgRef = useRef();

  useEffect(() => {
    const width = 600;
    const height = 600;
    const userRadius = 45;

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

    // Add a smiley icon in the center of the user circle
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-size', '30px')
      .style('fill', 'white')
      .text('☺️');

    // Define a scale for mapping frequency to both radius and distance
    const scale = d3.scaleOrdinal()
      .domain(['Daily', 'Weekly', 'Monthly', '3-4 Times a year', 'Yearly'])
      .range([{ radius: 35, distance: 100 }, { radius: 35, distance: 160 }, { radius: 35, distance: 200 }, { radius: 35, distance: 210 }, { radius: 35, distance: 250 }]);

    generatePersonalNetwork(svg, scale, width, height);
    generateInformalCare(svg, scale, width, height);
    generateFormalCare(svg, scale, width, height);

  }, [personalnetwork]);

  return <svg ref={svgRef}></svg>;
};

export default CommunityVisual