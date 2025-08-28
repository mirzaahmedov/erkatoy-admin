import type { ComponentType, FC, SVGAttributes } from "react";
import { BiCard, BiSolidGrid, BiTag } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";

export const AppSidebar = () => {
  return (
    <aside className="border-r border-neutral-600 px-1 py-2.5 w-60">
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
      </ul>
    </aside>
  );
};

const NavItem: FC<{
  label: string;
  to: string;
  icon: ComponentType<SVGAttributes<SVGElement>>;
}> = (props) => {
  const { label, to, icon: Icon } = props;

  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          twMerge(
            "mb-1 px-4 py-2 font-semibold cursor-pointer flex items-center gap-2.5 hover:bg-neutral-700 rounded-md transition-colors",
            isActive &&
              "bg-purple-500/20 hover:bg-purple-500/20 text-purple-400",
          )
        }
      >
        <Icon className="size-6" /> {label}
      </NavLink>
    </li>
  );
};
