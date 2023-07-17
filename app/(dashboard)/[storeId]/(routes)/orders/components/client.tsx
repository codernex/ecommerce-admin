"use client"
import {Heading} from "@/components/ui/Heading";
import {Separator} from "@/components/ui/separator";
import {OrderColumn, columns} from "./columns";
import {DataTable} from "@/components/ui/data-table";

interface BillboardClientProps{
    data:OrderColumn[]
}
export const OrderClient:React.FC<BillboardClientProps>=({
    data
                                                             })=>{
    return(
        <>
            <Heading title={`Orders (${data.length})`} description={"Orders of your store"}/>
            <Separator/>
            <DataTable columns={columns} data={data} searchKey={'label'}/>
        </>
    )
}
