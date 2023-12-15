import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './communityVisual.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentsDollar, faFaceSmile, faLeaf } from '@fortawesome/free-solid-svg-icons'
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

      if (familyFrequency !== 'Never') {
        newPersonalNetwork.push({ name: `${num_family} Family Members`, frequency: familyFrequency });
      }

    }

    // Add Friends
    if (reports.total_close_friends[collection] && reports.total_close_friends[collection] !== 999) {

      const num_friends = reports.total_close_friends[collection];
      let friendsFrequency = '';

      if (reports.frequency_of_contact_friends[collection] && reports.frequency_of_contact_friends[collection] !== 999) {
        friendsFrequency = reports.frequency_of_contact_friends[collection];
      }

      if (friendsFrequency !== 'Never') {
        newPersonalNetwork.push({ name: `${num_friends} Friends`, frequency: friendsFrequency });
      }

    }

    // Add Neighbours
    if (reports.total_well_known_neighbours[collection] && reports.total_well_known_neighbours[collection] !== 999) {

      const num_neighbours = reports.total_well_known_neighbours[collection];
      let neighboursFrequency = '';

      if (reports.frequency_of_contact_neighbours[collection] && reports.frequency_of_contact_neighbours[collection] !== 999) {
        neighboursFrequency = reports.frequency_of_contact_neighbours[collection];
      }

      if (neighboursFrequency !== 'Never') {
        newPersonalNetwork.push({ name: `${num_neighbours} Neighbours`, frequency: neighboursFrequency });
      }
    }

    // Add Trusted People
    if (reports.trusted_people[collection] && reports.trusted_people[collection] !== 999) {

      const trusted = reports.trusted_people[collection];

      trusted.forEach((person) => {
        if (person.name != "" && person.name != " " && person.frequency != 'Never') {
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
    const startAngle = 180 * (Math.PI / 180);
    const endAngle = 270 * (Math.PI / 180);
    const totalAngle = Math.abs(endAngle - startAngle);
    const angleIncrement = totalAngle / (personalnetwork.length == 1 ? personalnetwork.length : personalnetwork.length - 1);

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
    const startAngle = 300 * (Math.PI / 180);
    const endAngle = 360 * (Math.PI / 180);
    const totalAngle = Math.abs(endAngle - startAngle);
    const angleIncrement = (totalAngle / (informalCare.length == 1 ? informalCare.length : informalCare.length - 1));

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
    const startAngle = 20 * (Math.PI / 180);
    const endAngle = 90 * (Math.PI / 180);
    const totalAngle = Math.abs(endAngle - startAngle);
    const angleIncrement = (totalAngle / (formalCare.length == 1 ? formalCare.length : formalCare.length - 1));

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

  // // Calculate circle radius based on number of contacts
  // const getRadius = (numContacts, defR) => {
  //   if (numContacts === 1) {
  //     // Handle special case when there is only one contact
  //     return [defR, defR - 40];
  //   }

  //   let radius = (35 / (Math.sin(Math.PI / numContacts)));
  //   const distance = radius;

  //   radius = radius + 40;


  //   return [radius, distance];
  // }

  // Calculate circle radius based on number of contacts
  const getRadius = (frequency, defR) => {
    let personal = [];
    let informal = [];
    let formal = [];

    if (personalnetwork) {
      personal = personalnetwork.filter(item => item.frequency === frequency);
    }
    if (informalCare) {
      informal = informalCare.filter(item => item.frequency === frequency);
    }
    if (formalCare) {
      formal = formalCare.filter(item => item.frequency === frequency);
    }

    const numContacts = personal.length + informal.length + formal.length;

    if (numContacts === 1 || numContacts === 0) {
      // Handle special case when there is only one contact
      return defR;
    }

    let radius = (35 / (Math.sin(Math.PI / numContacts)));

    if (radius < defR) {
      radius = defR;
    }

    return radius;
  }

  const generateCircle = (svg, scale, width, height, frequency, color, safeRadius) => {

    let personal = [];
    let informal = [];
    let formal = [];

    if (personalnetwork) {
      personal = personalnetwork.filter(item => item.frequency === frequency);
    }
    if (informalCare) {
      informal = informalCare.filter(item => item.frequency === frequency);
    }
    if (formalCare) {
      formal = formalCare.filter(item => item.frequency === frequency);
    }


    const totalCircles = personal.length + informal.length + formal.length;


    // const rad_and_distance = getRadius(totalCircles, maxR); //[radius, distance].
    const distance = safeRadius;
    const circleRadius = safeRadius + 35;

    // Create a circle
    const circle = svg.append('circle')
      .attr('cx', width / 2)
      .attr('cy', height / 2)
      .attr('r', circleRadius)
      .style('fill', color)
      .style('stroke', color)
      .style('stroke-width', 2);

    const angleIncrement = (2 * Math.PI) / (totalCircles == 0 ? 1 : totalCircles);
    let angle = 0;
    let radius = 35;
    let x = width / 2 + distance * Math.cos(angle);
    let y = height / 2 + distance * Math.sin(angle);

    // Daily Personal Network
    personal.forEach((contact, index) => {
      x = width / 2 + distance * Math.cos(angle);
      y = height / 2 + distance * Math.sin(angle);

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
        .style('font-size', '18px')
        .text('👪');

      // Add the contact's name
      svg.append('foreignObject')
        .attr('x', x - radius)
        .attr('y', y + 12 - radius)
        .attr('width', radius * 2)
        .attr('height', radius * 2)
        .append('xhtml:div')
        .style('padding', '3px')
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

      angle = angle + angleIncrement;
    });

    // Daily Informal Care
    informal.forEach((contact, index) => {
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
        .style('font-size', '18px') // Increase the font size to make the emoji visible
        .text('🤝');

      // Add the contact's name
      svg.append('foreignObject')
        .attr('x', x - radius)
        .attr('y', y + 12 - radius)
        .attr('width', radius * 2)
        .attr('height', radius * 2)
        .append('xhtml:div')
        .style('padding', '3px')
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
      angle = angle + angleIncrement;
    });

    // Daily Formal Care
    formal.forEach((contact, index) => {
      x = width / 2 + distance * Math.cos(angle);
      y = height / 2 + distance * Math.sin(angle);

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
        .style('font-size', '18px') // Increase the font size to make the emoji visible
        .text('👩‍⚕️');

      // Add the contact's name
      svg.append('foreignObject')
        .attr('x', x - radius)
        .attr('y', y + 12 - radius)
        .attr('width', radius * 2)
        .attr('height', radius * 2)
        .append('xhtml:div')
        .style('padding', '3px')
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

      angle = angle + angleIncrement;
    });

  }

  // // generates weekly circle
  // const generateWeeklyCircle = (svg, scale, width, height) => {
  //   let weeklyPersonal = [];
  //   let weeklyInformal = [];
  //   let weeklyFormal = [];

  //   if (personalnetwork) {
  //     weeklyPersonal = personalnetwork.filter(item => item.frequency === 'Weekly');
  //   }
  //   if (informalCare) {
  //     weeklyInformal = informalCare.filter(item => item.frequency === 'Weekly');
  //   }
  //   if (formalCare) {
  //     weeklyFormal = formalCare.filter(item => item.frequency === 'Weekly');
  //   }

  //   const totalCircles = dailyPersonal.length + dailyInformal.length + dailyFormal.length;
  //   const dailyRadius = getRadius(totalCircles, 150);

  //   // Create a Daily circle
  //   const dailyCircle = svg.append('circle')
  //     .attr('cx', width / 2)
  //     .attr('cy', height / 2)
  //     .attr('r', dailyRadius)
  //     .style('fill', '#D5E8D4')
  //     .style('stroke', '#D5E8D4') 
  //     .style('stroke-width', 2);

  //   const angleIncrement = (2 * Math.PI) / totalCircles;
  //   let angle = 0;
  //   let { radius, distance } = scale('Daily');
  //   let x = width / 2 + distance * Math.cos(angle);
  //   let y = height / 2 + distance * Math.sin(angle);

  //   // Daily Personal Network
  //   dailyPersonal.forEach((contact, index) => {
  //     x = width / 2 + distance * Math.cos(angle);
  //     y = height / 2 + distance * Math.sin(angle);

  //     // Create a circle for each contact
  //     svg.append('circle')
  //       .attr('cx', x)
  //       .attr('cy', y)
  //       .attr('r', radius)
  //       .style('fill', '#008e9e');

  //     // Add the emoji
  //     svg.append('text')
  //       .attr('x', x)
  //       .attr('y', y - 12) // center the emoji in the circle
  //       .attr('text-anchor', 'middle')
  //       .attr('dominant-baseline', 'middle')
  //       .style('font-size', '20px') // Increase the font size to make the emoji visible
  //       .text('👪');

  //     // Add the contact's name
  //     svg.append('foreignObject')
  //       .attr('x', x - radius)
  //       .attr('y', y + 12 - radius)
  //       .attr('width', radius * 2)
  //       .attr('height', radius * 2)
  //       .append('xhtml:div')
  //       .style('padding', '5px')
  //       .style('font-size', '10px')
  //       .style('color', 'white')
  //       .style('width', `${radius * 2}px`)
  //       .style('height', `${radius * 2}px`)
  //       .style('display', 'flex')
  //       .style('align-items', 'center')
  //       .style('justify-content', 'center')
  //       .style('text-align', 'center')
  //       .style('overflow-wrap', 'break-word')
  //       .style('font-weight', '500')
  //       .text(contact.name);

  //     angle = angle + angleIncrement;
  //   });

  //   // Daily Informal Care
  //   dailyInformal.forEach((contact, index) => {
  //     const x = width / 2 + distance * Math.cos(angle);
  //     const y = height / 2 + distance * Math.sin(angle);

  //     // Create a circle for each contact
  //     svg.append('circle')
  //       .attr('cx', x)
  //       .attr('cy', y)
  //       .attr('r', radius)
  //       .style('fill', '#37765d');

  //     // Add the emoji
  //     svg.append('text')
  //       .attr('x', x)
  //       .attr('y', y - 12) // center the emoji in the circle
  //       .attr('text-anchor', 'middle')
  //       .attr('dominant-baseline', 'middle')
  //       .style('font-size', '20px') // Increase the font size to make the emoji visible
  //       .text('🤝');

  //     // Add the contact's name
  //     svg.append('foreignObject')
  //       .attr('x', x - radius)
  //       .attr('y', y + 12 - radius)
  //       .attr('width', radius * 2)
  //       .attr('height', radius * 2)
  //       .append('xhtml:div')
  //       .style('padding', '5px')
  //       .style('font-size', '10px')
  //       .style('color', 'white')
  //       .style('width', `${radius * 2}px`)
  //       .style('height', `${radius * 2}px`)
  //       .style('display', 'flex')
  //       .style('align-items', 'center')
  //       .style('justify-content', 'center')
  //       .style('text-align', 'center')
  //       .style('overflow-wrap', 'break-word')
  //       .style('font-weight', '500')
  //       .text(contact.name);

  //     angle = angle + angleIncrement;
  //   });

  //   // Daily Formal Care
  //   dailyFormal.forEach((contact, index) => {
  //     x = width / 2 + distance * Math.cos(angle);
  //     y = height / 2 + distance * Math.sin(angle);

  //     // Create a circle for each contact
  //     svg.append('circle')
  //       .attr('cx', x)
  //       .attr('cy', y)
  //       .attr('r', radius)
  //       .style('fill', '#f6546a');

  //     // Add the emoji
  //     svg.append('text')
  //       .attr('x', x)
  //       .attr('y', y - 12) // center the emoji in the circle
  //       .attr('text-anchor', 'middle')
  //       .attr('dominant-baseline', 'middle')
  //       .style('font-size', '20px') // Increase the font size to make the emoji visible
  //       .text('👩‍⚕️');

  //     // Add the contact's name
  //     svg.append('foreignObject')
  //       .attr('x', x - radius)
  //       .attr('y', y + 12 - radius)
  //       .attr('width', radius * 2)
  //       .attr('height', radius * 2)
  //       .append('xhtml:div')
  //       .style('padding', '5px')
  //       .style('font-size', '10px')
  //       .style('color', 'white')
  //       .style('width', `${radius * 2}px`)
  //       .style('height', `${radius * 2}px`)
  //       .style('display', 'flex')
  //       .style('align-items', 'center')
  //       .style('justify-content', 'center')
  //       .style('text-align', 'center')
  //       .style('overflow-wrap', 'break-word')
  //       .style('font-weight', '500')
  //       .text(contact.name);

  //     angle = angle + angleIncrement;
  //   });

  // };



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

    const width = 950;
    const height = 950;
    const userRadius = 35;

    // Define a scale for mapping frequency to both radius and distance
    const scale = d3.scaleOrdinal()
      .domain(['Daily', 'Weekly', 'Monthly', '3-4 Times a Year', 'Yearly'])
      .range([{ radius: 25, distance: 90 }, { radius: 25, distance: 190 }, { radius: 25, distance: 280 }, { radius: 25, distance: 210 }, { radius: 25, distance: 250 }]);

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const dailyRadius = getRadius('Daily', 50);
    console.log("Daily Radius: " + dailyRadius);
    const weeklyRadius = getRadius('Weekly', dailyRadius + 70);
    console.log("Weekly Radius: " + weeklyRadius);
    const monthlyRadius = getRadius('Monthly', weeklyRadius + 70);
    console.log("Monthly Radius: " + monthlyRadius);
    const threeFourRadius = getRadius('3-4 Times a Year', monthlyRadius + 70);
    console.log("3-4 Times a Year Radius: " + threeFourRadius);
    const yearlyRadius = getRadius('Yearly', threeFourRadius + 70);
    console.log("Yearly Radius: " + yearlyRadius);


    // Create Yearly Circle
    generateCircle(svg, scale, width, height, 'Yearly', '#B1DDF0', yearlyRadius);

    // Create 3-4 Times a Year Circle
    generateCircle(svg, scale, width, height, '3-4 Times a Year', '#FAD9D5', threeFourRadius);
    // Create Monthly Circle
    generateCircle(svg, scale, width, height, 'Monthly', '#FFE6CC', monthlyRadius);
    // Create Weekly Circle
    generateCircle(svg, scale, width, height, 'Weekly', '#FFF2CC', weeklyRadius);
    // Create Daily Circle
    generateCircle(svg, scale, width, height, 'Daily', '#D5E8D4', dailyRadius);





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

    // generatePersonalNetwork(svg, scale, width, height);
    // generateInformalCare(svg, scale, width, height);
    // generateFormalCare(svg, scale, width, height);


  }, [personalnetwork, informalCare, formalCare]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <svg ref={svgRef}></svg>

      {/* color legends */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* color legend for care type */}
        <table>
          <tr>
            <td>
              <div style={{ backgroundColor: '#008e9e', width: '30px', height: '30px', borderRadius: '100%' }}></div>
            </td>
            <td>
              <span>Personal Network (People I'm close to)</span>
            </td>
          </tr>
          <tr>
            <td>
              <div style={{ backgroundColor: '#37765d', width: '30px', height: '30px', borderRadius: '100%' }}></div>
            </td>
            <td>
              <span>Informal Care (Others who support me)</span>
            </td>
          </tr>
          <tr>
            <td>
              <div style={{ backgroundColor: '#f6546a', width: '30px', height: '30px', borderRadius: '100%' }}></div>
            </td>
            <td>
              <span>Formal Care Network</span>
            </td>
          </tr>
        </table>

        {/* color legend for frequency */}
        <table>
          <tr>
            <td>
              <div style={{ backgroundColor: '#D5E8D4', width: '30px', height: '10px' }}></div>
            </td>
            <td style={{ paddingRight: '10px' }}>
              <span>Daily</span>
            </td>
            <td>
              <div style={{ backgroundColor: '#FFF2CC', width: '30px', height: '10px' }}></div>
            </td>
            <td style={{ paddingRight: '10px' }}>
              <span>Weekly</span>
            </td>
            <td>
              <div style={{ backgroundColor: '#FFE6CC', width: '30px', height: '10px' }}></div>
            </td>
            <td style={{ paddingRight: '10px' }}>
              <span>Monthly</span>
            </td>
            <td>
              <div style={{ backgroundColor: '#FAD9D5', width: '30px', height: '10px' }}></div>
            </td>
            <td style={{ paddingRight: '10px' }}>
              <span>3-4 Times a Year</span>
            </td>
            <td>
              <div style={{ backgroundColor: '#B1DDF0', width: '30px', height: '10px' }}></div>
            </td>
            <td style={{ paddingRight: '10px' }}>
              <span>Yearly</span>
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default CommunityVisual