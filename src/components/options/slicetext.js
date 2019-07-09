module.exports = function slicetext(title, num) {
    let isSlice = false
    function strLength(strSrc) {
        let len = 0, i;
        strSrc = escape(strSrc)
        for (i = 0; i < strSrc.length; i++ , len++) {
            if (strSrc.charAt(i) == "%") {
                if (strSrc.charAt(++i) == "u") {
                    i += 3
                    len++
                }
                i++
            }
        }
        return len
    }

    while (strLength(title) > num) {
        title = title.slice(0, title.length - 1)
        isSlice = true
    }
    if (isSlice) {
        title += '...'
    }
    return title
}