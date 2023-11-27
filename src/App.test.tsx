import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { Cell } from './spreadsheet/model/Cell';
// import { FormulaFunctions } from './spreadsheet/model/FormulaFunctions';

describe('tests for Cell', (): void => {

  // it('should set and get the value correctly', () => {
  //   const cell = new Cell();
  //   cell.setValue(42);
  //   expect(cell.getDisplayedValue()).toEqual(42);

  //   cell.setValue('Hello');
  //   expect(cell.getDisplayedValue()).toEqual('Hello');
  // });


  // it('should set and evaluate a formula correctly', () => {
  //   const cell = new Cell();

  //   // Set a formula
  //   cell.setFormula('SUM 2 3');
  //   expect(cell.getDisplayedValue()).toEqual(5);

  //   // Set another formula
  //   cell.setFormula('CONCAT "Hello" " World"');
  //   expect(cell.getDisplayedValue()).toEqual('Hello World');

  // });

  // it('should handle numeric checks correctly', () => {
  //   const cell = new Cell();

  //   expect(cell['isNumeric']('42')).toEqual(true);
  //   expect(cell['isNumeric']('3.14')).toEqual(true);
  //   expect(cell['isNumeric']('abc')).toEqual(false);
  // });
  
})