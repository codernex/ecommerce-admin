import {useEffect, useState} from "react";
import {useStoreModal} from "@/hooks/use-store-modal";
import {Modal} from "@/components/ui/modal";
import {Button} from "@/components/ui/button";

interface AlertModal{
    isOpen:boolean;
    onClose:()=>void;
    onConfirm:()=>void;
    isLoading:boolean
}
export const AlertModal:React.FC<AlertModal>=({
    ...props
                                              })=>{

    const [isMounted,setIsMounted]=useState(false)

    useEffect(()=>{
        setIsMounted(true)
    },[])

    if(!isMounted){
        return null
    }
    return(
        <Modal title={"Are you sure?"} description={"This action cannot be undone"} isOpen={props.isOpen} onClose={props.onClose}>
            <div className={'pt-6 space-x-2 flex items-center justify-end w-full'}>
                <Button disabled={props.isLoading} variant={'outline'} onClick={props.onClose}>Cancel</Button>
                <Button disabled={props.isLoading} variant={'destructive'} onClick={props.onConfirm}>Continue</Button>
            </div>
        </Modal>
    )
}