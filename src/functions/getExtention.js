export default (type) => {
	switch (type) {
		case 'image/jpeg' : return '.jpg'
		case 'image/png'  : return '.png'
	}

    return undefined
}