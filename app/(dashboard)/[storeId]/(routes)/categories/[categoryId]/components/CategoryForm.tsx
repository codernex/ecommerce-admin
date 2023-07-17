"use client"

import type {Category} from "@prisma/client";

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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Billboard} from "@prisma/client";
interface CategoryForm{
    initialData:Category|null,
    billboards:Billboard[]
}
const billboardSchema=z.object({
    name:z.string().min(4),
    billboardId:z.string()
})

type UpdateFomValue=z.infer<typeof billboardSchema>
export const CategoryForm:React.FC<CategoryForm> = ({
    initialData,billboards
                                                    }) => {

    const router=useRouter()
    const params=useParams();
    const form=useForm<UpdateFomValue>({
        resolver:zodResolver(billboardSchema),
        defaultValues:initialData||{
            name: '',
            billboardId:''
        }
    })
    const [open,setOpen]=useState(false)
    const [loading,setLoading]=useState(false)

    const title= initialData?"Edit Category":"Create Category"
    const description= initialData?"Edit a Category":"Add a new Category"
    const toastMessage= initialData?"Category Updated":"New Category Added"
    const action= initialData?"Save Changes":"Create"
    const onSubmit=async (data:UpdateFomValue)=>{
        try {
            setLoading(true)

            if(initialData){

            await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`,data)
            }else{
                await axios.post(`/api/${params.storeId}/categories`,data)
            }
            router.refresh()
            router.push(`/${params.storeId}/categories`)
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
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
            router.refresh()
            router.push(`/${params.storeId}/categories/`)
            toast.success('Category Deleted')
        }catch (e:any) {
            toast.error("Make sure you removed all Products using this category")
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
                                <FormLabel>Category Name</FormLabel>
                                <FormControl>
                                    <Input placeholder={"Category Name"} disabled={loading} {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}  control={form.control} name={'name'}/>

                        <FormField render={({field})=>(
                            <FormItem>
                                <FormLabel>Billboard</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} placeholder={"Select A Billboard"}/>
                                                </SelectTrigger>
                                            </FormControl>
                                        <SelectContent>
                                            {
                                                billboards.map((item)=>{
                                                    return(
                                                        <SelectItem value={item.id} key={item.id}>
                                                            {item.label}
                                                        </SelectItem>
                                                    )
                                                })
                                            }
                                        </SelectContent>
                                    </Select>
                                <FormMessage/>
                            </FormItem>
                        )}  control={form.control} name={'billboardId'}/>
                    </div>
                    <Button disabled={loading} className={'ml-auto'} type={'submit'}>{action}</Button>
                </form>
            </Form>

           <Separator/>
       </>
    );
};
