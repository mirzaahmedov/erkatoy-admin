import { AuthForm } from "@/features/auth";
import { AuthService } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/store";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const AuthPage = () => {
  const login = useAuthStore((store) => store.login);
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: AuthService.login,
    onSuccess: (res) => {
      const { user, token } = res.data;
      login({ user, token });
      navigate("/");
    },
  });

  return (
    <div className="h-full grid place-items-center">
      <div className="w-full max-w-md p-10 rounded-2xl bg-neutral-800 shadow-2xl">
        <AuthForm
          onSubmit={loginMutation.mutate}
          isPending={loginMutation.isPending}
        />
      </div>
    </div>
  );
};
