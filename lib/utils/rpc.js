// from: https://github.com/zeit/hyper/blob/master/lib/utils/rpc.js

class RPC {
  constructor () {
    const electron = window.require('electron')
    const EventEmitter = window.require('events')
    this.emitter = new EventEmitter()
    this.ipc = electron.ipcRenderer
    this.ipcListener = this.ipcListener.bind(this)
    if (window.__rpcId) {
      setTimeout(() => {
        this.id = window.__rpcId
        this.ipc.on(this.id, this.ipcListener)
        this.emitter.emit('ready')
      }, 0)
    } else {
      this.ipc.on('init', (ev, uid) => {
        // we cache so that if the object
        // gets re-instantiated we don't
        // wait for a `init` event
        window.__rpcId = uid
        this.id = uid
        this.ipc.on(uid, this.ipcListener)
        this.emitter.emit('ready')
      })
    }
  }

  ipcListener (event, {ch, data}) {
    this.emitter.emit(ch, data)
  }

  on (ev, fn) {
    this.emitter.on(ev, fn)
  }

  once (ev, fn) {
    this.emitter.once(ev, fn)
  }

  emit (ev, data) {
    if (!this.id) {
      throw new Error('Not ready')
    }
    // we emit both on ipc and in the renderer process
    this.emitter.emit(ev, data)
    this.ipc.send(this.id, {ev, data})
    console.log('[rpc]', ev, data || '')
  }

  removeListener (ev, fn) {
    this.emitter.removeListener(ev, fn)
  }

  removeAllListeners () {
    this.emitter.removeAllListeners()
  }

  destroy () {
    this.removeAllListeners()
    this.ipc.removeAllListeners()
  }
}

module.exports = new RPC()
