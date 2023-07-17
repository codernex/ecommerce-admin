import {auth, UserButton} from "@clerk/nextjs";
import {MainNav} from "@/components/MainNav";
import {StoreSwitcher} from "@/components/store-switcher";
import prismadb from "@/lib/prismadb";
import {redirect} from "next/navigation";

export const Navbar= async ()=>{
    const {userId}=auth()
    if(!userId){
        return redirect('/sign-in')
    }
    const stores= await prismadb.store.findMany({
        where:{
            userId
        }
    })
    return(
        <div className={'border-b'}>
            <div className={'flex h-16 items-center px-4'}>
                <StoreSwitcher items={stores}/>
                <MainNav className={'ml-6'}/>
                <div className={'ml-auto flex items-center space-x-4'}>
                    <UserButton afterSignOutUrl={'/'}/>
                </div>
            </div>
        </div>
    )
}