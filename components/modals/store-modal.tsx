"use client"
import {Store} from '@prisma/client'
import {Modal} from "@/components/ui/modal";
import {useStoreModal} from "@/hooks/use-store-modal";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {createStoreSchema} from "@/schema";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import axios, {AxiosResponse} from "axios";
import toast from "react-hot-toast";
import {redirect} from "next/navigation";

export const StoreModal=()=>{
    const {isOpen,onClose}=useStoreModal()
    const [loading,setLoading]=useState(false)

    const form =useForm<z.infer<typeof createStoreSchema>>({
        resolver:zodResolver(createStoreSchema)
    })

    const onSubmit=async (values:z.infer<typeof createStoreSchema>)=>{
        try {
            setLoading(true)

            const res:AxiosResponse<Store>=await axios.post('/api/stores',values)

            window.location.assign(`/${res.data.name}`)
        }catch (e){
            toast.error("Something Went Wrong")
        }finally {
            setLoading(false)
        }
    }
    return(
        <Modal title={'Create Store'} description={'Adding a new store to create and manage products and categories'} isOpen={isOpen} onClose={onClose}>
           <div>
               <div className={'py-2 pb-4 space-y-4'}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField control={form.control} render={({field})=>(
                                <FormItem>
                                    <FormLabel>Ecommerce Store Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder={"Ecommerce Store Name"} {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )} name={'name'}/>
                        <div className={'pt-6 space-x-2 flex items-center justify-end w-full'}>
                            <Button disabled={loading} variant={'outline'} onClick={onClose}>Cancel</Button>
                            <Button disabled={loading} type={'submit'}>Continue</Button>
                        </div>
                    </form>
                </Form>
               </div>

           </div>
        </Modal>
    )
}