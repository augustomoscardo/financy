import { create } from "zustand";
import { persist } from "zustand/middleware";

import { LoginInput, RegisterInput, User, type UpdateProfileInput } from "@/types";
import { apolloClient } from "@/lib/apollo";
import { REGISTER } from "@/lib/graphql/mutations/register";
import { LOGIN } from "@/lib/graphql/mutations/login";
import { UPDATE_PROFILE } from "@/lib/graphql/mutations/update-profile";

type RegisterMutationData = {
  register: {
    token: string;
    refreshToken: string;
    user: User;
  };
};

type UpdateProfileMutationData = {
  updateProfile: {
    user: User;
  };
};

type LoginMutationData = {
  login: {
    token: string;
    refreshToken: string;
    user: User;
  };
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  signup: (data: RegisterInput) => Promise<boolean>;
  login: (data: LoginInput) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: UpdateProfileInput) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      signup: async (registerData: RegisterInput) => {
        try {
          const { data } = await apolloClient.mutate<
            RegisterMutationData,
            { data: RegisterInput }
          >({
            mutation: REGISTER,
            variables: {
              data: {
                name: registerData.name,
                email: registerData.email,
                password: registerData.password,
              },
            },
          });

          if (data?.register) {
            const { user, token } = data.register;

            set({
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
              },
              token,
              isAuthenticated: true,
            });

            return true;
          }

          return false;
        } catch (error) {
          console.log("Error during signup:", error);
          throw error;
        }
      },
      login: async (loginData: LoginInput) => {
        try {
          const { data } = await apolloClient.mutate<
            LoginMutationData,
            { data: LoginInput }
          >({
            mutation: LOGIN,
            variables: {
              data: {
                email: loginData.email,
                password: loginData.password,
              },
            },
          });

          if (data?.login) {
            const { user, token } = data.login;

            set({
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
              },
              token,
              isAuthenticated: true,
            });

            return true;
          }

          return false;
        } catch (error) {
          console.log("Error during login:", error);
          throw error;
        }
      },
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });

        apolloClient.clearStore();
      },
      updateProfile: async (updateProfileData: UpdateProfileInput) => {
        try {
          const { data } = await apolloClient.mutate<
            UpdateProfileMutationData,
            { data: UpdateProfileInput }
          >({
            mutation: UPDATE_PROFILE,
            variables: {
              data: {
                name: updateProfileData.name
              }
            }
          })

          if (data?.updateProfile) {
            const { user } = data.updateProfile

            console.log(user);

            return true
          }

          return false
        } catch (error) {
          console.log("Error during profile update:", error);
          throw error;
        }
      }
    }),
    {
      name: "financy-auth-storage",
    }
  )
);
