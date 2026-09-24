const { withAppBuildGradle, withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

const KEYSTORE_DIR = 'keystore';
const KEYSTORE_FILE = 'meucaixa-release.keystore';
const CREDENTIALS_FILE = 'credentials.json';

function readCredentials(projectRoot) {
  const fromEnv = {
    storePassword: process.env.MEUCAIXA_STORE_PASSWORD,
    keyAlias: process.env.MEUCAIXA_KEY_ALIAS,
    keyPassword: process.env.MEUCAIXA_KEY_PASSWORD,
  };

  if (fromEnv.storePassword && fromEnv.keyAlias && fromEnv.keyPassword) return fromEnv;

  const file = path.join(projectRoot, KEYSTORE_DIR, CREDENTIALS_FILE);

  if (!fs.existsSync(file)) {
    throw new Error(
      `withReleaseSigning: faltam as credenciais de assinatura.\n` +
        `Crie ${KEYSTORE_DIR}/${CREDENTIALS_FILE} com storePassword, keyAlias e keyPassword, ` +
        `ou exporte MEUCAIXA_STORE_PASSWORD, MEUCAIXA_KEY_ALIAS e MEUCAIXA_KEY_PASSWORD.`,
    );
  }

  const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));

  for (const key of ['storePassword', 'keyAlias', 'keyPassword']) {
    if (!parsed[key]) {
      throw new Error(`withReleaseSigning: ${CREDENTIALS_FILE} não tem "${key}"`);
    }
  }

  return parsed;
}

const withKeystoreCopy = (config) =>
  withDangerousMod(config, [
    'android',
    async (mod) => {
      const { projectRoot, platformProjectRoot } = mod.modRequest;
      const source = path.join(projectRoot, KEYSTORE_DIR, KEYSTORE_FILE);

      if (!fs.existsSync(source)) {
        throw new Error(
          `withReleaseSigning: keystore não encontrada em ${KEYSTORE_DIR}/${KEYSTORE_FILE}. ` +
            'Sem ela o release sai assinado com a chave de debug e não instala por cima da versão atual.',
        );
      }

      const credentials = readCredentials(projectRoot);

      fs.copyFileSync(source, path.join(platformProjectRoot, 'app', KEYSTORE_FILE));

      const propsPath = path.join(platformProjectRoot, 'gradle.properties');
      let props = fs.readFileSync(propsPath, 'utf8');

      const values = {
        MEUCAIXA_STORE_FILE: KEYSTORE_FILE,
        MEUCAIXA_STORE_PASSWORD: credentials.storePassword,
        MEUCAIXA_KEY_ALIAS: credentials.keyAlias,
        MEUCAIXA_KEY_PASSWORD: credentials.keyPassword,
      };

      for (const [key, value] of Object.entries(values)) {
        const line = `${key}=${value}`;
        props = props.includes(`${key}=`)
          ? props.replace(new RegExp(`^${key}=.*$`, 'm'), line)
          : `${props.trimEnd()}\n${line}\n`;
      }

      fs.writeFileSync(propsPath, props, 'utf8');
      return mod;
    },
  ]);

const withSigningConfig = (config) =>
  withAppBuildGradle(config, (mod) => {
    let gradle = mod.modResults.contents;

    if (!gradle.includes('MEUCAIXA_STORE_FILE')) {
      gradle = gradle.replace(
        /(signingConfigs \{\s*\n\s*debug \{[\s\S]*?\n {8}\}\n)/,
        `$1        release {
            storeFile file(MEUCAIXA_STORE_FILE)
            storePassword MEUCAIXA_STORE_PASSWORD
            keyAlias MEUCAIXA_KEY_ALIAS
            keyPassword MEUCAIXA_KEY_PASSWORD
        }\n`,
      );
    }

    gradle = gradle.replace(
      /(release \{[^}]*?)signingConfig signingConfigs\.debug/,
      '$1signingConfig signingConfigs.release',
    );

    if (!gradle.includes('signingConfig signingConfigs.release')) {
      throw new Error('withReleaseSigning: não consegui aplicar o signingConfig de release');
    }

    mod.modResults.contents = gradle;
    return mod;
  });

module.exports = (config) => withSigningConfig(withKeystoreCopy(config));
