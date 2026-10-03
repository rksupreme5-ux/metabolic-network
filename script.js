// Dataset representing the pathways, precursors, and amino acids
const graphData = {
    nodes: [
        // Core Pathways (Size: 25)
        { id: "Citric Acid Cycle", group: "tca", type: "pathway", size: 25 },
        { id: "Glycolysis", group: "gly", type: "pathway", size: 25 },
        { id: "Pentose Phosphate Pathway", group: "ppp", type: "pathway", size: 25 },

        // Precursors (Size: 15)
        { id: "Oxaloacetate", group: "tca", type: "precursor", size: 15 },
        { id: "a-Ketoglutarate", group: "tca", type: "precursor", size: 15 },
        { id: "Pyruvate", group: "gly", type: "precursor", size: 15 },
        { id: "3-Phosphoglycerate", group: "gly", type: "precursor", size: 15 },
        { id: "Ribose 5-phosphate", group: "ppp", type: "precursor", size: 15 },
        { id: "PEP + Erythrose 4-phosphate", group: "ppp", type: "precursor", size: 15 },

        // Amino Acids (Size: 8)
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

const width = window.innerWidth;
const height = window.innerHeight;
const colorMap = {
    "tca": "#7b9eb6",
    "gly": "#72a95f",
    "ppp": "#d89f81"
};

const svg = d3.select("#graph-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// UPDATED PHYSICS: Removed the distance cap on charge so they spread out, 
// and vastly weakened the X/Y forces so they float freely.
const simulation = d3.forceSimulation(graphData.nodes)
    .force("link", d3.forceLink(graphData.links).id(d => d.id).distance(60))
    .force("charge", d3.forceManyBody().strength(-300)) 
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("x", d3.forceX(width / 2).strength(0.015)) // Relaxed pull to center
    .force("y", d3.forceY(height / 2).strength(0.015)) // Relaxed pull to center
    .force("collide", d3.forceCollide().radius(d => d.size + 15));

const link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graphData.links)
    .enter().append("line")
    .attr("class", "link")
    .attr("stroke-width", 2);

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

const linkedByIndex = {};
graphData.links.forEach(d => {
    linkedByIndex[`${d.source.id},${d.target.id}`] = true;
    linkedByIndex[`${d.target.id},${d.source.id}`] = true;
});

function isConnected(a, b) {
    return linkedByIndex[`${a.id},${b.id}`] || a.id === b.id;
}

node.on("mouseover", function(event, d) {
    node.style("opacity", o => isConnected(d, o) ? 1 : 0.1);
    link.style("stroke-opacity", o => (o.source.id === d.id || o.target.id === d.id) ? 1 : 0.1)
        .style("stroke-width", o => (o.source.id === d.id || o.target.id === d.id) ? 3 : 1);
})
.on("mouseout", function() {
    node.style("opacity", 1);
    link.style("stroke-opacity", 0.6)
        .style("stroke-width", 2);
});

// The strict bounding box keeps them from ever leaving the screen edges.
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
    d.fx = null; 
    d.fy = null;
}