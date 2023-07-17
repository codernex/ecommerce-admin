import prismadb from "@/lib/prismadb";
import {CategoryForm} from "./components/CategoryForm";

const Category=async ({params}:{params:{categoryId:string,storeId:string}})=>{
    const category= await prismadb.category.findFirst({
        where:{
            id:params?.categoryId
        }
    })

    const billboards= await prismadb.billboard.findMany({
        where:{
            storeId:params.storeId
        }
    })



    return(
        <div className={'flex-col'}>
           <div className={'flex-1 space-y-4 p-8 pt-6'}>
                    <CategoryForm initialData={category} billboards={billboards}/>
           </div>
        </div>
    )
}

export default Category