
"use client";

import { TaskType } from "@/types/task";
import { Workflow } from "@prisma/client";
import { Background, BackgroundVariant, Controls, ReactFlow, useEdgesState, useNodesState } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import NodeComponent from "./nodes/NodeComponent";
import { use, useEffect } from "react";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { AppNode } from "@/types/appNode";

const nodeTypes = {
    FlowScrapeNode: NodeComponent,
}

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = {
    padding: 1
};
function FlowEditor({ workflow }: { workflow: Workflow }) {
    const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const {  setViewport, screenToFlowPosition, } = useReactFlow();
    useEffect(() => {
        try {
          const flow = JSON.parse(workflow.definition);
          if (!flow) return;
          setNodes(flow.nodes || []);
          setEdges(flow.edges || []);

        } catch (error) {}
      }, [workflow, setEdges, setNodes, setViewport]);

      const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      }, []);

      const onDrop = useCallback(
        (event: React.DragEvent) => {
          event.preventDefault();
          const taskType = event.dataTransfer.getData("application/reactflow");
          if (typeof taskType === undefined || !taskType) return;
    
          const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          });
    
          const newNode = CreateFlowNode(taskType as TaskType, position);
          setNodes((nds) => nds.concat(newNode));
        },
        [setNodes, screenToFlowPosition]
      );
    

    return (
        <main className="h-full w-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onNodesChange={onNodesChange}
                nodeTypes={nodeTypes}
                snapToGrid={true}
                snapGrid={snapGrid}
                fitView={true}
                fitViewOptions={fitViewOptions}
                onDragOver={onDragOver}
                onDrop={onDrop}


            >
                <Controls position="top-left" fitViewOptions={fitViewOptions} />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
        </main>
    );
}
export default FlowEditor;