import {SizeClient} from "./components/client";
import prismadb from "@/lib/prismadb";
import * as date from 'date-fns'
import {SizesColumn} from "./components/columns";

const Sizes=async ({params}:{params:{storeId:string}})=>{
    const sizes= await prismadb.size.findMany({
        where:{
            storeId:params.storeId
        },
        orderBy:{
            createdAt:"desc"
        }
    })

    const formattedSizes:SizesColumn[]=sizes.map((item)=>({id:item.id,name:item.name,value:item.value,createdAt: date.format(item.createdAt,"MMMM do, yyyy")}))
    return (
        <div className={'flex-col'}>
            <div className={'flex-1 space-y-4 p-8 pt-6'}>
                <SizeClient data={formattedSizes}/>
            </div>
        </div>
    )
}

export default Sizes