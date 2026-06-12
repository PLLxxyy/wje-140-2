export const databaseConfig = {
  type: 'better-sqlite3' as const,
  database: ':memory:',
  autoLoadEntities: true,
  synchronize: true
};
