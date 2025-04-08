import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "node",
  args: [
    "./dist/random_server.js",
  ],
});

const client = new Client({ name: "example-client", version: "1.0.0" });

await client.connect(transport);

console.log("MCP client connected");

console.log("---- Listing tools ----");
const tools = await client.listTools();
console.dir(tools, { depth: null });

console.log("---- call tool ----");
const result = await client.callTool({
  name: "get_random_number",
  arguments: {
  },
});
console.dir(result, { depth: null });

await client.close();
