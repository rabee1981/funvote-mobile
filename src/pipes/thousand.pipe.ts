import { Pipe, PipeTransform } from '@angular/core'
@Pipe({
    name : 'thousand'
})

export class ThousandPipe implements PipeTransform{
    transform(value : number) : string{
        if(value>=1000)
            return Math.floor(value/1000).toString().concat('k')
        else
        return value.toString()
    }
}