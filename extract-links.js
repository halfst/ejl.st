const fs = require('fs');
const path = require('path');

// Function to extract links in the format [[Note Title]] from a given file
const extractLinksFromFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const linkRegex = /\[\[([^\]]+)\]\]/g;
  const links = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    links.push(match[1]);
  }

  return links;
};

// Function to generate graph data from markdown files in a specific directory
const generateGraphData = (contentDir) => {
  const nodes = [];
  const links = [];

  // Read directory and iterate over each markdown file
  fs.readdirSync(contentDir).forEach((file) => {
    if (path.extname(file) === '.md') {
      const filePath = path.join(contentDir, file);
      const noteId = path.basename(file, '.md');
      
      nodes.push({ id: noteId, title: noteId });

      const extractedLinks = extractLinksFromFile(filePath);
      extractedLinks.forEach((target) => {
        links.push({ source: noteId, target });
      });
    }
  });

  return { nodes, links };
};

// Define the correct directory to process
const contentDir = path.join(__dirname, 'content', 'zk', 'main');
const graphData = generateGraphData(contentDir);

// Create the JSON file in the static directory
const outputDir = path.join(__dirname, 'static');
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outputDir, 'graph-data.json'),
  JSON.stringify(graphData, null, 2),
  'utf-8'
);

console.log('Graph data generated successfully from content/zk/main!');