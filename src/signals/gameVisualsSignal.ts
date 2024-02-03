import { signal } from '@preact/signals-react'
import { damageType } from '../types'

// Events happening in game engine that effects can listen to, example enemy hit animation
export const gameEffect = signal<string>('')
// Damage dealt to enemy for rendering in UI
export const damage = signal<damageType>({
  state: 'idle',
  hits: [],
})
