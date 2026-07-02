import { create } from "zustand"

type AuthUser = {
  id: string
  email: string
  name: string
  avatar?: string
}

type UserState = {
  user: AuthUser | null
  bootstrapped: boolean

  setUser: (user: AuthUser) => void
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
