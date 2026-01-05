import { Breadcrumbs, Button, Icon, Item, Text } from '@adobe/react-spectrum'
import { parseAsBoolean, useQueryState } from 'nuqs'
import { BiExit, BiPlus } from 'react-icons/bi'

import { useAuthStore } from '@/features/auth/store'
import { useLayoutStore } from '@/features/layout/store'

export const AppHeader = () => {
  const layout = useLayoutStore()
  const user = useAuthStore((store) => store.user)
  const logout = useAuthStore((store) => store.logout)

  const [, setCreateOpen] = useQueryState('is_create_open', parseAsBoolean.withDefault(false))

  const { title, enableCreate, breadcrumbs, onCreate } = layout

  return (
    <header className="border-b border-neutral-700 h-20 px-5">
      <nav className="h-full flex justify-between">
        <div className="flex items-center">
          <div className="min-w-60 flex items-center gap-5">
            <h3 className="font-matemasie! text-3xl m-0 -mt-1 leading-none">Erkatoy</h3>
            <span className="text-primary bg-primary/30 px-2 py-1 rounded-full uppercase text-xs font-semibold">
              Admin
            </span>
          </div>

          <div>
            {breadcrumbs ? (
              <Breadcrumbs>
                {[...breadcrumbs, { to: '', title }].map((item) => (
                  <Item key={item.to}>{item.title}</Item>
                ))}
              </Breadcrumbs>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-10">
          {enableCreate && (
            <Button
              variant="accent"
              style="fill"
              onPress={() => {
                setCreateOpen(true)
                onCreate?.()
              }}
            >
              <Text>Create</Text>
              <Icon>
                <BiPlus />
              </Icon>
            </Button>
          )}
          <div className="w-px h-1/2 bg-neutral-600"></div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4">
              <div className="size-12 bg-blue-500 text-white rounded-full overflow-hidden grid place-items-center">
                <b>
                  {user?.fio
                    ?.split(' ')
                    .map((name) => name[0].toUpperCase())
                    .slice(0, 2)
                    .join('')}
                </b>
              </div>
              <div className="flex flex-col">
                <h4 className="font-bold">{user?.fio}</h4>
                <p className="text-sm opacity-70">@{user?.username}</p>
              </div>
            </div>
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
        </div>
      </nav>
    </header>
  )
}
