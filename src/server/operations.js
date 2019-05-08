class Operations {
  constructor(sheet) {
    this.sheet = sheet;
    this.rowToInsert = 2;
  }

  putOperations(operations) {
    const skipped = 0;
    const added = operations.length;

    this.sheet.insertRowsBefore(this.rowToInsert, operations.length);
    this.sheet
      .getRange(this.rowToInsert, 1, operations.length, 8)
      .setValues(
        operations.map(operation => [
          operation.date,
          operation.account,
          operation.description,
          operation.category,
          operation.income,
          operation.outcome,
          operation.currency,
          operation.exchRate
        ])
      );

    return {
      skipped,
      added
    };
  }

  getOperaions() {
    return this.sheet
      .getDataRange()
      .getValues()
      .map(row => ({
        date: row[0],
        account: row[1],
        description: row[2],
        category: row[3],
        income: row[4],
        outcome: row[5],
        currency: row[6],
        exchRate: row[7]
      }));
  }
}

export default Operations;
