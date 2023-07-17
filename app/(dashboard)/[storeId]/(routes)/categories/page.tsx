import { CategoryClient} from "./components/client";
import prismadb from "@/lib/prismadb";
import * as date from 'date-fns'
import {CategoryColumn} from "./components/columns";

const Billboards=async ({params}:{params:{storeId:string}})=>{
    const categories= await prismadb.category.findMany({
        where:{
            storeId:params.storeId
        },
        orderBy:{
            createdAt:"desc"
        },
        include:{
            billboard:true
        }
    })

    const formattedBillboard:CategoryColumn[]=categories.map((item)=>({id:item.id,name:item.name,createdAt: date.format(item.createdAt,"MMMM do, yyyy"),billboardLabel:item.billboard.label}))
    return (
        <div className={'flex-col'}>
            <div className={'flex-1 space-y-4 p-8 pt-6'}>
                <CategoryClient data={formattedBillboard}/>
            </div>
        </div>
    )
}

export default Billboards