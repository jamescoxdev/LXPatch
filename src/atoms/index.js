import { atom } from 'recoil';

export const patchList = atom({
    key: 'patchList',
    default: [[]]
});

export const appSettings = atom({
    key: 'appSettings',
    default: {
        UniverseCount: 1,
        ShowDip: true,
        ShowMode: true,
        ShowChCount: false
    }
});

export const showSettings = atom({
    key: 'showSettings',
    default: false
});