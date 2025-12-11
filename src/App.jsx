import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <h1 class="text-3xl font-bold underline bg-amber-300">
    Hello world!
  </h1>
  )
}

export default App
