function loadImage(src) {
		return new Promise((resolve, reject) => {
			const imgEle = document.createElement('img');
			imgEle.src = src;
			imgEle.onload = function() {
				resolve(imgEle)
			}
			imgEle.onerror = function() {
				reject('image load filed.')
			}
		})
 } 
