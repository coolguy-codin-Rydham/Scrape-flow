import { TaskType,TaskParamType } from "@/types/task";
import { GlobeIcon, LucideProps } from "lucide-react";

export const LaunchBrowserTask = {
    type: TaskType.LAUNCH_BROWSER,
    label: "Launch Browser",
    icon: (props: LucideProps) => (

        <GlobeIcon className="stroke-pink-400" {...props} />
    ),
    isEntryPoint: true,
    inputs:[
        {
            name: "Website Url",
            type: TaskParamType.STRING,
            helperText: "eg: https://www.google.com",
            isRequired: true,
            hideHandle:true,

        }
    ]
};