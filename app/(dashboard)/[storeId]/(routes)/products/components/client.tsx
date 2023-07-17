"use client"
import {Heading} from "@/components/ui/Heading";
import {Button} from "@/components/ui/button";
import {PlusIcon} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {useParams, useRouter} from "next/navigation";
import {ProductColumn, columns} from "./columns";
import {DataTable} from "@/components/ui/data-table";
import {ApiList} from "@/components/ui/api-list";

interface ProductClientProps{
    data:ProductColumn[]
}
export const ProductClient:React.FC<ProductClientProps>=({
    data
                                                             })=>{
    const router=useRouter()
    const params=useParams()
    return(
        <>
        <div className={'flex justify-between items-center'}>
            <Heading title={`Products (${data.length})`} description={"Products of your store"}/>
            <Button onClick={()=>router.push(`/${params.storeId}/products/new`)}>
                <PlusIcon className={'mr-2 h-4 w-4'}/>
                Add new
            </Button>
        </div>
            <Separator/>
            <DataTable columns={columns} data={data} searchKey={'name'}/>
            <Heading title={"API"} description={"API calls for products"}/>
            <Separator/>
            <ApiList entityName={'products'} entityIdName={'productId'}/>
        </>
    )
}
