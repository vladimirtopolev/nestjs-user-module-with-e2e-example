import { Document } from 'mongoose';

export const convertDBRecord2JSON = <T = any>(doc: Document): T => {
  return JSON.parse(JSON.stringify(doc)) as T;
};
