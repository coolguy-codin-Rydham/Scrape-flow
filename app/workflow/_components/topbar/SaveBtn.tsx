"use client";
import { Button } from "@/components/ui/button";
import { useReactFlow } from "@xyflow/react";
import { CheckIcon } from "lucide-react";
import React, { use } from "react";
import { useMutation } from "@tanstack/react-query";
import { UpdateWorkFlow } from "@/actions/workflows/updateWorkflow";
import { toast } from "sonner";

export default function SaveBtn({ workflowId }: { workflowId: string }) {
    const { toObject } = useReactFlow();
    const saveMutation = useMutation({
        mutationFn: UpdateWorkFlow,
        onSuccess: () => {
            toast.success("Workflow saved");
        },
        onError: () => {
            toast.error("Failed to save workflow"); 
        }
        
    })

    return (

        <Button
            variant={"outline"}
            className="flex items-center gap-2"
            onClick={() => {
                const workflowDef = JSON.stringify(toObject());
                toast.loading("Saving Workflow", { id: "save-workflow" });
                saveMutation.mutate({
                  id: workflowId,
                  definition: workflowDef,
                });
              }}
              disabled={saveMutation.isPending}
            >
            <CheckIcon size={16} className="| Istroke-green-400" />
            Save
        </Button>
    );
}