const columns = [
  {
    column: 1,
    getter: op => op.date
  },
  {
    column: 2,
    getter: op => op.account
  },
  {
    column: 3,
    getter: op => op.description
  },
  {
    column: 4,
    getter: op => op.category
  },
  {
    column: 5,
    getter: op => op.income
  },
  {
    column: 6,
    getter: op => op.outcome
  },
  {
    column: 7,
    getter: op => op.currency
  },
  {
    column: 8,
    getter: op => op.exchRate
  },
  {
    column: 9,
    getter: op => op.total
  },
  {
    column: 10,
    getter: op => op.addedAt
  }
];

function mapRow(row) {
  return {
    date: row[0],
    account: row[1],
    description: row[2],
    category: row[3],
    income: row[4],
    outcome: row[5],
    currency: row[6],
    exchRate: row[7]
  };
}

function mapOperationToRow(operation) {
  return [
    operation.date,
    operation.account,
    operation.description,
    operation.category,
    operation.income,
    operation.outcome,
    operation.currency,
    operation.exchRate
  ];
}

class Operations {
  constructor(sheet) {
    this.sheet = sheet;
    this.rowToInsert = 2;
  }

  updateOperationByRow(row, operation) {
    columns.forEach(column => {
      if (column.getter(operation)) {
        const range = this.sheet.getRange(row, column.column);
        range.setValue(column.getter(operation));
        range.activate();
      }
    });
  }

  updateUperationsBatch(rows) {
    rows.forEach(r => {
      this.sheet
        .getRange(r.rowNum, 1, 1, 8)
        .setValues([mapOperationToRow(r.operation)])
        .activate();
    });
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

  getOperationByRow(rowIndex) {
    const row = this.sheet.getRange(rowIndex, 1, 1, 10).getValues()[0];
    return mapRow(row);
  }

  getOperaions() {
    return this.sheet
      .getDataRange()
      .getValues()
      .map(row => mapRow(row));
  }
}

export default Operations;
