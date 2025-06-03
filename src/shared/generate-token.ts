import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import md5 from 'md5';

dotenv.config();

function timeToken(expLong?: boolean): number {
    const segundos = expLong ? (60 * 60 * 24 * 365) : 10; // 10 segundos (padrão) ou 1 ano
    return Math.floor(Date.now() / 1000) + segundos;
}

// function timeToken(expLong?: boolean): number {
//     const hora: number = expLong ? (24 * 365) : 24; // 24 horas (padrão) para Dev 365 dias    
//     const umaHoraEmSegundos = 60 * 60 * hora;
//     return Math.floor(Date.now() / 1000) + umaHoraEmSegundos;
// }

export function generateRefreshToken(token: string): string {
    const segredo = process.env.JWT_SEGREDO || '';
    const hash = md5(token + segredo).toUpperCase();
    const formattedUUID = `${hash.substring(0, 8)}-${hash.substring(8, 12)}-${hash.substring(12, 16)}-${hash.substring(16, 20)}-${hash.substring(20, 32)}`;
    return formattedUUID;
}

export function generateToken(uid: number, usernmae: string, expLong?: boolean): any {
    const segredo = process.env.JWT_SEGREDO || '';
    const token = jwt.sign(
        {
            roles: ['user'],
            permissions: ['dashboard'],
            profile: {
                id: uid,
                name: usernmae
            },
            exp: timeToken(expLong),
            sub: uid
        },
        segredo,
    );
    const refreshToken = generateRefreshToken(token);
    return { success: true, token: token, refreshToken: refreshToken, roles: ['user'], permissions: ['ava'] };
}
