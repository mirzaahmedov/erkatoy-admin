import { useAuthStore } from "@/features/auth/store";
import { useLayoutStore } from "@/features/layout/store";
import { parseAsBoolean, useQueryState } from "nuqs";
import {
  Badge,
  Breadcrumbs,
  Button,
  Icon,
  Item,
  Text,
} from "@adobe/react-spectrum";
import { BiExit, BiPlus } from "react-icons/bi";

export const AppHeader = () => {
  const layout = useLayoutStore();
  const logout = useAuthStore((store) => store.logout);

  const [, setCreateOpen] = useQueryState(
    "is_create_open",
    parseAsBoolean.withDefault(false),
  );

  const { title, enableCreate, breadcrumbs } = layout;

  return (
    <header className="border-b border-neutral-600 p-5">
      <nav className="flex justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl uppercase !font-family-fascinate">Erkatoy</h1>
          <Badge
            variant="purple"
            UNSAFE_className="font-semibold"
          >
            ADMIN
          </Badge>
          {breadcrumbs ? (
            <Breadcrumbs showRoot>
              {breadcrumbs.map((item) => (
                <Item key={item.to}>{item.label}</Item>
              ))}
            </Breadcrumbs>
          ) : null}

          <h2 className="text-lg font-medium">{title}</h2>
        </div>

        <div className="flex items-center gap-3">
          {enableCreate && (
            <Button
              variant="accent"
              style="fill"
              onPress={() => setCreateOpen(true)}
            >
              <Text>Create</Text>
              <Icon>
                <BiPlus />
              </Icon>
            </Button>
          )}
          <Button
            variant="secondary"
            style="fill"
            onPress={logout}
          >
            <Text>Log Out</Text>
            <Icon>
              <BiExit />
            </Icon>
          </Button>
        </div>
      </nav>
    </header>
  );
};
