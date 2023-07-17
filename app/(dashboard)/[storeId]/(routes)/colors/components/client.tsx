"use client"
import {Heading} from "@/components/ui/Heading";
import {Button} from "@/components/ui/button";
import {PlusIcon} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {useParams, useRouter} from "next/navigation";
import {ColorColumn, columns} from "./columns";
import {DataTable} from "@/components/ui/data-table";
import {ApiList} from "@/components/ui/api-list";

interface ColorClientProps{
    data:ColorColumn[]
}
export const ColorClient:React.FC<ColorClientProps>=({
    data
                                                             })=>{
    const router=useRouter()
    const params=useParams()
    return(
        <>
        <div className={'flex justify-between items-center'}>
            <Heading title={`Colors (${data.length})`} description={"Colors of your store"}/>
            <Button onClick={()=>router.push(`/${params.storeId}/colors/new`)}>
                <PlusIcon className={'mr-2 h-4 w-4'}/>
                Add new
            </Button>
        </div>
            <Separator/>
            <DataTable columns={columns} data={data} searchKey={'name'}/>
            <Heading title={"API"} description={"API calls for colors"}/>
            <Separator/>
            <ApiList entityName={'colors'} entityIdName={'colorId'}/>
        </>
    )
}
