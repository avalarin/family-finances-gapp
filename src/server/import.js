class ImportApplication {
  constructor(callbacks, operations, accounts) {
    this.ui = SpreadsheetApp.getUi();
    this.operations = operations;
    this.accounts = accounts;
    this.uploadCallbackId = callbacks.register('handleImportUpload', this.upload.bind(this));
  }

  start() {
    const template = HtmlService.createTemplateFromFile('import.html');
    template.data = {
      uploadCallbackId: this.uploadCallbackId,
      accounts: this.accounts.getAccounts()
    };
    this.ui.showSidebar(template.evaluate());
  }

  upload(form) {
    const { account } = form;

    const lines = form.file.getDataAsString('windows-1251').split('\n');
    const operations = lines
      .slice(1) // skip header line
      .filter(line => line) // skip empty lines
      .map(line => line.split(';'))
      .map(item => ({
        date: item[3],
        account,
        description: item[5],
        category: 'Неизвестно',
        income: item[6],
        outcome: item[7],
        currency: item[2],
        exchRate: 1
      }));

    const result = this.operations.putOperations(operations);
    return { totalRows: lines.length, addedRows: result.added };
  }
}

export default ImportApplication;
