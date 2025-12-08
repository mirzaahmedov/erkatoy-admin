import {
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Icon,
  Item,
  Text,
} from "@adobe/react-spectrum";
import { BiExit, BiPlus } from "react-icons/bi";
import { parseAsBoolean, useQueryState } from "nuqs";

import { useAuthStore } from "@/features/auth/store";
import { useLayoutStore } from "@/features/layout/store";

export const AppHeader = () => {
  const layout = useLayoutStore();
  const logout = useAuthStore((store) => store.logout);

  const [, setCreateOpen] = useQueryState(
    "is_create_open",
    parseAsBoolean.withDefault(false),
  );

  const { title, enableCreate, breadcrumbs, onCreate } = layout;

  return (
    <header className="border-b border-neutral-700 h-20 px-5">
      <nav className="h-full flex justify-between">
        <div className="flex items-center">
          <div className="w-60 flex items-center gap-5">
            <h1 className="text-xl uppercase !font-family-display">Erkatoy</h1>
            <Badge
              variant="positive"
              UNSAFE_className="!font-bold !text-xs !text-white"
            >
              <Text UNSAFE_className="text-xs">ADMIN</Text>
            </Badge>
          </div>

          <div>
            {breadcrumbs ? (
              <Breadcrumbs>
                {[...breadcrumbs, { to: "", title }].map((item) => (
                  <Item key={item.to}>{item.title}</Item>
                ))}
              </Breadcrumbs>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {enableCreate && (
            <Button
              variant="accent"
              style="fill"
              onPress={() => {
                setCreateOpen(true);
                onCreate?.();
              }}
            >
              <Text>Create</Text>
              <Icon>
                <BiPlus />
              </Icon>
            </Button>
          )}
          <Avatar
            src="https://i.imgur.com/kJOwAdv.png"
            alt="default Adobe avatar"
          />
          <Button
            variant="secondary"
            style="fill"
            onPress={logout}
          >
            <Icon>
              <BiExit />
            </Icon>
          </Button>
        </div>
      </nav>
    </header>
  );
};
