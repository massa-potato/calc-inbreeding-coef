function getPedigreeArray() {

  // 「元データ」シートのデータ（originData）を取得
  const originSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('元データ');
  const originData_ = originSheet.getDataRange().getValues();

  const originData = originData_.map(record => [record[0], record[3], record[5], record[7], record[9]]);
  originData.shift();//headerの削除


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

function writePedigree(){

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('sire_Pedigree');

  const pedigreeArray = getPedigreeArray();

  sheet.getRange(2, 1, pedigreeArray.length, pedigreeArray[0].length).setValues(pedigreeArray);
}