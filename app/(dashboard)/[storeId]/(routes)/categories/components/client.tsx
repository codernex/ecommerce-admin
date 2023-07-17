"use client"
import {Heading} from "@/components/ui/Heading";
import {Button} from "@/components/ui/button";
import {PlusIcon} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {useParams, useRouter} from "next/navigation";
import {DataTable} from "@/components/ui/data-table";
import {ApiList} from "@/components/ui/api-list";
import {CategoryColumn,columns} from "./columns";

interface CategoryClientProps{
    data:CategoryColumn[]
}
export const CategoryClient:React.FC<CategoryClientProps>=({
    data
                                                             })=>{
    const router=useRouter()
    const params=useParams()
    return(
        <>
        <div className={'flex justify-between items-center'}>
            <Heading title={`Categories (${data.length})`} description={"Categories of your store"}/>
            <Button onClick={()=>router.push(`/${params.storeId}/categories/new`)}>
                <PlusIcon className={'mr-2 h-4 w-4'}/>
                Add new
            </Button>
        </div>
            <Separator/>
            <DataTable columns={columns} data={data} searchKey={'label'}/>
            <Heading title={"API"} description={"API calls for Categories"}/>
            <Separator/>
            <ApiList entityName={'categories'} entityIdName={'categoryId'}/>
        </>
    )
}
