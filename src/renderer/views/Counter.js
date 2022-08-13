import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { counterActions } from '../stores/counterSlice'

export default function Counter() {
  const {counter: {value: count}} = useSelector((state) => state)
  const dispatch = useDispatch()

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(counterActions.increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(counterActions.decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  )
}