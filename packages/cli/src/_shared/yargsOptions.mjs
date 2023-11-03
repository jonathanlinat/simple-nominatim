/**
 * MIT License
 *
 * Copyright (c) 2023 Jonathan Linat <https://github.com/jonathanlinat>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software:"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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
