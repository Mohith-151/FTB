// Paper dimensions in pixels at 96 DPI (web standard)
// A4 = 210mm × 297mm, A3 = 297mm × 420mm
export const PAPER_SIZES = {
  'A4 Portrait': { width: 794, height: 1123, label: 'A4 Portrait' },
  'A4 Landscape': { width: 1123, height: 794, label: 'A4 Landscape' },
  'A3 Portrait': { width: 1123, height: 1587, label: 'A3 Portrait' },
  'A3 Landscape': { width: 1587, height: 1123, label: 'A3 Landscape' },
};

// Node dimensions
export const NODE_WIDTH = 180;
export const NODE_HEIGHT = 90;

// Dagre graph settings
export const DAGRE_SETTINGS = {
  rankdir: 'TB', // Top to Bottom
  nodesep: 60,   // Horizontal spacing between nodes
  ranksep: 80,   // Vertical spacing between ranks
};

// Relation types for context menu
export const RELATION_TYPES = {
  PARENT: 'parent',
  SPOUSE: 'spouse',
  SIBLING: 'sibling',
  CHILD: 'child',
};
