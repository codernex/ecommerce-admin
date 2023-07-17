"use client"

import {SizesColumn} from "./columns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {CopyIcon, Edit, MoreHorizontal, TrashIcon} from "lucide-react";
import toast from "react-hot-toast";
import {useParams, useRouter} from "next/navigation";
import axios from "axios";
import {useState} from "react";
import {AlertModal} from "@/components/modals/alert-modal";

interface CellActionProps{
    data:SizesColumn
}

export const CellAction:React.FC<CellActionProps>=({
    data
                                                   })=>{

    const router=useRouter()
    const params=useParams()
    const [loading,setLoading]=useState(false)
    const [open,setOpen]=useState(false)

    const onDelete=async ()=>{
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/sizes/${data.id}`)
            router.refresh()
            toast.success('Size Deleted')
        }catch (e:any) {
            toast.error("Make sure you removed all products using this size")
        }finally {
            setLoading(false)
            setOpen(false)
        }

    }
    return(
       <>
           <AlertModal isOpen={open} onClose={()=>setOpen(false)} onConfirm={onDelete} isLoading={loading}/>
           <DropdownMenu>
               <DropdownMenuTrigger asChild={true}>
                   <Button variant={'ghost'} className={'h-8 w-8 p-0'}>
                       <span className={'sr-only'}>open menu</span>
                       <MoreHorizontal className={'h-4 w-4'}/>
                   </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align={'end'}>
                   <DropdownMenuLabel>Actions</DropdownMenuLabel>
                   <DropdownMenuItem onClick={()=>{
                       navigator.clipboard.writeText(data.id)
                       toast.success("Size ID Copied To Clipboard")
                   }}>
                       <CopyIcon className={'h-4 mr-2 w-4'}/>
                       Copy Id
                   </DropdownMenuItem>
                   <DropdownMenuItem onClick={()=>{
                       router.push(`/${params.storeId}/sizes/${data.id}`)
                   }}>
                       <Edit className={'h-4 mr-2 w-4'}/>
                       Update
                   </DropdownMenuItem>
                   <DropdownMenuItem onClick={()=>setOpen(true)}>
                       <TrashIcon className={'h-4 mr-2 w-4'}/>
                       Delete
                   </DropdownMenuItem>
               </DropdownMenuContent>
           </DropdownMenu></>
    )
}