
# An application developed using Deck.gl for Carto

It is written using React and Typescript. Please contact will.jones@hotmail.co.nz for any questions.

It deploys here: https://carto-wj.netlify.app/
  

It shows the following layers:

-  `carto-demo-data.demo_tables.retail_stores`

-  `carto-demo-data.demo_tilesets.sociodemographics_usa_blockgroup`

  

The user can do the following:

- Change layers' fill color

- Change layers' outline color

- Change layers' radius size

- Change layers' outline size
- Change layers's fill color to be defined by a key attribute (revenue for retail_stores, population for sociodemographics)
- Click on features to see a tooltip showing its attributes

  To run the application locally, complete the following steps:

  1. clone the repository
  2. install with npm or yarn
  3. add an .env file to the root directory and add a REACT_APP_CARTO_accessToken and a REACT_APP_CARTO_apiBaseUrl to this file
  4. run start with npm or yarn
