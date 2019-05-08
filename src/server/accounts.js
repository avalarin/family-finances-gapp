class Accounts {
  constructor(sheet) {
    this.sheet = sheet;
  }

  getAccounts() {
    return this.sheet
      .getDataRange()
      .getValues()
      .slice(1) // skip header line
      .filter(row => row[0]) // skip empty lines
      .map(row => ({
        name: row[0]
      }));
  }
}

export default Accounts;
