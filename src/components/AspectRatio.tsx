import type { FC, HTMLAttributes } from 'react'

import { twMerge } from 'tailwind-merge'

export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  ratio?: number
}
export const AspectRatio: FC<AspectRatioProps> = ({ children, ratio = 1, className, ...props }) => {
  return (
    <div
      className={twMerge('relative w-full', className)}
      style={{
        paddingTop: `${100 / ratio}%`
      }}
      {...props}
    >
      <div className="absolute top-0 left-0 bottom-0 right-0">{children}</div>
    </div>
  )
}
