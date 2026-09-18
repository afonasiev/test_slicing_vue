import { describe, expect, it, vi, afterEach } from 'vitest';
import { createProfileService } from '../../index';

afterEach(() => vi.useRealTimers());
describe('profile service', () => {
  it('validates edits and resets verification only after changing email', async () => {
    const service = createProfileService();
    await expect(service.update({ name: '' })).rejects.toThrow('nome');
    await expect(service.update({ email: 'invalid' })).rejects.toThrow('email');
    await expect(service.verifyEmail('000000')).rejects.toThrow('Codice');
    await service.verifyEmail('123456');
    expect((await service.update({ name: 'Giulia' })).emailVerified).toBe(true);
    expect((await service.update({ email: 'new@example.com' })).emailVerified).toBe(false);
    expect((await service.load()).name).toBe('Giulia');
  });
  it('protects its state from callers and never returns a password', async () => {
    const service = createProfileService();
    const profile = await service.load();
    profile.name = 'changed externally';
    expect((await service.load()).name).toBe('Marco Rossi');
    await expect(service.changePassword('short')).rejects.toThrow('8 caratteri');
    await service.changePassword('password123');
    expect(await service.load()).not.toHaveProperty('password');
  });
  it('enforces the resend interval', async () => {
    vi.useFakeTimers();
    const service = createProfileService();
    await service.resendCode();
    await expect(service.resendCode()).rejects.toThrow('Attendi');
    vi.advanceTimersByTime(30_000);
    await expect(service.resendCode()).resolves.toBeUndefined();
  });
});
