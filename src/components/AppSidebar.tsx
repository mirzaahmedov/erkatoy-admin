import type { ComponentType, FC, SVGAttributes } from 'react'

import { BiCard, BiSolidGrid, BiTag } from 'react-icons/bi'
import { HiSpeakerphone } from 'react-icons/hi'
import { PiGifFill, PiImage } from 'react-icons/pi'
import { NavLink } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'

export const AppSidebar = () => {
  return (
    <aside className="border-r border-neutral-700 px-1 py-2.5 w-60">
      <ul>
        <NavItem
          label="Category"
          to="/category"
          icon={BiSolidGrid}
        />
        <NavItem
          label="Tag"
          to="/tag"
          icon={BiTag}
        />
        <NavItem
          label="Post"
          to="/post"
          icon={BiCard}
        />
        <NavItem
          label="Gif"
          to="/gif"
          icon={PiGifFill}
        />
        <NavItem
          label="Ads"
          to="/ads"
          icon={HiSpeakerphone}
        />
        <NavItem
          label="Background Images"
          to="/bg-images"
          icon={PiImage}
        />
      </ul>
    </aside>
  )
}

const NavItem: FC<{
  label: string
  to: string
  icon: ComponentType<SVGAttributes<SVGElement>>
}> = (props) => {
  const { label, to, icon: Icon } = props

  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          twMerge(
            'mb-1 px-4 py-2 font-semibold cursor-pointer flex items-center gap-2.5 hover:bg-neutral-800 rounded-md transition-colors',
            isActive && 'bg-blue-500/10 hover:bg-blue-500/10 text-blue-400'
          )
        }
      >
        <Icon className="size-6" /> {label}
      </NavLink>
    </li>
  )
}
