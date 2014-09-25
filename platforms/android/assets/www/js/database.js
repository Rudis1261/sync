var db = (function(window) {

    function _set(key, value) {
        return window.localStorage.setItem(key, value);
    } 

    function _get(key) {
        return window.localStorage.getItem(key);
    } 

    function _remove(key) {
        window.localStorage.removeItem(key);
        return true;
    }

    return {
        set: _set,
        get: _get,
        remove: _remove
    };

})(window);