# nodejs-aws-dynamodb-utils

## What is this?

A library of AWS Utilities for CRUD Items in AWS DynamoDB. Included along with the library is a sample app that uses an example of each method from the library.

## Before You Begin...

1. Copy & Paste `example-to-copy/index.js` into a new folder named: `credentials`
2. Fill out & save the config options in the new version of this file you've just saved in your `config` folder

### Questions about AWS Credentials?

Using this repo will require that you have AWS access, a User Role with access to an AWS sandbox account which you can assume the role for, and an MFA token set-up.

## Starting the example app

Running the following in the main repository directory will start a webpack dev server 

`npm run dev`

While running the below script will compile all scripts, output them into a `dist` folder, before starting a webpack dev server:

`npm run build`

## Using for your own application

Either this example application can be used as the basis for your own application, or if your app is already built and you are looking to leverage the AWS Utils, you will want to copy over & import the following into your project:

`./config/index.js`
`./src/util/aws-utils.js`
