export default {
    copy(object) {
        return object ? JSON.parse(JSON.stringify(object)) : null
    }
}