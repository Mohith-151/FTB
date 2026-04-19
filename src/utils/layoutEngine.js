import dagre from 'dagre';
import { NODE_WIDTH, NODE_HEIGHT, DAGRE_SETTINGS } from './constants';

export const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph(DAGRE_SETTINGS);

  // Separate spouses from regular vertical tree edges
  const regularEdges = edges.filter(e => e.data?.type !== 'spouse');
  const spouseEdges = edges.filter(e => e.data?.type === 'spouse');

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  regularEdges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate top-down layout for parents/children
  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
  });

  // Post-process: Force spouses strictly to the right of their partner
  spouseEdges.forEach((edge) => {
    const sourceNode = layoutedNodes.find(n => n.id === edge.source);
    const targetNodeIndex = layoutedNodes.findIndex(n => n.id === edge.target);
    
    if (sourceNode && targetNodeIndex !== -1) {
      layoutedNodes[targetNodeIndex].position = {
        x: sourceNode.position.x + NODE_WIDTH + 50, // 50px gap to the right
        y: sourceNode.position.y // Lock to the exact same vertical level
      };
    }
  });

  return layoutedNodes;
};

export const generateNodeId = () => {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createNode = (id, data) => {
  return {
    id,
    type: 'customNode',
    data: {
      name: data.name || 'Unnamed',
      age: data.age || '',
      status: data.status || 'alive',
    },
    position: { x: 0, y: 0 },
  };
};

export const createEdge = (sourceId, targetId, type = 'child') => {
  const isSpouse = type === 'spouse';
  return {
    id: `edge_${sourceId}_${targetId}`,
    source: sourceId,
    target: targetId,
    // Route from bottom-to-top for children, right-to-left for spouses
    sourceHandle: isSpouse ? 'right' : 'bottom',
    targetHandle: isSpouse ? 'left' : 'top',
    type: isSpouse ? 'straight' : 'smoothstep',
    data: { type },
    style: { 
      stroke: '#000', 
      strokeWidth: 1.5 
    },
  };
};