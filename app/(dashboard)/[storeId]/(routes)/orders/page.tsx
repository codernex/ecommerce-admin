import { OrderClient} from "./components/client";
import prismadb from "@/lib/prismadb";
import * as date from 'date-fns'
import {OrderColumn} from "./components/columns";
import {formatter} from "@/lib/utils";

const OrdersPage=async ({params}:{params:{storeId:string}})=>{
    const orders= await prismadb.order.findMany({
        where:{
            storeId:params.storeId
        },
        orderBy:{
            createdAt:"desc"
        },
        include:{
            orderItems:{
                include:{
                    product:true
                }
            }
        }
    })

    const formattedOrders:OrderColumn[]=orders.map((item)=>({
            id:item.id,
            phone:item.phone,
            address:item.address,
            products:item.orderItems.map((orderItem)=>orderItem.product.name).join(', '),
            totalPrice:formatter.format(item.orderItems.reduce((total,item)=>total+Number(item.product.price),0)),
            createdAt:date.format(item.createdAt,"MMMM dd, yyyy"),
            isPaid:item.isPaid
        }))


       return(
           <div className={'flex-col'}>
               <div className={'flex-1 space-y-4 p-8 pt-6'}>
                   <OrderClient data={formattedOrders}/>
               </div>
           </div>
       )

}

export default OrdersPage