"use client"
import {Heading} from "@/components/ui/Heading";
import {Button} from "@/components/ui/button";
import {PlusIcon} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {useParams, useRouter} from "next/navigation";
import {BillboardColumn, columns} from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/columns";
import {DataTable} from "@/components/ui/data-table";
import {da} from "date-fns/locale";
import {ApiList} from "@/components/ui/api-list";

interface BillboardClientProps{
    data:BillboardColumn[]
}
export const BillboardClient:React.FC<BillboardClientProps>=({
    data
                                                             })=>{
    const router=useRouter()
    const params=useParams()
    return(
        <>
        <div className={'flex justify-between items-center'}>
            <Heading title={`Billboards (${data.length})`} description={"Bill boards of your store"}/>
            <Button onClick={()=>router.push(`/${params.storeId}/billboards/new`)}>
                <PlusIcon className={'mr-2 h-4 w-4'}/>
                Add new
            </Button>
        </div>
            <Separator/>
            <DataTable columns={columns} data={data} searchKey={'label'}/>
            <Heading title={"API"} description={"API calls for billboards"}/>
            <Separator/>
            <ApiList entityName={'billboards'} entityIdName={'billboardId'}/>
        </>
    )
}
