export interface Config {
  get<T = any>(propertyPath: string): T | undefined;
  get<T = any>(propertyPath: string, defaultValue: T): T;
}
