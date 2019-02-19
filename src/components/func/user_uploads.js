import axios from 'axios'

export default async (data, store) => {
    if (!data || !store || !store.getters.activePath) {
        return false
    }

    const url = String(store.getters.activePath) + 'libs/user_uploads.php'
    const config = {
        header: {
            'Content-Type' : 'multipart/form-data'
        }
    }
    let result

    await axios.post(url, data, config).then(
        r => { 
            console.log(r)
            result = r
        }
    )
    return result
}