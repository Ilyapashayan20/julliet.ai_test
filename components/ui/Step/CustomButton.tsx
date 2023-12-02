import { ButtonHTMLAttributes, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { clsx, ClassValue } from 'clsx';


type ButtonProps =  React.ButtonHTMLAttributes<HTMLBRElement>


export function CustomButton({className}: ButtonProps ){


    function cn(...inputs:ClassValue[]){
       return  twMerge(clsx(inputs))
    }

    const [pending,setPending] = useState<boolean>(true)

    return(
        <button className={cn('bg-red-500 text-white py-1 px-3 rounded-sm' , className, {
            'bg-gray-500' : pending,
        } )} >Custom Button</button>
    )
}