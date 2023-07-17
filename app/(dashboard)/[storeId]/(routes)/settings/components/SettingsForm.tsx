"use client"

import type {Store} from "@prisma/client";

import {Heading} from "@/components/ui/Heading";
import {Button} from "@/components/ui/button";
import {Trash} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {z} from "zod";
import {storeUpdateSchema} from "@/schema";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useState} from "react";
import {Input} from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import {useRouter} from "next/navigation";
import {AlertModal} from "@/components/modals/alert-modal";
import {ApiAlert} from "@/components/ui/api-alert";
import {useOrigin} from "@/hooks/use-origin";
interface SettingsForm{
    initialData:Store
}

type UpdateFomValue=z.infer<typeof storeUpdateSchema>
export const SettingsForm:React.FC<SettingsForm> = ({
    initialData
                                                    }) => {

    const form=useForm<UpdateFomValue>({
        resolver:zodResolver(storeUpdateSchema),
        defaultValues:{
            name: initialData.name
        }
    })
    const [open,setOpen]=useState(false)
    const [loading,setLoading]=useState(false)
    const router=useRouter()
    const onSubmit=async (data:UpdateFomValue)=>{
        try {
            setLoading(true)
            await axios.patch(`/api/stores/${initialData.id}`,data)
            router.refresh()
            toast.success("Store Updated")
        }catch (e:any) {
            toast.error(e.message)
        }finally {
            setLoading(false)
        }
    }

    const onDelete=async ()=>{
        try {
            setLoading(true)
            await axios.delete(`/api/stores/${initialData.id}`)
            router.refresh()
            router.push('/')
            toast.success('Store Deleted')
        }catch (e:any) {
            toast.error("Make sure you removed all products & categories")
        }finally {
            setLoading(false)
            setOpen(false)
        }

    }

    const origin=useOrigin();


    return (
       <>
           <AlertModal isOpen={open} onClose={()=>setOpen(false)} onConfirm={onDelete} isLoading={loading}/>
           <div className={'flex items-center justify-between'}>
               <Heading title={"Settings"} description={"Manage Store Preferences"}/>
               <Button variant={'destructive'} size={'sm'} onClick={()=>setOpen(true)}>
                   <Trash className={'h-4 w-4'}/>
               </Button>
           </div>
           <Separator/>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={'space-y-8 w-full'}>
                    <div className={'grid grid-cols-3 gap-8'}>
                        <FormField render={({field})=>(
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder={"Store Name"} disabled={loading} {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}  control={form.control} name={'name'}/>
                    </div>
                    <Button disabled={loading} className={'ml-auto'} type={'submit'}>Save Changes</Button>
                </form>
            </Form>

           <Separator/>
           <ApiAlert title={"NEXT_PUBLIC_API_URL"} description={`${origin}/api/${initialData.id}`} variant={'public'}/>
       </>
    );
};
