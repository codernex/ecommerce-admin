import { ProductClient} from "./components/client";
import prismadb from "@/lib/prismadb";
import * as date from 'date-fns'
import {ProductColumn} from "./components/columns";
import {formatter} from "@/lib/utils";

const ProductsPage=async ({params}:{params:{storeId:string}})=>{
    const product= await prismadb.product.findMany({
        where:{
            storeId:params.storeId
        },
        include:{
            category:true,
            size:true,
            color:true
        },
        orderBy:{
            createdAt:"desc"
        }
    })

    const formattedProducts:ProductColumn[]=product.map(
        (item)=>(
            {   id:item.id,
                name:item.name,
                price:formatter.format(item.price.toNumber()),
                createdAt: date.format(item.createdAt,"MMMM do, yyyy"),
                isFeatured:item.isFeatured,
                isArchived:item.isArchived,
                color: item.color.value,
                category: item.category.name,
                size: item.size.name
            }
        ))

    console.log(formattedProducts)
    return (
        <div className={'flex-col'}>
            <div className={'flex-1 space-y-4 p-8 pt-6'}>
                <ProductClient data={formattedProducts}/>
            </div>
        </div>
    )
}

export default ProductsPage