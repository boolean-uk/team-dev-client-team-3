export interface TestUserData {
  id?: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  githubUsername: string;
  mobile: string;
  role: number;
  specialism: string;
  cohort: string;
  startDate: Date;
  endDate: Date;
  bio: string;
}

export const getNewTestUser = (overrides: Partial<TestUserData> = {}): TestUserData => {
  const saltSeed = Date.now() + Math.floor(Math.random() * 1_000);

  // number of milliseconds in one day
  const ONE_DAY = 24 * 60 * 60 * 1000;

  const startDate = overrides.startDate ?? new Date(saltSeed + 7 * ONE_DAY); // 7 days in the future
  const endDate = overrides.endDate ?? new Date(saltSeed + 14 * ONE_DAY); // 14 days in the future

  const salt = overrides.username ?? `test-user-${saltSeed}`;

  return {
    email: overrides.email ?? `test_email_${saltSeed}@example.com`,
    password: overrides.password ?? 'SuperHash!4',
    firstName: overrides.firstName ?? 'Test',
    lastName: overrides.lastName ?? 'Tester',
    username: overrides.username ?? salt,
    githubUsername: overrides.githubUsername ?? `gh-user-${saltSeed}`,
    mobile: overrides.mobile ?? '+4712345678',
    role: overrides.role ?? 0,
    specialism: overrides.specialism ?? `Test-developer ${saltSeed}`,
    cohort: overrides.cohort ?? 'Cohort 1',
    startDate,
    endDate,
    bio: overrides.bio ?? `Test-developer bio with salt: ${saltSeed}`
  };
};
