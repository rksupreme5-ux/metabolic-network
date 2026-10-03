// Dataset representing the pathways, precursors, and amino acids
const graphData = {
    nodes: [
        { id: "Citric Acid Cycle", group: "tca", type: "pathway", size: 25 },
        { id: "Glycolysis", group: "gly", type: "pathway", size: 25 },
        { id: "Pentose Phosphate Pathway", group: "ppp", type: "pathway", size: 25 },
        { id: "Oxaloacetate", group: "tca", type: "precursor", size: 15 },
        { id: "a-Ketoglutarate", group: "tca", type: "precursor", size: 15 },
        { id: "Pyruvate", group: "gly", type: "precursor", size: 15 },
        { id: "3-Phosphoglycerate", group: "gly", type: "precursor", size: 15 },
        { id: "Ribose 5-phosphate", group: "ppp", type: "precursor", size: 15 },
        { id: "PEP + Erythrose 4-phosphate", group: "ppp", type: "precursor", size: 15 },
        { id: "Aspartate", group: "tca", type: "amino", size: 8 },
        { id: "Asparagine", group: "tca", type: "amino", size: 8 },
        { id: "Methionine", group: "tca", type: "amino", size: 8 },
        { id: "Threonine", group: "tca", type: "amino", size: 8 },
        { id: "Isoleucine", group: "tca", type: "amino", size: 8 },
        { id: "Lysine", group: "tca", type: "amino", size: 8 },
        { id: "Glutamate", group: "tca", type: "amino", size: 8 },
        { id: "Glutamine", group: "tca", type: "amino", size: 8 },
        { id: "Proline", group: "tca", type: "amino", size: 8 },
        { id: "Arginine", group: "tca", type: "amino", size: 8 },
        { id: "Alanine", group: "gly", type: "amino", size: 8 },
        { id: "Valine", group: "gly", type: "amino", size: 8 },
        { id: "Leucine", group: "gly", type: "amino", size: 8 },
        { id: "Serine", group: "gly", type: "amino", size: 8 },
        { id: "Cysteine", group: "gly", type: "amino", size: 8 },
        { id: "Glycine", group: "gly", type: "amino", size: 8 },
        { id: "Histidine", group: "ppp", type: "amino", size: 8 },
        { id: "Tryptophan", group: "ppp", type: "amino", size: 8 },
        { id: "Phenylalanine", group: "ppp", type: "amino", size: 8 },
        { id: "Tyrosine", group: "ppp", type: "amino", size: 8 }
    ],
    links: [
        { source: "Citric Acid Cycle", target: "Oxaloacetate" },
        { source: "Citric Acid Cycle", target: "a-Ketoglutarate" },
        { source: "Glycolysis", target: "Pyruvate" },
        { source: "Glycolysis", target: "3-Phosphoglycerate" },
        { source: "Pentose Phosphate Pathway", target: "Ribose 5-phosphate" },
        { source: "Pentose Phosphate Pathway", target: "PEP + Erythrose 4-phosphate" },
        { source: "Oxaloacetate", target: "Aspartate" },
        { source: "Aspartate", target: "Asparagine" },
        { source: "Aspartate", target: "Methionine" },
        { source: "Aspartate", target: "Threonine" },
        { source: "Threonine", target: "Isoleucine" },
        { source: "Aspartate", target: "Lysine" },
        { source: "a-Ketoglutarate", target: "Glutamate" },
        { source: "Glutamate", target: "Glutamine" },
        { source: "Glutamate", target: "Proline" },
        { source: "Glutamate", target: "Arginine" },
        { source: "Pyruvate", target: "Alanine" },
        { source: "Pyruvate", target: "Valine" },
        { source: "Pyruvate", target: "Leucine" },
        { source: "3-Phosphoglycerate", target: "Serine" },
        { source: "Serine", target: "Cysteine" },
        { source: "Serine", target: "Glycine" },
        { source: "Ribose 5-phosphate", target: "Histidine" },
        { source: "PEP + Erythrose 4-phosphate", target: "Tryptophan" },
        { source: "PEP + Erythrose 4-phosphate", target: "Phenylalanine" },
        { source: "PEP + Erythrose 4-phosphate", target: "Tyrosine" }
    ]
};

let width = window.innerWidth;
let height = window.innerHeight;

// Spawn all nodes near the center initially so they explode outward naturally
graphData.nodes.forEach(node => {
    node.x = width / 2 + (Math.random() - 0.5) * 100;
    node.y = height / 2 + (Math.random() - 0.5) * 100;
});

const colorMap = { "tca": "#7b9eb6", "gly": "#72a95f", "ppp": "#d89f81" };

const svg = d3.select("#graph-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const simulation = d3.forceSimulation(graphData.nodes)
    .force("link", d3.forceLink(graphData.links).id(d => d.id).distance(90))
    .force("charge", d3.forceManyBody().strength(-400)) 
    .force("collide", d3.forceCollide().radius(d => d.size + 20));

const link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graphData.links)
    .enter().append("line")
    .attr("class", "link")
    .attr("stroke-width", 2)
    .style("stroke-opacity", 0.6); // Hardcoded opacity so it never changes

const node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("g")
    .data(graphData.nodes)
    .enter().append("g")
    .attr("class", "node")
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

node.append("circle")
    .attr("r", d => d.size)
    .style("fill", d => colorMap[d.group]);

node.append("text")
    .attr("dy", d => d.size + 15)
    .attr("text-anchor", "middle")
    .text(d => d.id);

// Double-click to unpin a node
node.on("dblclick", function(event, d) {
    d.fx = null;
    d.fy = null;
    simulation.alpha(0.3).restart();
});

window.addEventListener("resize", () => {
    width = window.innerWidth;
    height = window.innerHeight;
    svg.attr("width", width).attr("height", height);
    simulation.alpha(0.3).restart();
});

simulation.on("tick", () => {
    node.attr("transform", d => {
        const radius = d.size + 15;
        d.x = Math.max(radius, Math.min(width - radius, d.x));
        d.y = Math.max(radius, Math.min(height - radius, d.y));
        return `translate(${d.x},${d.y})`;
    });

    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
});

function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    // Node remains pinned at drop location
}