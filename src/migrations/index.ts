import * as migration_20260927_115112_baseline_pre_homepage from './20260927_115112_baseline_pre_homepage';
import * as migration_20260927_115217_homepage_redesign from './20260927_115217_homepage_redesign';
import * as migration_20260927_170130 from './20260927_170130';
import * as migration_20260928_000000_apple_touch_icon from './20260928_000000_apple_touch_icon';
import * as migration_20260929_094122_portfolio_gallery from './20260929_094122_portfolio_gallery';
import * as migration_20261003_113500_navigation_correction from './20261003_113500_navigation_correction';
import * as migration_20261004_073617_live_content_globals from './20261004_073617_live_content_globals';
import * as migration_20261007_143404_google_reviews_global from './20261007_143404_google_reviews_global';
import * as migration_20261008_075909_fix_service_db_identifiers from './20261008_075909_fix_service_db_identifiers';
import * as migration_20261017_082914_sofa_cta_labels from './20261017_082914_sofa_cta_labels';
import * as migration_20261025_120000_bed_upholstery_landing from './20261025_120000_bed_upholstery_landing';
import * as migration_20261105_120000_curtain_blind_catalogue from './20261105_120000_curtain_blind_catalogue';

export const migrations = [
  {
    up: migration_20260927_115112_baseline_pre_homepage.up,
    down: migration_20260927_115112_baseline_pre_homepage.down,
    name: '20260927_115112_baseline_pre_homepage',
  },
  {
    up: migration_20260927_115217_homepage_redesign.up,
    down: migration_20260927_115217_homepage_redesign.down,
    name: '20260927_115217_homepage_redesign',
  },
  {
    up: migration_20260927_170130.up,
    down: migration_20260927_170130.down,
    name: '20260927_170130',
  },
  {
    up: migration_20260928_000000_apple_touch_icon.up,
    down: migration_20260928_000000_apple_touch_icon.down,
    name: '20260928_000000_apple_touch_icon',
  },
  {
    up: migration_20260929_094122_portfolio_gallery.up,
    down: migration_20260929_094122_portfolio_gallery.down,
    name: '20260929_094122_portfolio_gallery',
  },
  {
    up: migration_20261003_113500_navigation_correction.up,
    down: migration_20261003_113500_navigation_correction.down,
    name: '20261003_113500_navigation_correction',
  },
  {
    up: migration_20261004_073617_live_content_globals.up,
    down: migration_20261004_073617_live_content_globals.down,
    name: '20261004_073617_live_content_globals',
  },
  {
    up: migration_20261007_143404_google_reviews_global.up,
    down: migration_20261007_143404_google_reviews_global.down,
    name: '20261007_143404_google_reviews_global',
  },
  {
    up: migration_20261008_075909_fix_service_db_identifiers.up,
    down: migration_20261008_075909_fix_service_db_identifiers.down,
    name: '20261008_075909_fix_service_db_identifiers',
  },
  {
    up: migration_20261017_082914_sofa_cta_labels.up,
    down: migration_20261017_082914_sofa_cta_labels.down,
    name: '20261017_082914_sofa_cta_labels'
  },
  {
    up: migration_20261025_120000_bed_upholstery_landing.up,
    down: migration_20261025_120000_bed_upholstery_landing.down,
    name: '20261025_120000_bed_upholstery_landing',
  },
  {
    up: migration_20261105_120000_curtain_blind_catalogue.up,
    down: migration_20261105_120000_curtain_blind_catalogue.down,
    name: '20261105_120000_curtain_blind_catalogue',
  },
];
