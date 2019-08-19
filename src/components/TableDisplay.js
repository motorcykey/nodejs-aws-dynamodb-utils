import React, { Fragment, useEffect, useState, useContext } from 'react';
import UpdateItemLink from './UpdateItemLink';
import DeleteItemLink from './DeleteItemLink';
import UpdateInput from './UpdateInput';
import AddItemButton from './AddItemButton';
import ReadItemButton from './ReadItemButton';
import awsUtils from '../util/aws-utils';

import TableRowContext from '../context/table-row-context';

// only way I've been able to retrieve context is to keep a global reference
let newContext, rowsHaveBeenFetched, itemIdFetched;

const TableDisplay = () => {
  let initialFirstName, initialLastName;
  const context = useContext(TableRowContext);

  const [dataArray, setDataArray] = useState([]);
  const [tableRows, setTableRows] = useState([]);

  // executed on every render cycle after the component has been rendered
  // passing an empty '[]' as a second argument is similar to 'componentDidMount'
  useEffect(() => {
    scanForRows();
  }, []);

  // only run when 'dataArray' dependency has been updated
  useEffect(() => {
    if (dataArray.length > 0) {
      populateTable();
    }
  }, [dataArray]);

  useEffect(() => {
    newContext = context;
  }, [context]);

  // returns an update row with inputs for modifying an existing db item
  const displayUpdateRow = item => {
    return (
      <Fragment>
        <td>
          <UpdateInput fieldName='firstName' defaultValue={item.firstName} />
        </td>
        <td>
          <UpdateInput fieldName='lastName' defaultValue={item.lastName} />
        </td>
        <td>
          <a href='#' onClick={handleSaveUpdate}>save</a>
          &nbsp;
          <a href='#' onClick={handleCancelUpdate}>cancel</a>
        </td>
      </Fragment>
    );
  };

  // returns a default row with text from the database item
  const displayRow = item => {
    return (
      <Fragment>
        <td>
          {item.firstName}
        </td>
        <td>
          {item.lastName}
        </td>
        <td>
          <UpdateItemLink
            itemIndex={item.id}
            onClick={() => {handleUpdateLinkClicked(item);}}
          />
        </td>
      </Fragment>
    );
  };

  // builds the rows of the table body
  // if an 'updateId' argument is provided, then it is assumed that
  // the user is attempting to update that row and <input> tags will
  // be provided for the user to change the db values
  const populateTable = updateId => {
    var elements = [];

    // if 'id' provided as argument, replace first/last name with inputs
    dataArray.forEach(function(item) {
      elements.push(
        <tr key={item.id}>
          <td>
            {item.id}
          </td>
          {item.id == updateId ? (
            displayUpdateRow(item)
          ) : (
            displayRow(item)
          )}
          <td>
            <DeleteItemLink
              itemId={item.id}
              onClick={handleDeleteItem}
            />
          </td>
        </tr>
      );
    });

    setTableRows(elements);
  };

  // scan the data returned from db for data to populate table rows
  const scanForRows = data => {
    let tempArray = [];
    if (typeof data === 'undefined') {
      setTableRows([
        <tr key='test'>
          <td>-</td>
          <td className='name'>---</td>
          <td className='name'>---</td>
          <td className='update'>-</td>
          <td className='delete'>-</td>
        </tr>
      ]);
      return;
    }

    if (data.Items) {
      tempArray = data.Items;

      // sort & store array
      tempArray.sort((a, b) => (a.id > b.id) ? 1 : -1);
    } else if (data.Item) {
      tempArray.push(data.Item);
    }

    setDataArray(tempArray);
  };

  // scan db for data
  const handleFetchData = () => {
    const scanRequest = awsUtils.scanAllData();

    itemIdFetched = null;

    scanRequest.then(
      (data) => {
        scanForRows(data);
        rowsHaveBeenFetched = true;
        context.setMostRecentId(data.Items.length-1);
      },
      (err) => {
        console.error('Unable to scan the table. Error JSON: ', JSON.stringify(err, null, 2));
      }
    );
  };

  // handler for when a user chooses to 'update' a database item
  const handleUpdateLinkClicked = (item) => {
    const { id, firstName, lastName } = item;
    populateTable(id);

    // update state
    context.setId(id);
    context.setFirstName(firstName);
    context.setLastName(lastName);

    // save references to the original values
    initialFirstName = firstName;
    initialLastName = lastName;
  };

  // save updated input values to db
  const handleSaveUpdate = () => {
    const updateRequest = awsUtils.updateExistingItemById(
      {'id': newContext.id},
      {
        firstName: newContext.firstName,
        lastName: newContext.lastName
      }
    );

    updateRequest.then(
      () => {
        // on success, fetch table data & re-render rows
        // Note: this could be simplified to only re-render the row being updated
        if (itemIdFetched) {
          handleReadItem(itemIdFetched);
        } else {
          handleFetchData();
        }
      },
      (err) => {
        console.error('Unable to update item. Error JSON: ', JSON.stringify(err, null, 2));
      }
    );
  };

  // re-populate table when canceling update
  const handleCancelUpdate = () => {
    populateTable();
    context.setId('');
    context.setFirstName(initialFirstName);
    context.setLastName(initialLastName);
  };

  const handleAddClick = (newItem) => {
    const addRequest = awsUtils.addNewItemToTable(newItem);

    addRequest.then(
      (data) => {
        // on success, fetch table data & re-render rows
        // Note: this could be simplified to only re-render the row being updated
        handleFetchData();
      },
      (err) => {
        console.error('Unable to add item. Error JSON: ', JSON.stringify(err, null, 2));
      }
    );
  };

  const handleReadItem = (itemId) => {
    itemIdFetched = itemId;
    const readItemRequest = awsUtils.readItemByPrimaryKey({
      'id': itemId
    });

    readItemRequest.then(
      (data) => {
        scanForRows(data);
      },
      (err) => {
        console.error('Unable to read item. Error JSON: ', JSON.stringify(err, null, 2));
      }
    );
  };

  const handleDeleteItem = (itemId) => {
    const deleteRequest = awsUtils.deleteItemById({
      'id': itemId
    });
    deleteRequest.then(
      (data) => {
        handleFetchData();
      },
      (err) => {
        console.error('Unable to delete item. Error JSON: ', JSON.stringify(err, null, 2));
      }
    );
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>ID</td>
            <td className='name'>First Name</td>
            <td className='name'>Last Name</td>
            <td className='update'>Update</td>
            <td className='delete'>Delete</td>
          </tr>
        </thead>
        <tbody>
          {tableRows}
        </tbody>
      </table>
      <br />
      <button
        onClick={handleFetchData}
      >
        Fetch All Table Data
      </button>
      <br /><br />
      <ReadItemButton onClick={handleReadItem} />
      <br /><br />
      {rowsHaveBeenFetched &&
        <AddItemButton onClick={handleAddClick} />
      }
    </div>
  );
};

export default TableDisplay;
