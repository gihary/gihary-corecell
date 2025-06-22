import { jest } from '@jest/globals';

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
    expect(diffEntries(oldEntry, newEntry)).toEqual({ differences: {} });
  });

  test('detects changed and added keys', () => {
    const oldEntry = { a: 1, b: 2 };
    const newEntry = { a: 1, b: 3, c: 4 };
    expect(diffEntries(oldEntry, newEntry)).toEqual({
      differences: {
        b: { old: 2, new: 3 },
        c: { old: undefined, new: 4 },
      },
    });
  });

  test('detects removed keys', () => {
    const oldEntry = { a: 1, b: 2 };
    const newEntry = { a: 1 };
    expect(diffEntries(oldEntry, newEntry)).toEqual({
      differences: {
        b: { old: 2, new: undefined },
      },
    });
  });

  test('ignores keys listed in fieldsToIgnore', () => {
    const oldEntry = { a: 1, b: 2 };
    const newEntry = { a: 3, b: 4 };
    const options = { fieldsToIgnore: ['b'] };
    expect(diffEntries(oldEntry, newEntry, options)).toEqual({
      differences: {
        a: { old: 1, new: 3 },
      },
    });
  });
});

describe('rollbackMemory', () => {
  let rollbackMemory;
  let entries;

  beforeEach(async () => {
    jest.resetModules();
    entries = [];
    jest.unstable_mockModule('firebase-admin/firestore', () => ({
      getFirestore: () => ({
        collection: () => ({
          doc: () => ({
            collection: () => ({
              orderBy: () => ({
                get: async () => ({
                  empty: entries.length === 0,
                  forEach: (cb) => entries.forEach((e) => cb({ data: () => e })),
                }),
              }),
            }),
          }),
        }),
      }),
    }));
    ({ rollbackMemory } = await import('../src/rollback.js'));
  });

  afterEach(() => {
    jest.resetModules();
  });

  test('restores closest backup when available', async () => {
    entries.push(
      { timestamp: '2023-01-01T00:00:00Z', data: { v: 1 } },
      { timestamp: '2023-01-03T00:00:00Z', data: { v: 3 } },
    );
    const result = await rollbackMemory('u', '2023-01-02T18:00:00Z');
    expect(result).toEqual({ v: 3 });
  });

  test('returns null when no backups exist', async () => {
    entries = [];
    const result = await rollbackMemory('u', '2023-01-02T00:00:00Z');
    expect(result).toBeNull();
  });
});
