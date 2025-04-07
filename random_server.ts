// MCP server that returns random number

//import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { type Tool, type CallToolRequest } from "@modelcontextprotocol/sdk/types.js";
import {
    ListResourcesRequestSchema,
    ListToolsRequestSchema,
    CallToolRequestSchema,
  } from "@modelcontextprotocol/sdk/types.js";

console.error("[random-server] Initializing MCP server using SDK...");

// Define the get_uuid tool according to the SDK's Tool type
const GET_RANDOM_NUMBER_TOOL: Tool = {
    name: "get_random_number",
    description: "Generate a random number (integer)",
    inputSchema: {
      type: "object",
      properties: {}, // No input arguments needed
      required: [],
    },
    // Optional: Define expected output structure
    outputSchema: {
        type: "object",
        properties: {
            value: { type: "string", description: "random integer number as string" }
        },
        required: ["value"]
    }
};
const TOOLS: Tool[] = [GET_RANDOM_NUMBER_TOOL];

// Create the MCP server
const server = new Server(
    {
        // metadata about the server
        name: "Random Number Server",
        description: "A server that generates random numbers",
        version: "0.1.0",
    },
    {   
        // Declare the capabilities (tools and resources) provided
        capabilities: {
            resources: {}, // This server provides no resources
            tools: {},
        },
    }
);

// --- Register Request Handlers ---

// Handler for ListResources requests
server.setRequestHandler(ListResourcesRequestSchema, () => {
  console.error("[uuid-server] Received ListResources request.");
  // Return an empty list as this server provides no resources
  return { resources: [] };
});

// Handler for ListTools requests
server.setRequestHandler(ListToolsRequestSchema, () => {
  console.error("[uuid-server] Received ListTools request.");
  // Return the list of tools this server provides
  return { tools: TOOLS };
});

// Handler for CallTool requests
server.setRequestHandler(CallToolRequestSchema, (request: CallToolRequest) => {
    console.error(`[random-server] Received CallTool request: ${JSON.stringify(request.params)}`);
    const toolName = request.params.name;
    // Arguments are not needed for get_uuid, but could be accessed via request.params.arguments
  
    switch (toolName) {
      case "get_random_number": {
        try {
          // Generate random number
          // Using Math.random() to generate a random number between 0 and 100
          const randomNumber = Math.floor(Math.random() * 100);
          console.error(`[random-server] Generated random number: ${randomNumber}`);
          // Return the successful result payload.
          // The SDK will wrap this in the standard MCP response structure.
          // The structure should align with the conceptual output of the tool.
          // Return the successful result payload within the 'content' array.
          // The SDK expects the content to be structured according to the MCP spec.
          return {
            content: [{ type: "text", text: randomNumber.toString() }] // Return random number as plain text in content
          };
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error(`[random-server] Error generating random number: ${errorMessage}`);
          // Return an error structure. The SDK should format this correctly.
          // Based on the provided example, returning an object with isError: true
          // and a content array seems to be the pattern for signaling errors.
          return {
            content: [{ type: "text", text: `Failed to generate random number: ${errorMessage}` }],
            isError: true,
          };
        }
      }
      default: {
        // Handle requests for unknown tools
        console.error(`[random-server] Unknown tool requested: ${toolName}`);
        return {
          content: [{ type: "text", text: `Unknown tool: ${toolName}` }],
          isError: true,
        };
      }
    }
  });

  // ===== start server ====

  // --- Start the Server ---
  async function startServer() {
    try {
      // Connect the server using Standard Input/Output transport
      await server.connect(new StdioServerTransport());
      console.error("[random-server] MCP server connected via stdio and is running.");
    } catch (error) {
      console.error(`[random-server] Failed to start or connect the server: ${error}`);
      // Exit if the server cannot start, indicating a critical failure
      process.exit(1);
    }
  }
  

  // Execute the server startup logic
  startServer();
  