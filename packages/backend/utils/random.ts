export const randomIndex = (length: number): number =>
  Math.floor(Math.random() * length);

export const randomBoolean = (): boolean => Math.random() <= 0.5;
