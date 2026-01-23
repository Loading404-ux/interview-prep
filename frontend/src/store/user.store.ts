import { create } from "zustand"

type User = {
  id: string
  email: string
  name: string
  avatar?: string
  clearkUserId: string
}

type UserState = {
  user: User | null
  bootstrapped: boolean
  setUser: (user: User) => void
  clearUser: () => void
  markBootstrapped: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  bootstrapped: false,

  setUser: (user) =>
    set({
      user,
      bootstrapped: true,
    }),

  clearUser: () =>
    set({
      user: null,
      bootstrapped: false,
    }),

  markBootstrapped: () =>
    set({
      bootstrapped: true,
    }),
}))
