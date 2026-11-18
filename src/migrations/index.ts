import * as migration_20261117_112013_initial from './20261117_112013_initial';
import * as migration_20261118_054246_plugin_screens from './20261118_054246_plugin_screens';
import * as migration_20261118_061002_trash_and_html_body from './20261118_061002_trash_and_html_body';
import * as migration_20261118_063905_reading_and_form_settings from './20261118_063905_reading_and_form_settings';
import * as migration_20261118_064748_comments from './20261118_064748_comments';

export const migrations = [
  {
    up: migration_20261117_112013_initial.up,
    down: migration_20261117_112013_initial.down,
    name: '20261117_112013_initial',
  },
  {
    up: migration_20261118_054246_plugin_screens.up,
    down: migration_20261118_054246_plugin_screens.down,
    name: '20261118_054246_plugin_screens',
  },
  {
    up: migration_20261118_061002_trash_and_html_body.up,
    down: migration_20261118_061002_trash_and_html_body.down,
    name: '20261118_061002_trash_and_html_body',
  },
  {
    up: migration_20261118_063905_reading_and_form_settings.up,
    down: migration_20261118_063905_reading_and_form_settings.down,
    name: '20261118_063905_reading_and_form_settings',
  },
  {
    up: migration_20261118_064748_comments.up,
    down: migration_20261118_064748_comments.down,
    name: '20261118_064748_comments'
  },
];
