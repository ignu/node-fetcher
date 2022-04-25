import axios from "axios";

const INITIAL_NODE = "089ef556-dfff-4ff2-9733-654645be56fe";
const BASE_URL = "https://nodes-on-nodes-challenge.herokuapp.com/nodes/";
type Node = { id: string; child_node_ids: string[] };

const nodeFetch = async (nodes: string[]) => {
  const url = `${BASE_URL}${nodes.join(",")}`;
  const values = await axios.get(url);
  const data = values.data as Node[];
  return [...new Set(data.map((n) => n.child_node_ids).flat())];
};

const incrementExistingNodes = async (
  fetchedNodes: string[],
  nodeMap: Map<string, number>
) => {
  const existingNodes = fetchedNodes.filter((n) => !!nodeMap.get(n));

  existingNodes.forEach((node) => {
    const currentValue = nodeMap.get(node);
    console.debug("🚀 incrementing", node, currentValue);

    // sorry TypeScript, we know this isn't undefined because of the filter above
    nodeMap.set(node, (currentValue as number) + 1);
  });
};

async function addNodes(nodes: string[], nodeMap: Map<string, number>) {
  //console.log("fetching", nodes);
  nodes.forEach((n) => nodeMap.set(n, 1));

  const fetchedNodes = await nodeFetch(nodes);

  incrementExistingNodes(fetchedNodes, nodeMap);

  const newNodes = fetchedNodes.filter((n) => {
    return !nodeMap.get(n);
  });
  if (!!newNodes.length) {
    await addNodes(newNodes, nodeMap);
  }
}

const getNodeValues = async (nodes: string[]) => {
  let nodeMap = new Map<string, number>();
  await addNodes(nodes, nodeMap);
  console.log("ℹ️ There are ", nodeMap.size, "unique nodes");
  const larget = Math.max(...nodeMap.values());
  nodeMap.forEach((value, key) => {
    if (value === larget) {
      console.log("The most shared node(s) is ", key, "with", value, "nodes");
    }
  });
};

const results = getNodeValues([INITIAL_NODE]);

console.log(results);
