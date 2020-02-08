import appConfig from './app';

const { host, username, password, name } = appConfig.database;

module.exports = {
  dialect: 'postgres',
  host,
  username,
  password,
  database: name,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
