export default function AuthLayout({children}:React.PropsWithChildren){
    return(
        <div className={'flex items-center justify-center h-full w-full'}>
            {children}
        </div>
    )
}