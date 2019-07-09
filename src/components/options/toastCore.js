import toast from './toaster'
import Vue from 'vue'

function init(message) {
    let cmp = null
    let queue = []

    function createCmp(message) {
        let component = new Vue(toast)
        Vue.set(component, 'text', message)
        document.body.appendChild(component.$mount().$el)
        return component
    }

    function show(message) {
        cmp = createCmp(message)
        cmp.$on('statusChange', (isActive, wasActive) => {
            if (wasActive && !isActive) {
                cmp = null
                if (queue.length) {
                    let msg = queue.shift()
                    show(msg)
                }
            }
        })
    }

    Vue.prototype.property = show(message)
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(init)
}

export default init