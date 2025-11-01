import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

const projectsTitle = document.querySelector('.projects-title');
projectsTitle.textContent = `${projects.length} Projects`;

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
let legendContainer = d3.select('.legend');
let searchInput = document.querySelector('.searchBar');
let currentSearchQuery = '';
let newData = [];

function renderPieChart(ProjectsGiven){
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let newRolledData = d3.rollups(
        ProjectsGiven,
        (v) => v.length,
        (d) => d.year,
    );
    newData = newRolledData.map(([year, count]) => {
        return { value: count, label: year };
    });
    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
    let newArcs = newArcData.map((d) => arcGenerator(d));
    let colors = d3.scaleOrdinal(d3.schemeTableau10);
    let newSVG = d3.select('svg');
    let legend = d3.select('.legend');
    newSVG.selectAll('path').remove();

    newArcs.forEach((arc, idx) => {
        newSVG.append('path')
        .attr('d', arc)
        .attr('fill', colors(idx)) // Fill in the attribute for fill color via indexing the colors variable
        .on('click', () => {
            selectedIndex = selectedIndex === idx ? -1 : idx;
            newSVG
                .selectAll('path')
                .attr('class', (_, idx) => (
                idx === selectedIndex ? 'selected' : ''
                // TODO: filter idx to find correct pie slice and apply CSS from above
            ));
            legend
                .selectAll('li')
                .attr('class', (_, idx) => (
                idx === selectedIndex ? 'selected' : ''
                // TODO: filter idx to find correct legend and apply CSS from above
            ));
            if (selectedIndex === -1) {
                renderProjects(projects, projectsContainer, 'h2');
            } else {
                // TODO: filter projects and project them onto webpage
                // Hint: `.label` might be useful
                let selectedYear = newData[selectedIndex].label;
                let filteredProjects = setQuery(currentSearchQuery, selectedYear);
                renderProjects(filteredProjects, projectsContainer, 'h2');
            }
        });
    });
    legendContainer.selectAll('li').remove();
    newData.forEach((d, idx) => {
    legend
        .append('li')
        .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
        .attr('class', 'legend-item')
        .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
    });
}
let selectedIndex = -1;
renderPieChart(projects);
function setQuery(query, selectedYear) {
    query = query.toLowerCase();
    return projects.filter((project) => {
        let values = Object.values(project).join(' ').toLowerCase();
        let matchesSearchQuery = values.includes(query);
        let matchesYear = selectedYear ? project.year === selectedYear : true;
        return matchesSearchQuery && matchesYear;
    });
}
searchInput.addEventListener('change', (event) => {
    currentSearchQuery = event.target.value.toLowerCase();
    let selectedYear = newData[selectedIndex]?.label;
    let filteredProjects = setQuery(currentSearchQuery, selectedYear);
    // re-render legends and pie chart when event triggers
    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
});