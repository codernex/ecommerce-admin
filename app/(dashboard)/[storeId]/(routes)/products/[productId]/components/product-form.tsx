"use client"

import {Product, Image, Category, Size, Color} from "@prisma/client";

import {Heading} from "@/components/ui/Heading";
import {Button} from "@/components/ui/button";
import {Trash} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useState} from "react";
import {Input} from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import {useParams, useRouter} from "next/navigation";
import {AlertModal} from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Checkbox} from "@/components/ui/checkbox";
interface ProductFromProps{
    initialData:Product&{
        images:Image[]
    }|null
    categories:Category[]
    sizes:Size[]
    colors:Color[]
}


const productSchema=z.object({
    name:z.string().min(4),
    images:z.object({url:z.string()}).array(),
    isArchived:z.boolean().default(false).optional(),
    isFeatured:z.boolean().default(false).optional(),
    sizeId:z.string().min(1),
    categoryId:z.string().min(1),
    colorId:z.string().min(1),
    price:z.coerce.number().min(1)
})



type UpdateFomValue=z.infer<typeof productSchema>
export const ProductsForm:React.FC<ProductFromProps> = ({
    initialData,categories,sizes,colors
                                                    }) => {

    const router=useRouter()
    const params=useParams();
    const form=useForm<UpdateFomValue>({
        resolver:zodResolver(productSchema),
        defaultValues:initialData?{...initialData,price:parseFloat(String(initialData?.price))}:{
            name:'',
            images:[],
            price:0,
            categoryId:'',
            sizeId:'',
            colorId:'',
            isFeatured:false,
            isArchived:false
        }
    })
    const [open,setOpen]=useState(false)
    const [loading,setLoading]=useState(false)

    const title= initialData?"Edit Product":"Create Product"
    const description= initialData?"Edit a Product":"Add a new Product"
    const toastMessage= initialData?"Product Updated":"New Product Added"
    const action= initialData?"Save Changes":"Create"
    const onSubmit=async (data:UpdateFomValue)=>{
        try {
            setLoading(true)

            if(initialData){

            await axios.patch(`/api/${params.storeId}/products/${params.productId}`,data)
            }else{
                await axios.post(`/api/${params.storeId}/products`,data)
            }
            router.refresh()
            router.push(`/${params.storeId}/products`)
            toast.success(toastMessage)
        }catch (e:any) {
            toast.error("Something went wrong")
        }finally {
            setLoading(false)
        }
    }

    const onDelete=async ()=>{
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
            router.refresh()
            router.push(`/${params.storeId}/products/`)
            toast.success('Products Deleted')
        }catch (e:any) {
            toast.error("Something went wrong")
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
                            <FormLabel>Images</FormLabel>
                            <FormControl>
                                <ImageUpload onChange={(url)=>field.onChange([...field.value,{url}])} onRemove={(url)=>field.onChange([...field.value.filter((currentUrl)=>currentUrl.url!==url)])} value={field.value.map(image=>image.url)} disabled={loading}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}  control={form.control} name={'images'}/>
                    <div className={'grid grid-cols-3 gap-8'}>
                        <FormField render={({field})=>(
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder={"Product name.."} disabled={loading} {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}  control={form.control} name={'name'}/>
                        <FormField render={({field})=>(
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input type={'number'} placeholder={"9.99"} disabled={loading} {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}  control={form.control} name={'price'}/>

                        <FormField render={({field})=>(
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} placeholder={"Select A Category"}/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            categories.map((item)=>{
                                                return(
                                                    <SelectItem value={item.id} key={item.id}>
                                                        {item.name}
                                                    </SelectItem>
                                                )
                                            })
                                        }
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}  control={form.control} name={'categoryId'}/>
                        <FormField render={({field})=>(
                            <FormItem>
                                <FormLabel>Sizes</FormLabel>
                                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} placeholder={"Select A Size"}/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            sizes.map((item)=>{
                                                return(
                                                    <SelectItem value={item.id} key={item.id}>
                                                        {item.name}
                                                    </SelectItem>
                                                )
                                            })
                                        }
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}  control={form.control} name={'sizeId'}/>
                        <FormField render={({field})=>(
                            <FormItem>
                                <FormLabel>Colors</FormLabel>
                                <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} placeholder={"Select A Color"}/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            colors.map((item)=>{
                                                return(
                                                    <SelectItem value={item.id} key={item.id}>
                                                        {item.name}
                                                    </SelectItem>
                                                )
                                            })
                                        }
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}  control={form.control} name={'colorId'}/>
                        <FormField render={({field})=>(
                            <FormItem className={'flex flex-row items-start space-x-3 space-y-0  rounded-md border p-4'}>
                                <FormControl><Checkbox checked={field.value}
                                                       // @ts-ignore
                                                       onCheckedChange={field.onChange}/></FormControl>
                                <div className={'space-y-1 leading-none'}>
                                    <FormLabel>Featured</FormLabel>
                                    <FormDescription>This product will appear on the homepage</FormDescription>
                                </div>
                                <FormMessage/>
                            </FormItem>
                        )}  control={form.control} name={'isFeatured'}/>
                        <FormField render={({field})=>(
                            <FormItem className={'flex flex-row items-start space-x-3 space-y-0  rounded-md border p-4'}>
                                <FormControl><Checkbox checked={field.value}
                                    // @ts-ignore
                                                       onCheckedChange={field.onChange}/></FormControl>
                                <div className={'space-y-1 leading-none'}>
                                    <FormLabel>Archived</FormLabel>
                                    <FormDescription>This product will not appear anywhere on the store</FormDescription>
                                </div>
                                <FormMessage/>
                            </FormItem>
                        )}  control={form.control} name={'isArchived'}/>
                    </div>
                    <Button disabled={loading} className={'ml-auto'} type={'submit'}>{action}</Button>
                </form>
            </Form>

           <Separator/>
       </>
    );
};
