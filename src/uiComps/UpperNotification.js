    import React, { useRef, useState, useMemo, useEffect, MouseEvent, forwardRef, useImperativeHandle } from 'react'
    import { useTransition, a } from '@react-spring/web'
    
    let id = 0
    
    
    function MessageHub({
      config = { tension: 125, friction: 20, precision: 0.1 },
      timeout = 3000,
      children,
    }) {

      const refMap = useMemo(() => new WeakMap(), [])
      const cancelMap = useMemo(() => new WeakMap(), [])
      const [items, setItems] = useState([])
    
      const transitions = useTransition(items, {
        from: { opacity: 0, height: 0, life: '100%' },
        keys: item => item.key,
        enter: item => async (next, cancel) => {
          cancelMap.set(item, cancel)
          await next({ opacity: 1, height: refMap.get(item).offsetHeight })
          await next({ life: '0%' })
        },
        leave: [{ opacity: 0 }, { height: 0 }],
        onRest: (result, ctrl, item) => {
          setItems(state =>
            state.filter(i => {
              return i.key !== item.key
            })
          )
        },
        config: (item, index, phase) => key => (phase === 'enter' && key === 'life' ? { duration: timeout } : config),
      })
    
      useEffect(() => {
        children((msg) => {
          setItems(state => [...state, { key: id++, msg }])
        })
      }, [])
    
      return (
        <div className='container'>
          {transitions(({ life, ...style }, item) => (
            <a.div className={"message"} style={style}>
              <div className='content' ref={(ref) => ref && refMap.set(item, ref)}>
                {/* <Life style={{ right: life }} /> */}
                <p>{item.msg}</p>
                <button className='button'
                  onClick={(e) => {
                    e.stopPropagation()
                    if (cancelMap.has(item) && life.get() !== '0%') cancelMap.get(item)()
                  }}>
                  <div>x + x</div>
                </button>
              </div>
            </a.div>
          ))}
        </div>
      )
    }
    
const UpperNotification=forwardRef((_ , forwardedRef)=>{ 
  const ref = useRef(null)

const showNotification = (message) => {
    ref.current?.(message)
  }

  useImperativeHandle(forwardedRef, ()=>({showNotification}))

  return (
    <div className='main'>
      <MessageHub
        children={(add) => {
          ref.current = add
        }}
      />
    </div>
  )
})
    



export default UpperNotification