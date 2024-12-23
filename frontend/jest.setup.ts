import '@testing-library/jest-dom';
import { server } from '@/core/config/mocks/server';

// MSWのサーバーをセットアップ
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close()); 