"use client"

import {useOrigin} from "@/hooks/use-origin";
import {useParams} from "next/navigation";
import {ApiAlert} from "@/components/ui/api-alert";

interface ApiList{
    entityName:string,
    entityIdName:string
}
export const ApiList:React.FC<ApiList>=({
    entityName,entityIdName
                                        })=>{
    const origin=useOrigin();
    const params=useParams()

    const baseUrl=`${origin}/api/${params.storeId}`
    return(
       <>
       <ApiAlert title={"GET"} description={`${baseUrl}/${entityName}`} variant={"public"}/>
       <ApiAlert title={"GET"} description={`${baseUrl}/${entityName}/{${entityIdName}}`} variant={"public"}/>
           <ApiAlert title={"POST"} description={`${baseUrl}/${entityName}`} variant={"admin"}/>
           <ApiAlert title={"PATCH"} description={`${baseUrl}/${entityName}/{${entityIdName}}`} variant={"admin"}/>
           <ApiAlert title={"DELETE"} description={`${baseUrl}/${entityName}/{${entityIdName}}`} variant={"admin"}/>
       </>
    )
}