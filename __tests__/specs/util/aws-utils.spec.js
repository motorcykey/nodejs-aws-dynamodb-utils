import awsUtils from '../../../src/util/aws-utils';
import config from '../../../config/';

describe('AWS Utils', () => {

  const tableName = config.DYNAMO_DB_TABLE_NAME;

  it('return params with update expressions for each key/value pair', () => {
    const expected = {
      TableName: tableName,
      Key: {
        primaryKey: 'Test'
      },
      UpdateExpression: 'set key1 = :key1,key2 = :key2,key3 = :key3',
      ExpressionAttributeValues: {
        ':key1': 'value1',
        ':key2': 'value2',
        ':key3': 'value3'
      },
      ReturnValues: 'UPDATED_NEW'
    };
    const primaryKeyValues = {
      primaryKey: 'Test'
    };
    const itemValues = {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3'
    };

    const updateParams = awsUtils.createUpdateParams(primaryKeyValues, itemValues);
    expect(updateParams).toStrictEqual(expected);
  });

});
