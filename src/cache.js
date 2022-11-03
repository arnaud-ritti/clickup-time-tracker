/*
The actual store object looks like this:
{
    cache: {
        expires_at: {} // Holds expiry timestamps by cache key
        values: {} // Holds actual cached value by cache key
    }
}
*/

import Store from 'electron-store';
const store = new Store

export default {
    initRenderer: () => store.initRenderer(),

    all() {
        return store.get('cache')
    },

    get: function(key, defaultValue) {

        const expiresAt = store.get(`cache.expires_at.${key}`) || null;

        defaultValue = typeof(defaultValue) === 'undefined'
            ? null
            : defaultValue;

        if(expiresAt && expiresAt < Date.now()) {
            return store.get(`cache.values.${key}`) || defaultValue;
        }

        return defaultValue;
    },

    put: function(key, value, expiresAt) {
        store.set(`cache.expires_at.${key}`, expiresAt)
        store.set(`cache.values.${key}`, value)

        return value
    },

    clear: function(key) {
        store.delete(`cache.expires_at.${key}`)
        store.delete(`cache.values.${key}`)
    }
}
