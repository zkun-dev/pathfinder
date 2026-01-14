import { twMerge } from "tailwind-merge"

/**
 * 合并 Tailwind CSS 类名
 * 替代 clsx，使用 Vue 原生方式
 */
export function cn(...inputs: (string | boolean | null | undefined)[]) {
  const classes = inputs.filter(Boolean).join(' ');
  return twMerge(classes);
}
