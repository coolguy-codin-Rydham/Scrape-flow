"use client";

import { TaskType } from "@/types/task";
import { Workflow } from "@prisma/client";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  Connection,
  addEdge,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import NodeComponent from "./nodes/NodeComponent";
import { use, useEffect } from "react";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { AppNode } from "@/types/appNode";
import DeletetableEdge from "./edges/DeletetableEdge";
import { TaskRegistry } from "@/lib/workflow/task/registry";

const nodeTypes = {
  FlowScrapeNode: NodeComponent,
};

const edgeTypes = {
  default: DeletetableEdge,
};

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = {
  padding: 1,
};
function FlowEditor({ workflow }: { workflow: Workflow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();
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
    [setNodes, screenToFlowPosition],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
      if (!connection.targetHandle) return;
      const node = nodes.find((node) => node.id === connection.target);
      if (!node) return;
      const nodeInputs = node.data.inputs;
      updateNodeData(node.id, {
        inputs: {
          ...nodeInputs,
          [connection.targetHandle]: "",
        },
      });
    },

    [setEdges, updateNodeData, nodes],
  );

  const isValidConnection = useCallback((connection: Edge | Connection) => {
    // No self Connections allowed
    if (connection.source === connection.target) return false;

    // No taskparam type connections
    const source = nodes.find((node) => node.id === connection.source);
    const target = nodes.find((node) => node.id === connection.target);

    if (!source || !target) {
      console.error("Source or target not found", source, target);
      return false;
    }

    const sourceTask = TaskRegistry[source.data.type];
    const targetTask = TaskRegistry[target.data.type];

    const output = sourceTask.outputs.find(
      (o) => o.name === connection.sourceHandle,
    );
    const input = targetTask.inputs.find(
      (i) => i.name === connection.targetHandle,
    );

    if (input?.type !== output?.type) {
      console.error("Invalid Connection: type mismatch");
      return false;
    }

    console.log("@@DEBUG", output, input);
    return true;
  }, []);

  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid={true}
        snapGrid={snapGrid}
        fitView={true}
        fitViewOptions={fitViewOptions}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
}
export default FlowEditor;
