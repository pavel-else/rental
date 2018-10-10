import axios from 'axios'

export default (data, store) => {
    if (!data || !store || !store.getters.activePath) {
        return false
    }

    const url = String(store.getters.activePath) + 'user_uploads.php'
    const config = {
        header: {
            'Content-Type' : 'multipart/form-data'
        }
    }
    
    axios.post(url, data, config).then(
        r => { 
            console.log(r)
        }
    )
}