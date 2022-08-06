function pressKey(keycode) {
    let e = new Event("keydown")
    e.key = keycode
    document.dispatchEvent(e)
}