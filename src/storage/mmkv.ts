import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
    id: 'finances_storage',
    encryptionKey: process.env.SECRET_KEY
})