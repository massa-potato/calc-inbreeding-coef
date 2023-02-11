/**
 * シートを扱うためのクラス
 */
class Sheet {

  /**
   * シートを扱うクラスのコンストラクタ
   * @param {String} name - シート名
   * @param {Number} headerRows - ヘッダー行数（デフォルト値1）
   */
  constructor(name, headerRows=1) {
    this.sheetName = name;
    this.headerRows = headerRows;
  }

  /**
   * シートオブジェクトを取得するメソッド
   * @return {Object} sheet - シートオブジェクト
   */
  getSheet() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(this.sheetName);
    return sheet; 
  }

  /**
   * シート内のヘッダー行以下のデータを二次元配列で取得するメソッド
   * @return {Object[][]} data - シート内のデータ
   */
  readData() {
    const sheet = this.getSheet();
    const range = sheet.getDataRange();
    const data_ = range.getValues();
    const data = data_.slice(this.headerRows);
    return data;
  }

}


/**
 * テストコード
 */
function test_SheetClass() {

  // コンストラクタ
  const infoSheet = new Sheet(SHEET.SIRE_INFORMATION.NAME, SHEET.SIRE_INFORMATION.HEADER_ROWS);
  console.log('sheetName: ', infoSheet.sheetName);
  console.log('headerRows: ', infoSheet.headerRows);  

  const genSheet = new Sheet(SHEET.SIRE_GENERATIONS.NAME); // 第二引数なしも可
  console.log('sheetName: ', genSheet.sheetName);
  console.log('headerRows: ', genSheet.headerRows); 

  // シート名の取得
  const sheet = infoSheet.getSheet();
  console.log(sheet.getName());

  // シート内のデータ取得
  const data = infoSheet.readData();
  console.log(data);

}