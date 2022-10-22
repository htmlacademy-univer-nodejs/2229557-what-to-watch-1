import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type ConfigSchema = {
  PORT: number;
  SALT: string;
  DB_HOST: string;
};

export const CONFIG_SCHEMA = convict<ConfigSchema>({
  PORT: {
    doc: 'Port',
    format: 'port',
    env: 'PORT',
    default: 1234
  },
  SALT: {
    doc: 'Salt',
    format: String,
    env: 'SALT',
    default: null
  },
  DB_HOST: {
    doc: 'Database IP',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1'
  }
});