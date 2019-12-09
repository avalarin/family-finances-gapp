class Pattern {
  constructor(data) {
    this.pattern = data.pattern;
    this.operationType = data.operationType;
    this.category = data.category;
  }

  matches(operation) {
    if (
      this.operationType !== 'Любой' &&
      ((this.operationType === 'Доход' && operation.income === 0) ||
        (this.operationType === 'Расход' && operation.outcome === 0))
    ) {
      return false;
    }

    return operation.description.indexOf(this.pattern) !== -1;
  }
}

class CategoryPatterns {
  constructor(sheet) {
    this.sheet = sheet;
    this.patterns = sheet
      .getDataRange()
      .getValues()
      .slice(1)
      .map(
        row =>
          new Pattern({
            pattern: row[0],
            operationType: row[1],
            category: row[2]
          })
      );
  }

  findCategory(operation) {
    return this.patterns.filter(p => p.matches(operation)).map(p => p.category)[0];
  }
}

function autoAssignCategories(categoriesSheet, operations, rows) {
  const patterns = new CategoryPatterns(categoriesSheet);

  const updatedRows = rows.map(rowNum => {
    const operation = operations.getOperationByRow(rowNum);
    const category = patterns.findCategory(operation) || operation.category;
    return { rowNum, operation: { ...operation, category } };
  });

  operations.updateUperationsBatch(updatedRows);
}

export default autoAssignCategories;
