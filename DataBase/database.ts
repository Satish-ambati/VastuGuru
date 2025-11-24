import { openDatabaseSync } from 'expo-sqlite';

// User interface
export interface Person {
  id?: number;
  name: string;
  heightInFeets: number;
  heightInInches: number;
  widthInFeets: number;
  widthInInches: number;
}

// Open or create the database using the installed expo-sqlite API
const db = openDatabaseSync('peopleDB.db');

// Create the user table if it doesn't exist
export const createTable = (): void => {
  try {
    db.execSync(`CREATE TABLE IF NOT EXISTS persons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        heightInFeets INTEGER NOT NULL,
        heightInInches INTEGER NOT NULL,
        widthInFeets INTEGER NOT NULL,
        widthInInches INTEGER NOT NULL);`);
    console.log('Table created successfully');
  } catch (error) {
    console.error('Error creating table:', error);
  }
};

// Function to register a new user
export const insertPerson = (
  name: string,
  heightInFeets: number,
  heightInInches: number,
  widthInFeets: number,
  widthInInches: number,
  successCallback: () => void,
  errorCallback: (error: string) => void
): void => {
  try {
    const result = db.runSync('INSERT INTO persons (name, heightInFeets, heightInInches, widthInFeets, widthInInches)VALUES (?, ?, ?, ?, ?);', [
      name,
      heightInFeets,
      heightInInches,
      widthInFeets,
      widthInInches
    ]);
    // `runSync` returns an object with info like `lastInsertRowId` / `changes`
    if ((result as any).lastInsertRowId || (result as any).changes > 0) {
      successCallback();
    } else {
      errorCallback('Failed to insert user');
    }
  } catch (err: any) {
    const msg = String(err?.message ?? err);
    if (msg.toLowerCase().includes('unique') || msg.toLowerCase().includes('constraint')) {
      errorCallback('Email already exists or failed to register');
    } else {
      errorCallback('Transaction failed');
    }
  }
};

// Function to check user credentials (for Signin)
export const getAllPersons = (
  successCallback: (persons: Person[]) => void,
  errorCallback: (error: string) => void
): void => {
  try {
    const rows = db.getAllSync<Person>('SELECT * FROM persons;');

    successCallback(rows ?? []);
  } catch (err: any) {
    console.error('Get all persons error:', err);
    errorCallback('Something went wrong while retrieving persons');
  }
};
export const deletePersonByName = (
  name: string,
  successCallback: () => void,
  errorCallback: (error: string) => void
): void => {
  try {
    const result = db.runSync('DELETE FROM persons WHERE name = ?;', [name]);

    // result.changes indicates how many rows were deleted
    if (result.changes > 0) {
      successCallback();
    } else {
      errorCallback('No matching record found to delete');
    }
  } catch (err: any) {
    console.error("Delete person error:", err);
    errorCallback("Failed to delete person");
  }
};
