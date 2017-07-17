import { Injectable } from '@angular/core';
@Injectable()
export class ImageProccessService {
    convertToDataURLviaCanvas(url, outputFormat){
	return new Promise( (resolve, reject) => {
		let img = new Image();
		img.crossOrigin = 'Anonymous';
		img.onload = () => {
            let canvas = <HTMLCanvasElement> document.createElement('CANVAS'),
            ctx = canvas.getContext('2d'),
            dataURL;
            canvas.height = 315;
            canvas.width = 315;
            ctx.rect(0, 0, 315, 315);
            ctx.fillStyle = "#ffffff";
            ctx.fill()
            ctx.globalAlpha = 0.5;
            ctx.drawImage(img,0, 0);
			dataURL = canvas.toDataURL(outputFormat);
			canvas = null;
			resolve(dataURL); 
		};
		img.src = url;
	});
}
}