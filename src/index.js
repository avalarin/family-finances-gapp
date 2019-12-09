import ImportApplication from './server/import';
import CallbacksService from './server/callbacks';
import Operations from './server/operations';
import Accounts from './server/accounts';
import autoAssignCategories from './server/auto_category';

const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

const categoriesSheet = spreadsheet.getSheetByName('📘Автоназначение категорий v2');

const callbacks = new CallbacksService();
const operations = new Operations(spreadsheet.getSheetByName('💳Операции'));
const accounts = new Accounts(spreadsheet.getSheetByName('🏦Счета'));
const importApp = new ImportApplication(callbacks, operations, accounts);

global.onOpen = () => {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('FFinances')
    .addItem('Import report', 'beginImport')
    .addItem('Auto assign categories', 'autoAssignCategories')
    .addToUi();
};

global.beginImport = () => {
  importApp.start();
};

global.autoAssignCategories = () => {
  const activeSheet = spreadsheet.getActiveSheet();
  if (activeSheet.getName() !== '💳Операции') {
    throw new Error('Может быть вызвано только на листе 💳Операции');
  }
  const rows = [];
  spreadsheet
    .getActiveRangeList()
    .getRanges()
    .forEach(range => {
      const start = range.getRowIndex();
      const count = range.getNumRows();
      for (let i = 0; i < count; i += 1) {
        rows.push(start + i);
      }
    });
  autoAssignCategories(categoriesSheet, operations, rows);
};

global.handleForm = data => {
  return callbacks.handle(data.callbackId, data);
};
