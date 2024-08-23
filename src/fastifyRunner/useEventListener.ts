const events = new Map()

process.stdin.setRawMode(true)
process.stdin.resume()
process.stdin.setEncoding( 'utf8' );
process.stdin.on('data', ( key: string ) => {
  // ctrl-c ( end of text )
  if ( key === '\u0003' ) {
    process.exit();
  }

  const event = events.get(key)
  if (event) {
    event()
  }
});

export const useEventListener = (keys: string | string[], callback: () => void) => {
  if (Array.isArray(keys)){ 
    const dispose: Array<() => void> = []
    for (let key of keys) {
      dispose.push(useEventListener(key, callback))
    }
    return () => {
      dispose.forEach(dispose => dispose())
    }
  } else {
    events.set(keys, callback)
    return () => {
      events.delete(keys)
    }
  }
}