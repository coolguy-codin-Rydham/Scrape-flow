import { Skeleton } from '@/components/ui/skeleton'
import { Suspense } from 'react'
import { waitFor } from "@/lib/helper/waitFor"
import { GetWorkflowsForUser } from '@/actions/workflows/getWorkFlowsForUser'

export default function page() {
  return (
    <div className='flex-1 flex flex-col h-full'>
        <div className="flex justify-between">
            <div className="flex flex-col">
                <h1 className='text-3xl font-bold'>Workflows</h1>
                <p className='text-muted-foreground'>
                    Manage your workflows
                </p>
            </div>
        </div>

        <div className="h-full py-6">
            <Suspense fallback={<UserWorkflowsSkeleton/>}>
                <UserWorkflows/>
            </Suspense>
        </div>
    </div>
  )
}

function UserWorkflowsSkeleton() {
    return (
        <div className="space-y-2">
            {
                [1, 2, 3, 4].map((i)=>(
                    <Skeleton key = {i}/>
                ))
            }
        </div>
    )
}


async function UserWorkflows(){
    const workflows = await GetWorkflowsForUser();
    return <div></div>;
    }

