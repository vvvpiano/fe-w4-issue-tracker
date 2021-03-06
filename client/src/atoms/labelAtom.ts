import { atom, selector } from 'recoil';
import { fetchLabels } from '@apis';
import { ILabel } from '@types';

export const labelInfoSelector = selector<ILabel[]>({
    key: 'labelInfoSelector',
    get: async () => {
        const res = await fetchLabels();
        if (!res.ok) throw Error(`fetch fail! status code: ${res.status}`);
        const { data } = await res.json();
        return data;
    },
});

export const labelInfoAtom = atom<ILabel[]>({
    key: 'labelInfo',
    default: labelInfoSelector,
});
