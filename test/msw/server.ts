import { setupServer } from 'msw/node';

/** Server MSW bersama; tiap tes menambah handler lewat `server.use(...)`. */
export const server = setupServer();

export const API = 'http://api.test';
