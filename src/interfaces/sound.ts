export type ErrorLevel = 0 | 1 | 2 | 3 | 4;

export type Fragment = { module: number; duration?: number;};

export type Section = {
  // only two sections supported by the app
  id: "seccion1" | "seccion2" | "seccion3" | "seccion4";
  // variants for error layers: 0 = no error, 1 = minor, 2 = major
  variants: Record<ErrorLevel, Fragment>;
};

export type Song = {
  id: `song${string}`;
  title: string;
  sections: Section[];
};
