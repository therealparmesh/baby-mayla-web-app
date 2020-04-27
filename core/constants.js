const getDatabaseName = (name) =>
  `${name}${process.env.NODE_ENV === 'development' ? '_dev' : ''}`;

export const DATABASES = {
  FEEDINGS: getDatabaseName('feedings'),
  PUMPINGS: getDatabaseName('pumpings'),
};

export const FEEDING_TYPES = {
  NONE: '',
  BREAST: 'breast',
  BOTTLE: 'bottle',
  BOTTLE_INCLUDING_FORMULA: 'bottle_f',
  MIXED: 'mixed',
  MIXED_INCLUDING_FORMULA: 'mixed_f',
};

export const AMOUNTS = [
  0,
  0.25,
  0.5,
  0.75,
  1,
  1.25,
  1.5,
  1.75,
  2,
  2.25,
  2.5,
  2.75,
  3,
  3.25,
  3.5,
  3.75,
  4,
  4.25,
  4.5,
  4.75,
  5,
  5.25,
  5.5,
  5.75,
  6,
  6.25,
  6.5,
  6.75,
  7,
  7.25,
  7.5,
  7.75,
  8,
];
