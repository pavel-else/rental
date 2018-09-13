export default {
    copyObject(object) {
        return object ? JSON.parse(JSON.stringify(object)) : null
    }
}