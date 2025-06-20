afterAll(() => {
  // jest sometimes keeps open handles with firebase-admin; force exit
});

let diffEntries;
beforeAll(async () => {
  ({ diffEntries } = await import('../src/rollback.js'));
});

describe('diffEntries', () => {
  test('returns empty object when entries are identical', () => {
    const oldEntry = { a: 1, b: 2 };
    const newEntry = { a: 1, b: 2 };
    expect(diffEntries(oldEntry, newEntry)).toEqual({});
  });

  test('detects changed and added keys', () => {
    const oldEntry = { a: 1, b: 2 };
    const newEntry = { a: 1, b: 3, c: 4 };
    expect(diffEntries(oldEntry, newEntry)).toEqual({
      b: { old: 2, new: 3 },
      c: { old: undefined, new: 4 },
    });
  });

  test('detects removed keys', () => {
    const oldEntry = { a: 1, b: 2 };
    const newEntry = { a: 1 };
    expect(diffEntries(oldEntry, newEntry)).toEqual({
      b: { old: 2, new: undefined },
    });
  });
});
