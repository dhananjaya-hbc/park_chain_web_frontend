import { Xumm } from 'xumm';

let xummInstance: Xumm | null = null;

if (typeof window !== 'undefined') {
  xummInstance = new Xumm('10b335df-a050-4291-8b4a-af19642dad70');
}

export const xumm = xummInstance;