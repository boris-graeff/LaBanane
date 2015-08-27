angular.module('LaBanane.services')
    .factory('localStorage', [function () {
        return {
            getArray        : getArray,
            push            : push,
            pushTemp        : pushTemp,
            getValueInArray : getValueInArray,
            getValue        : getValue,
            setValue        : setValue
        };

        // Public methods

        function getArray(itemKey) {
            var item = window.localStorage.getItem(itemKey);
            return item ? JSON.parse(item) : [];
        }

        function push(itemKey, entryKey, entryValue) {
            var item = window.localStorage.getItem(itemKey);
            item = item ? JSON.parse(item) : {};
            item[entryKey] = entryValue;

            window.localStorage.setItem(itemKey, JSON.stringify(item));
        }

        function getValueInArray(itemKey, entryKey) {
            var item = window.localStorage.getItem(itemKey);
            item = item ? JSON.parse(item) : {};
            return item[entryKey];
        }

        function getValue(itemKey){
            return window.localStorage.getItem(itemKey);
        }

        function setValue(itemKey, value){
            window.localStorage.setItem(itemKey, value);
        }

        function pushTemp(itemKey, entry, limit) {
            var item = window.localStorage.getItem(itemKey);
            item = item ? JSON.parse(item) : [];

            for (var i = 0; i < item.length; ++i) {
                if (item[i] === entry) {
                    item.splice(i, 1);
                    break;
                }
            }

            item.unshift(entry);
            item = item.slice(0, limit);

            window.localStorage.setItem(itemKey, JSON.stringify(item));
        }
    }])