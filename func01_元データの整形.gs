/**
 * 20230131 ペアプロ
 * 「元データ」シートのデータから、「sire_Generations」シートに書き込むための二次元配列を作成する関数（テーブル整形用）
 *
 * @return {Object[][]} - sire_idに基づく種雄牛のn代祖の情報が入った二次元配列
 *
 * （参考）
 * [
 *  [ 'あきさくら', '秋桜', 6.85, 'つるみつしげ', '鶴光重', 'ひさみつしげ', '久光重', 'みつひめまる', '光姫丸', 'だい4みつしげ', '第四光重'],
 *      … 
 * ]
 * 
 *  ⬇︎
 * 
 * [
 *  [あきさくら, 1, つるみつしげ] , [あきさくら, 2, ひさみつしげ], [あきさくら, 3, みつひめまる], [あきさくら, 4, だい4みつしげ],
 *      …
 * ]
 */
function getPedigreeArray() {

  // 「元データ」シートのデータを二次元配列で取得
  const originSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('元データ');
  const originData_ = originSheet.getDataRange().getValues();

  // oroginDataから必要な要素のみ抽出
  const originData = originData_.map(record => [record[0], record[3], record[5], record[7], record[9]]);
  originData.shift();//headerの削除

  // 「sire_Generations」シートに書き込むための二次元配列retArrを作成
  const retArr = [];
  for(const data of originData) {
    for(const [index, value] of data.entries()) {
      if(index != 0) {
        const arr = [];
        arr[0] = data[0];
        arr[1] = index;
        arr[2] = value;
        // console.log(arr);
        retArr.push(arr);
      }
    }
  }

  // console.log(retArr);
  return retArr;
}

/**
 * 「sire_Generations」シートにデータを書き込む関数
 */
function writePedigree(){

  // 「sire_Generations」シートを取得
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('sire_Generations');

  // 書き込むためのデータを作成
  const pedigreeArray = getPedigreeArray();

  // 「sire_Generations」シートにデータを書き込む
  sheet.getRange(2, 1, pedigreeArray.length, pedigreeArray[0].length).setValues(pedigreeArray);
}