import { EdadPipe } from './calcular-edad.pipe';

describe('CalcularEdadPipe', () => {
  it('create an instance', () => {
    const pipe = new EdadPipe();
    expect(pipe).toBeTruthy();
  });
});
