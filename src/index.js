import ImportApplication from './server/import';
import CallbacksService from './server/callbacks';
import Operations from './server/operations';
import Accounts from './server/accounts';

const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

const callbacks = new CallbacksService();
const operations = new Operations(spreadsheet.getSheetByName('💳Операции'));
const accounts = new Accounts(spreadsheet.getSheetByName('🏦Счета'));
const importApp = new ImportApplication(callbacks, operations, accounts);

global.onOpen = () => {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('FFinances')
    .addItem('Import report', 'beginImport')
    .addToUi();
};

global.beginImport = () => {
  importApp.start();
};

global.handleForm = data => {
  return callbacks.handle(data.callbackId, data);
};
