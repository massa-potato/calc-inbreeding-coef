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

  /**
   * シート内のデータから、必要なデータ行のみをフィルタして抽出するメソッド
   * @param {Number} col - 抽出したい列番号
   * @param {String} value - 抽出したい値
   * @return {Object[][]} data - 抽出結果（二次元配列もしくは空の配列）
   */
  filterData(col, value) {
    const data_ = this.readData();
    const data = data_.filter((record) => record[col - 1] === value);
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

  // シート内のデータからidが3のデータを抽出
  const filterdData = infoSheet.filterData(1, 3)
  console.log(filterdData);


}