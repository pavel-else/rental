'use strict'

export default function (url)
{
	//объект "обещание"
	return new Promise(function(resolve, reject)
	{
		var img = new Image();
		img.onload = function()
		{
			//в случае успешной загрузки изображения, результат "обещания" будет url этого изображения
			return resolve(url);
		}
		img.onerror = function()
		{
			//в случае не успешной загрузки изображения, результат "обещания" будет url этого изображения
			return reject(url);
		}
		img.src = url;
	});
}