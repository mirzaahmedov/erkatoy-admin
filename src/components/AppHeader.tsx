import { useAuthStore } from "@/features/auth/store";
import { Button } from "@adobe/react-spectrum";
import LogOut from "@spectrum-icons/workflow/LogOut";

export const AppHeader = () => {
  const logout = useAuthStore((store) => store.logout);
  return (
    <header>
      <nav>
        <Button
          variant="secondary"
          onPress={logout}
        >
          <LogOut />
        </Button>
      </nav>
    </header>
  );
};
