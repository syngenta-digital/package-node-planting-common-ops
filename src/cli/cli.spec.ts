import { doesFileExists, main } from './cli';

test('get file path', async () => {
  const filePath = await doesFileExists('./');
  expect(filePath).not.toBeUndefined();
});

test('get file wrong path', async () => {
  try {
    const filePath = await doesFileExists('');
    expect(filePath).toStrictEqual(false);
  } catch (error) {
    expect(error).toBeInstanceOf(false);
  }
});

test('execute main function', async () => {
  const mainCall = await main();
  expect(mainCall).toStrictEqual(undefined);
});
