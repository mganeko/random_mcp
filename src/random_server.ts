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

// Define the get_random_number tool according to the SDK's Tool type
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

const GET_RANDOM_NUMBER_WITH_RANGE_TOOL: Tool = {
  name: "get_random_number_with_range",
  description: "Generate a random number win min max range (integer)",
  inputSchema: {
    type: "object",
    properties: {
      min: { type: "integer", description: "Minimum value" },
      max: { type: "integer", description: "Maximum value" },
    }, // min/max arguments needed
    required: ["min", "max"],
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

const ROLL_DICE_TOOL: Tool = {
  name: "get_rolled_dice_number",
  description: "roll a dice and get a random number from 1 to 6",
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

const TOOLS: Tool[] = [GET_RANDOM_NUMBER_TOOL, GET_RANDOM_NUMBER_WITH_RANGE_TOOL, ROLL_DICE_TOOL];

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

// // Handler for ListResources requests
// server.setRequestHandler(ListResourcesRequestSchema, () => {
//   console.error("[random-server] Received ListResources request.");
//   // Return an empty list as this server provides no resources
//   return { resources: [] };
// });

// Handler for ListTools requests
server.setRequestHandler(ListToolsRequestSchema, () => {
  console.error("[random-server] Received ListTools request.");
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

      case "get_random_number_with_range": {
        try {
          // Extract min and max from the request parameters
          const { min, max } = request.params.arguments as { min: number; max: number };
          // Validate the range
          if (min >= max) {
            throw new Error("Invalid range: min should be less than max.");
          }
          // Generate random number within the specified range
          const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
          console.error(`[random-server] Generated random number within range: ${randomNumber}`);
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
          console.error(`[random-server] Error generating random number with range: ${errorMessage}`);
          // Return an error structure. The SDK should format this correctly.
          // Based on the provided example, returning an object with isError: true
          // and a content array seems to be the pattern for signaling errors.
          return {
            content: [{ type: "text", text: `Failed to generate random number with range: ${errorMessage}` }],
            isError: true,
          };
        }
      }

      case "get_rolled_dice_number": {
        try {
          // Generate random number between 1 and 6 (simulating a dice roll)
          const randomNumber = Math.floor(Math.random() * 6) + 1;
          console.error(`[random-server] Generated random number (dice roll): ${randomNumber}`);
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
          console.error(`[random-server] Error generating random number of dice: ${errorMessage}`);
          // Return an error structure. The SDK should format this correctly.
          // Based on the provided example, returning an object with isError: true
          // and a content array seems to be the pattern for signaling errors.
          return {
            content: [{ type: "text", text: `Failed to generate random number of dice: ${errorMessage}` }],
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
  