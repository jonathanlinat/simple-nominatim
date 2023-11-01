export const amenityOption = {
  description: 'Specify the name or type of point of interest (POI).',
  type: 'string'
}

export const cityOption = {
  description: 'Specify the city name.',
  type: 'string'
}

export const countryOption = {
  description: 'Specify the country name.',
  type: 'string',
  demandOption: true
}

export const countyOption = {
  description: 'Specify the county name.',
  type: 'string'
}

export const emailOption = {
  description:
    'Specify an appropriate email address when making large numbers of request.',
  type: 'string'
}

export const outputFormatOption = {
  description: 'Specify the desired output format.',
  type: 'string',
  choices: ['xml', 'json', 'jsonv2', 'geojson', 'geocodejson'],
  demandOption: true
}

export const latitudeOption = {
  description: 'Specify the latitude of the coordinate.',
  type: 'string',
  demandOption: true
}

export const limitOption = {
  description:
    'Specify the maximum number of returned results. Cannot be more than 40.',
  type: 'number'
}

export const longitudeOption = {
  description: 'Specify the longitude of the coordinate.',
  type: 'string',
  demandOption: true
}

export const postalCodeOption = {
  description: 'Specify the postal code',
  type: 'string'
}

export const queryOption = {
  description: 'Specify the free-form query string to search.',
  type: 'string',
  demandOption: true
}

export const stateOption = {
  description: 'Specify the state name.',
  type: 'string'
}

export const statusFormatOption = {
  description: 'Specify the desired output format.',
  type: 'string',
  choices: ['text', 'json'],
  demandOption: true
}

export const streetOption = {
  description: 'Specify the house number and street name',
  type: 'string'
}
