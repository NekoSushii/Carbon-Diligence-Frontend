import { SafeBooleanPipe } from './safe-boolean.pipe';

describe('SafeBooleanPipe', () => {
  it('create an instance', () => {
    const pipe = new SafeBooleanPipe();
    expect(pipe).toBeTruthy();
  });

  it('should convert null or undefined to false', () => {
    const pipe = new SafeBooleanPipe();
    expect(pipe.transform(null)).toBe(false);
    expect(pipe.transform(undefined)).toBe(false);
  });

  it('should convert truthy values to true', () => {
    const pipe = new SafeBooleanPipe();
    expect(pipe.transform(true)).toBe(true);
    expect(pipe.transform(1)).toBe(true);
  });

  it('should convert falsy values to false', () => {
    const pipe = new SafeBooleanPipe();
    expect(pipe.transform(false)).toBe(false);
    expect(pipe.transform(0)).toBe(false);
  });
});
