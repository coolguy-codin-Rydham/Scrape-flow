
"use client";

import { TaskType } from "@/types/task";
import { Workflow } from "@prisma/client";
import { Background, BackgroundVariant, Controls, ReactFlow, useEdgesState, useNodesState } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import NodeComponent from "./nodes/NodeComponent";
import { useEffect } from "react";
import { useReactFlow } from "@xyflow/react";

const nodeTypes = {
    FlowScrapeNode: NodeComponent,
}

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = {
    padding: 1
};
function FlowEditor({ workflow }: { workflow: Workflow }) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { setViewport } = useReactFlow();
    useEffect(() => {
        try {
          const flow = JSON.parse(workflow.definition);
          if (!flow) return;
          setNodes(flow.nodes || []);
          setEdges(flow.edges || []);

        } catch (error) {}
      }, [workflow, setEdges, setNodes, setViewport]);

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


            >
                <Controls position="top-left" fitViewOptions={fitViewOptions} />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
        </main>
    );
}
export default FlowEditor;