"use client"

import type {Color} from "@prisma/client";

import {Heading} from "@/components/ui/Heading";
import {Button} from "@/components/ui/button";
import {Trash} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useState} from "react";
import {Input} from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import {useParams, useRouter} from "next/navigation";
import {AlertModal} from "@/components/modals/alert-modal";
interface ColorForm{
    initialData:Color|null
}
const colorSchema=z.object({
    name:z.string().min(2),
    value:z.string().min(3).regex(/^#/,{
        message:"String Must be a valid hex color code"
    })
})

type UpdateFomValue=z.infer<typeof colorSchema>
export const ColorForm:React.FC<ColorForm> = ({
    initialData
                                                    }) => {

    const router=useRouter()
    const params=useParams();


    const form=useForm<UpdateFomValue>({
        resolver:zodResolver(colorSchema),
        defaultValues:initialData||{
            name: '',
            value: ''
        }
    })
    const [open,setOpen]=useState(false)
    const [loading,setLoading]=useState(false)



    const title= initialData?"Edit Color":"Create Color"
    const description= initialData?"Edit a Color":"Add a new Color"
    const toastMessage= initialData?"Color Updated":"New Color Added"
    const action= initialData?"Save Changes":"Create"



    const onSubmit=async (data:UpdateFomValue)=>{
        try {
            setLoading(true)

            if(initialData){

            await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`,data)
            }else{
                await axios.post(`/api/${params.storeId}/colors`,data)
            }
            router.refresh()
            router.push(`/${params.storeId}/colors`)
            toast.success(toastMessage)
        }catch (e:any) {
            toast.error(e.message)
        }finally {
            setLoading(false)
        }
    }

    const onDelete=async ()=>{
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
            router.refresh()
            router.push(`/${params.storeId}/colors/`)
            toast.success('Color Deleted')
        }catch (e:any) {
            toast.error("Make sure you removed all products using this Color")
        }finally {
            setLoading(false)
            setOpen(false)
        }

    }


    return (
       <>
           <AlertModal isOpen={open} onClose={()=>setOpen(false)} onConfirm={onDelete} isLoading={loading}/>
           <div className={'flex items-center justify-between'}>
               <Heading title={title} description={description}/>
               {
                   initialData?<Button variant={'destructive'} size={'sm'} onClick={()=>setOpen(true)}>
                       <Trash className={'h-4 w-4'}/>
                   </Button>:''
               }
           </div>
           <Separator/>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={'space-y-8 w-full'}>

                    <div className={'grid grid-cols-3 gap-8'}>
                        <FormField render={({field})=>(
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder={"Color name..."} disabled={loading} {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}  control={form.control} name={'name'}/>
                    </div>
                    <div className={'grid grid-cols-3 gap-8'}>
                        <FormField render={({field})=>(
                            <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                    <Input placeholder={"Color value ..."} disabled={loading} {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}  control={form.control} name={'value'}/>
                    </div>
                    <Button disabled={loading} className={'ml-auto'} type={'submit'}>{action}</Button>
                </form>
            </Form>

           <Separator/>
       </>
    );
};
