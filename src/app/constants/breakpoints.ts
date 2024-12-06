export const breakpoints = {
  mobile: "400px",
  tablet: "820px",
  desktop: "821px",
} as const;

export const media = {
  mobile: `@media(max-width: ${breakpoints.mobile})`,
  tablet: `@media(min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet})`,
  desktop: `@media(min-width: ${breakpoints.desktop})`,
} as const;
