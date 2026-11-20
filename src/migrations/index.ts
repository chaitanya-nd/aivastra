import * as migration_20261117_112013_initial from './20261117_112013_initial';
import * as migration_20261118_054246_plugin_screens from './20261118_054246_plugin_screens';
import * as migration_20261118_061002_trash_and_html_body from './20261118_061002_trash_and_html_body';
import * as migration_20261118_063905_reading_and_form_settings from './20261118_063905_reading_and_form_settings';
import * as migration_20261118_064748_comments from './20261118_064748_comments';
import * as migration_20261120_063848_search_visibility from './20261120_063848_search_visibility';
import * as migration_20261120_093812_seo_posts_cms_parity from './20261120_093812_seo_posts_cms_parity';
import * as migration_20261120_124349_workflow_security_feeds from './20261120_124349_workflow_security_feeds';

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
    name: '20261118_064748_comments',
  },
  {
    up: migration_20261120_063848_search_visibility.up,
    down: migration_20261120_063848_search_visibility.down,
    name: '20261120_063848_search_visibility',
  },
  {
    up: migration_20261120_093812_seo_posts_cms_parity.up,
    down: migration_20261120_093812_seo_posts_cms_parity.down,
    name: '20261120_093812_seo_posts_cms_parity',
  },
  {
    up: migration_20261120_124349_workflow_security_feeds.up,
    down: migration_20261120_124349_workflow_security_feeds.down,
    name: '20261120_124349_workflow_security_feeds'
  },
];
