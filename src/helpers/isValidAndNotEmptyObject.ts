import { isArray } from 'class-validator';

export function isValidAndNotEmptyObject(data: any): any {
  const regex = new RegExp(
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(incorainc.com)$/i,
  );
  if (!isArray(data) || data.length === 0) return false;
  for (const object of data) {
    if (Object.keys(object).length !== 1 || !regex.test(object.email))
      return false;
  }
  return true;
}
