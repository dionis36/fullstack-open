import { create } from 'zustand'

const useAnecdoteStore = create((set) => ({
  filter: '',
  setFilter: (filter) => set({ filter })
}))

export default useAnecdoteStore