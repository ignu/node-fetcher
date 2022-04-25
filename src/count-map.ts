
const addNode = (node: string, nodes: Map<string, number>) => {
  const currentValue = nodes.get(node) 
  if(currentValue) {
    nodes.set(node, currentValue + 1)
  } else {
    nodes.set(node, 1)
  }
}
