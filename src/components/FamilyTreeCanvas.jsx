import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState } from 'reactflow';
import { toPng } from 'html-to-image';
import 'reactflow/dist/style.css';

import CustomNode from './CustomNode';
import ContextMenu from './ContextMenu';
import DataModal from './DataModal';
import { getLayoutedElements, generateNodeId, createNode, createEdge } from '../utils/layoutEngine';
import { PAPER_SIZES } from '../utils/constants';

const nodeTypes = { customNode: CustomNode };

const FamilyTreeCanvas = ({ initialPaperSize = 'A4 Portrait' }) => {
  const printRef = useRef(null);
  
  const [currentPaperSize, setCurrentPaperSize] = useState(initialPaperSize);
  const dimensions = PAPER_SIZES[currentPaperSize] || PAPER_SIZES['A4 Portrait'];

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [dataModal, setDataModal] = useState({ isOpen: false, relationType: null, sourceNodeId: null });
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const updateNodeData = useCallback((nodeId, updates) => {
    setNodes((nds) => nds.map((n) => n.id === nodeId ? { ...n, data: { ...n.data, ...updates } } : n));
  }, [setNodes]);

  const handleNameChange = useCallback((nodeId, newName) => {
    updateNodeData(nodeId, { name: newName });
  }, [updateNodeData]);

  // Map callbacks to nodes
  const nodesWithCallbacks = nodes.map((node) => ({
    ...node,
    data: { ...node.data, onNameChange: handleNameChange },
  }));

  const handleContextMenuSelect = useCallback((relationType) => {
    setDataModal({ isOpen: true, relationType, sourceNodeId: contextMenu.nodeId });
    setContextMenu(null);
  }, [contextMenu]);

  const handleDataSubmit = useCallback((formData) => {
    const { sourceNodeId, relationType } = dataModal;
    const newNodeId = generateNodeId();
    const newNode = createNode(newNodeId, formData);

    if (relationType === 'root') {
      setNodes([newNode]);
      setDataModal({ isOpen: false, relationType: null, sourceNodeId: null });
      return;
    }

    let newEdge = null;
    
    if (relationType === 'child') {
      newEdge = createEdge(sourceNodeId, newNodeId, 'child');
    } else if (relationType === 'parent') {
      newEdge = createEdge(newNodeId, sourceNodeId, 'child');
    } else if (relationType === 'sibling') {
      const parentEdge = edges.find(e => e.target === sourceNodeId && e.data?.type !== 'spouse');
      if (parentEdge) {
        newEdge = createEdge(parentEdge.source, newNodeId, 'child');
      }
    } else if (relationType === 'spouse') {
      newEdge = createEdge(sourceNodeId, newNodeId, 'spouse');
    }

    const updatedNodes = [...nodes, newNode];
    const updatedEdges = newEdge ? [...edges, newEdge] : edges;

    const layoutedNodes = getLayoutedElements(updatedNodes, updatedEdges);
    setNodes(layoutedNodes);
    if (newEdge) setEdges(updatedEdges);
    
    setDataModal({ isOpen: false, relationType: null, sourceNodeId: null });
  }, [dataModal, nodes, edges, setNodes, setEdges]);

  const handleNodeClick = useCallback((event, node) => setSelectedNodeId(node.id), []);
  
  const handlePaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setContextMenu(null);
  }, []);

  const handleDeleteNode = useCallback(() => {
    if (selectedNodeId) {
      setNodes((ns) => ns.filter((n) => n.id !== selectedNodeId));
      setEdges((es) => es.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
      setSelectedNodeId(null);
      setContextMenu(null);
    }
  }, [selectedNodeId, setNodes, setEdges]);

  const handleDownloadImage = useCallback(() => {
    if (printRef.current === null) return;

    // Filter out UI buttons so they don't appear in the downloaded image
    const filter = (node) => {
      if (node?.classList?.contains('no-print')) return false;
      return true;
    };

    toPng(printRef.current, { 
      filter: filter,
      quality: 1,
      backgroundColor: '#ffffff',
      pixelRatio: 3 
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `Family-Tree-${currentPaperSize.replace(' ', '-')}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Failed to export image', err);
      });
  }, [currentPaperSize]);

  return (
    <div className="canvas-container">
      <div className="toolbar no-print">
        <div className="toolbar-left">
          <h1>Family Tree Builder</h1>
          <select 
            className="paper-size-dropdown"
            value={currentPaperSize}
            onChange={(e) => setCurrentPaperSize(e.target.value)}
          >
            {Object.keys(PAPER_SIZES).map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        <button className="print-button" onClick={handleDownloadImage}>
          📸 Download Image
        </button>
      </div>

      <div className="canvas-wrapper">
        
        {/* ACTION PANEL */}
        {selectedNodeId && (
          <div className="action-panel no-print">
            <button 
              className="action-button add" 
              onClick={(e) => {
                const rect = e.target.getBoundingClientRect();
                setContextMenu({ 
                  nodeId: selectedNodeId, 
                  position: { x: rect.right + 10, y: rect.top } 
                });
              }}
            >
              ➕ Add Relation
            </button>
            <button className="action-button delete" onClick={handleDeleteNode}>
              🗑️ Delete Selected
            </button>
          </div>
        )}

        <div ref={printRef} className="print-canvas" style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px`, background: '#fff' }}>
          
          {/* EMPTY STATE */}
          {nodes.length === 0 && (
            <div className="empty-state no-print">
               <button className="start-button" onClick={() => setDataModal({ isOpen: true, relationType: 'root', sourceNodeId: null })}>
                 + Add First Person
               </button>
            </div>
          )}

          <ReactFlow
            nodes={nodesWithCallbacks}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            onPaneClick={handlePaneClick}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#e0e0e0" gap={16} size={1} className="no-print" />
            <Controls className="no-print" />
            <MiniMap className="no-print" nodeColor="#000" maskColor="rgba(240, 240, 240, 0.6)" />
          </ReactFlow>
        </div>
      </div>

      {contextMenu && (
        <ContextMenu position={contextMenu.position} onSelect={handleContextMenuSelect} onClose={() => setContextMenu(null)} />
      )}

      <DataModal
        isOpen={dataModal.isOpen}
        relationType={dataModal.relationType}
        onSubmit={handleDataSubmit}
        onClose={() => setDataModal({ isOpen: false, relationType: null, sourceNodeId: null })}
      />
    </div>
  );
};

export default FamilyTreeCanvas;