const http = require("http"); // Built-in HTTP module for creating server
const fs = require("fs"); // File system module to read files
const path = require("path"); // Path module to handle file paths

// Create a server
const server = http.createServer((req, res) => {
  // Define the file path based on the requested URL
  let filePath = path.join(__dirname, req.url === "/" ? "index.html" : req.url);
  console.log(filePath);

  // Get the file extension
  const extname = path.extname(filePath);

  // Set the default content type
  let contentType = "text/html";

  // Change content type based on file extension
  if (extname === ".js") {
    contentType = "text/javascript";
  } else if (extname === ".css") {
    contentType = "text/css";
  } else if (extname === ".jpg" || extname === ".jpeg") {
    contentType = "image/jpeg";
  } else if (extname === ".png") {
    contentType = "image/png";
  } else if (extname === ".gif") {
    contentType = "image/gif";
  }

  // Read the requested file and serve it
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        // If the file is not found, serve error.html from the root
        fs.readFile(
          path.join(__dirname, "error.html"),
          (error, errorContent) => {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end(errorContent, "utf-8");
          },
        );
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // If the file is found, serve it
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

// Define the port and start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
