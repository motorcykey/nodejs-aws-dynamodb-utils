import AWS from 'aws-sdk';
import config from '../../config/';

// login to main profile
AWS.config.update({
  region: config.AWS_ACCOUNT_REGION,
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY
});

let docClient;
const sts = new AWS.STS({apiVersion: '2011-06-15'});
const table = config.DYNAMO_DB_TABLE_NAME;

/**
 * assumes IAM Role that main profile has access to
 * this would theoretically be a Role with specific permissions or 
 * access to another account that will contain your DynamoDB/AWS service
 *
 * this needs to be called before any interaction with DynamoDB/AWS service
 *
 * @param token - example currently requires MFA token
 **/
const assumeRole = (token) => {
  const request = sts.assumeRole({
    RoleArn: config.AWS_ROLE_ARN,
    RoleSessionName: config.AWS_ROLE_SESSION_NAME,
    SerialNumber: config.AWS_ROLE_MFA_SERIAL, // for MFA token only
    TokenCode: token // for MFA token only
  });
  const promise = request.promise();
  return promise;
};

// specifically for DynamoDB
const authenticateUser = (credentials) => {
  AWS.config.update({
    endpoint: 'http://dynamodb.' + config.AWS_ACCOUNT_REGION + '.amazonaws.com/',
    accessKeyId: credentials.AccessKeyId,
    secretAccessKey: credentials.SecretAccessKey,
    sessionToken: credentials.SessionToken
  });

  // set reference to DynamoDB
  docClient = new AWS.DynamoDB.DocumentClient();
};

/**
 * Creates a param Object containing update expressions for all key/value pairs to
 * modify/add to DynamoDB item
 * @param {Object} primaryKeyValues - { key: value } - the primary key/value pair of the item to be updated
 * @param {Object} updatedKeyValues - { key1: value1, ... } - an object of values to update on the item
 * @return {Object} Params object for use with updating an Item in DynamoDB
 */
const createUpdateParams = (primaryKeyValues, updatedKeyValues) => {
  let updateExpression = 'set ';
  let expressionAttributeValues = {};
  const params = {
    TableName: table,
    Key: primaryKeyValues,
    ReturnValues: 'UPDATED_NEW'
  };

  Object.entries(updatedKeyValues).forEach(([key, value]) => {
    updateExpression += key + ' = :' + key + ',';
    expressionAttributeValues[':' + key] = value;
  });

  // remove trailing comma from end of string
  updateExpression = updateExpression.substring(0, updateExpression.length - 1);

  return Object.assign(params, {
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues
  });
};

/**
 * Adds a new item to DynamoDB table
 * @param {Object} primaryKeyValues
 * @param {Object} additionalKeyValues
 * @return {function} Promise with a then() method that takes resolve/reject callbacks
 */
const addNewItemToTable = (itemObject) => {
  const params = {
    TableName: table,
    Item: itemObject
  };

  const request = docClient.put(params);
  const promise = request.promise();
  return promise;
};

/**
 * Finds Item by primary key in DynamoDB and returns its data
 * @param {Object} primaryKeyValues - an object containing a key/value pair for the primary key
 * @return {function} Promise with a then() method that takes resolve/reject callbacks
 */
const readItemByPrimaryKey = (primaryKeyValues) => {
  const params = {
    TableName: table,
    Key: primaryKeyValues
  };

  const request = docClient.get(params);
  const promise = request.promise();
  return promise;
};

/**
 * Finds Item by primary key in DynamoDB and updates with new set of key/value pairs
 * @param {Object} primaryKeyValues - { key: value } - the primary key/value pair of the item to be updated
 * @param {Object} updatedKeyValues - { key1: value1, ... } - an object of values to update on the item
 * @return {Object} Promise with a then() method that takes resolve/reject callbacks
 */
const updateExistingItemById = (primaryKeyValues, updatedKeyValues) => {
  const params = createUpdateParams(primaryKeyValues, updatedKeyValues);

  const request = docClient.update(params);
  const promise = request.promise();
  return promise;
};

/**
 * Finds Item by primary key in DynamoDB and removes from table
 * @param {Object} primaryKeyValues - { key: value } - the primary key/value pair of the item to be deleted
 * @return {function} Promise with a then() method that takes resolve/reject callbacks
 */
const deleteItemById = (primaryKeyValues) => {
  const params = {
    TableName: table,
    Key: primaryKeyValues
  };

  const request = docClient.delete(params);
  const promise = request.promise();
  return promise;
};

/**
 * Scans all data on specified AWS DynamoDB Table. Table is defined at top of this script
 * @return {function} Promise with a then() method that takes resolve/reject callbacks
 */
const scanAllData = () => {
  const params = {
    TableName: table
  };

  const request = docClient.scan(params);
  const promise = request.promise();
  return promise;
};

const utils = {
  addNewItemToTable,
  readItemByPrimaryKey,
  updateExistingItemById,
  deleteItemById,
  scanAllData,
  assumeRole,
  authenticateUser,
  createUpdateParams
};

export default utils;
