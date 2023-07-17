"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CheckSquare, Square} from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type OrderColumn={
    id:string,
    phone:string,
    address:string,
    products:string,
    totalPrice:string,
    createdAt:string,
    isPaid:boolean
}
export const columns: ColumnDef<OrderColumn>[] = [
    {
        accessorKey: "products",
        header: "Products",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "totalPrice",
        header: "Total",
    },
    {
        accessorKey: "isPaid",
        header: "Paid",
        cell:({row})=>{
            if(
                row.original.isPaid
            ){
                return  <CheckSquare className={'h-4 w-4'}/>
            }
            return <Square className={'h-4 w-4'}/>;
        }
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    }
]
