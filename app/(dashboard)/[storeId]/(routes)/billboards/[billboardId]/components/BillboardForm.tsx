"use client"

import type {Billboard} from "@prisma/client";

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
import {ApiAlert} from "@/components/ui/api-alert";
import {useOrigin} from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image-upload";
interface BillboardsForm{
    initialData:Billboard|null
}
const billboardSchema=z.object({
    label:z.string().min(4),
    imageUrl:z.string()
})

type UpdateFomValue=z.infer<typeof billboardSchema>
export const BillboardsForm:React.FC<BillboardsForm> = ({
    initialData
                                                    }) => {

    const router=useRouter()
    const params=useParams();
    const form=useForm<UpdateFomValue>({
        resolver:zodResolver(billboardSchema),
        defaultValues:initialData||{
            label: '',
            imageUrl: ''
        }
    })
    const [open,setOpen]=useState(false)
    const [loading,setLoading]=useState(false)

    const title= initialData?"Edit Billboard":"Create Billboard"
    const description= initialData?"Edit a Billboard":"Add a new Billboard"
    const toastMessage= initialData?"Update billboard success":"New billboard Added"
    const action= initialData?"Save Changes":"Create"
    const onSubmit=async (data:UpdateFomValue)=>{
        try {
            setLoading(true)

            if(initialData){

            await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`,data)
            }else{
                await axios.post(`/api/${params.storeId}/billboards`,data)
            }
            router.refresh()
            router.push(`/${params.storeId}/billboards`)
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
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
            router.refresh()
            router.push(`/${params.storeId}/billboards/`)
            toast.success('Billboard Deleted')
        }catch (e:any) {
            toast.error("Make sure you removed all categories using this billboard")
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
                    <FormField render={({field})=>(
                        <FormItem>
                            <FormLabel>Background Image</FormLabel>
                            <FormControl>
                                <ImageUpload onChange={(url)=>field.onChange(url)} onRemove={()=>field.onChange('')} value={field.value?[field.value]:[]} disabled={loading}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}  control={form.control} name={'imageUrl'}/>
                    <div className={'grid grid-cols-3 gap-8'}>
                        <FormField render={({field})=>(
                            <FormItem>
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                    <Input placeholder={"Billboard label"} disabled={loading} {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}  control={form.control} name={'label'}/>
                    </div>
                    <Button disabled={loading} className={'ml-auto'} type={'submit'}>{action}</Button>
                </form>
            </Form>

           <Separator/>
       </>
    );
};
