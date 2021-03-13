import levenshtein from "js-levenshtein";
import mysql from "mysql";

// ***** DATA ANALYZE *****

/**
 * Test if a variable is a string
 * @param {*} v
 * @returns {boolean}
 */
export const isString = (v) => typeof v === "string" || v instanceof String;

/**
 * Test if a variable is a number
 * @param {*} v
 * @returns {boolean}
 */
export const isNumber = (v) => typeof v === "number" || v instanceof Number;

/**
 * Returns values that appear more than once in the list
 * @param {any[]} values
 * @returns {any[]} duplicates values
 */
export function getDuplicates(values) {
  return [
    ...new Set(
      values.filter((value, i) =>
        values
          .slice(i + 1)
          .find(
            (other) => other === value || new RegExp(`^${String(value)}$`, "i").test(String(other))
          )
      )
    ),
  ];
}

/**
 * Returns all groups of values that have a distance less than a given one
 * @param {string[]} values The list of values
 * @param {number} maxDistance The maximum distance
 * @returns {string[][]}
 */
export function getTooCloseValues(values, maxDistance) {
  values = values.map((value) => (isString(value) ? value.toLowerCase() : value));
  const groups = [];

  values.forEach((value) => {
    if (!isString(value)) {
      return;
    }
    const group = values.filter((other) => {
      if (!isString(other)) {
        return;
      }
      const distance = levenshtein(other, value);
      return distance <= maxDistance && distance > 0;
    });

    const existingGroup = groups.find((egroup) => egroup.some((e) => group.includes(e)));
    if (existingGroup) {
      existingGroup.push(...group, value);
      return;
    }

    if (group.length > 0) {
      groups.push([...group, value]);
    }
  });

  return groups.map((group) => [...new Set(group)]);
}

/**
 * Filter values to keep too long ones
 * @param {any[]} values The list of values
 * @returns {any[]} The too long values
 */
export function getTooLongValues(values, maxLength) {
  return values.filter((value) => isString(value) && value.length > maxLength);
}

// ***** DATABASE IMPORT *****

/**
 * Create an sql insertion command (curryfied)
 * @param {string} table The table name
 * @returns {function(...string):function(...string):string}
 */
export function createSqlToInsertInto(table) {
  let sql = `INSERT INTO ${table} `;
  return function columns(...columns) {
    if (columns.length > 0) {
      sql += `(${columns.join(", ")}) `;
    }
    return function values(...values) {
      return sql + `VALUES (${values.map(mysql.escape).join(", ")});\n`;
    };
  };
}

export class AnalyzerWarning {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }
}

/**
 * Create the sql script to begin a transaction
 * @returns {string}
 */
export function transationBeginSql() {
  return "START TRANSACTION; SET AUTOCOMMIT=0; ";
}

/**
 * Create the sql script to complete a transaction
 * @returns {string}
 */
export function transationEndSql() {
  return "COMMIT; SET AUTOCOMMIT=1; ";
}

/**
 * Create the sql script to clear the given tables
 * @returns
 */
export function clearDatabaseTablesSql(...tables) {
  return (
    "SET FOREIGN_KEY_CHECKS = 0; " +
    tables.reduce((script, table) => script + `DELETE FROM ${table}; `, "") +
    "SET FOREIGN_KEY_CHECKS = 1; "
  );
}
