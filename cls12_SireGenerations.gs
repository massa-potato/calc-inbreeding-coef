/**
 * sire_Generationsシート内のデータを扱うクラス
 */
class SireGenerations {
  constructor() {
    this.data = this.readDataFromSpreadsheet();
  }

  readDataFromSpreadsheet() {
    const sheet = new Sheet(SHEET.SIRE_GENERATIONS.NAME, SHEET.SIRE_GENERATIONS.HEADER_ROWS);
    const data = sheet.readData();
    return data;
  }

  /**
   * 種雄牛のIDからすべての血統情報の入った二次元配列を返す関数（見つからない場合はエラー送出）
   * @params {Number} sireId - 情報が欲しい種雄牛のID
   * @return {Object[][]} pedigreeArr - 種雄牛の血統情報の入った二次元配列
   */
  fetchPedigree(sireId) {
    const pedigreeArr = this.data.filter(arr => arr[COLUMN.SIRE_INFORMATION.SIRE_ID.IDX] === sireId);
    // if(!pedigreeArr.length) throw new Error('sireIdに該当する情報がsire_Generationsに存在しません。'); // 見つからない場合はエラー送出

    //[ [ 1, 1, 74, 'あきさくら', 'つるみつしげ' ],
    // [ 1, 2, 100, 'あきさくら', 'ひさみつしげ' ],
    // [ 1, 3, '#N/A', 'あきさくら', 'みつひめまる' ],
    // [ 1, 4, 46, 'あきさくら', 'だい4みつしげ' ] ]

    // nGen(何代祖か)を表す数字でのソート
    pedigreeArr.sort((a, b) => a[1] - b[1]);

    return pedigreeArr;
  }

  /**
   * 種雄牛のIDに対してn代祖のIDを返す関数（見つからない場合はエラー送出）
   * @params {Number} sireId - 情報が欲しい種雄牛のID
   * @params {Number} n - 何代祖の情報が欲しいのか
   * @return {Number} nGenSireId - n代祖となる種雄牛のID
   */
 fetchSire(sireId, n) {
    const pedigreeArr = this.fetchPedigree(sireId);
    const record = pedigreeArr.find(arr => arr[COLUMN.SIRE_GENERATIONS.N_GENERATION.IDX] === n);

    if(!record) return 0; // 見つからない場合は0を返す
    // if(!data.length) throw new Error('sireId, nに該当する情報がsire_Generationsに存在しません。'); // 見つからない場合はエラー送出

    const nGensireId = record[COLUMN.SIRE_GENERATIONS.N_GEN_SIRE_ID.IDX];
    return nGensireId;
  }

}


/**
 * テストコード
 */
function test_SireGenerationsClass() {

  const sg = new SireGenerations();

  const pedigreeArr = sg.fetchPedigree(1);
  // const pedigree_error = SireGenerations.fetchPedigree(999);
  console.log(pedigreeArr);

  const nGenSireId = sg.fetchSire(1, 1);
  console.log(nGenSireId);
}

// function test_sortPedigreeArr() {
//     const pedigreeArray = [
//       [ 1, 2, 100, 'あきさくら', 'ひさみつしげ' ],
//       [ 1, 1, 74, 'あきさくら', 'つるみつしげ' ],
//       [ 1, 4, 46, 'あきさくら', 'だい4みつしげ' ],
//       [ 1, 3, '#N/A', 'あきさくら', 'みつひめまる' ],
//     ]

//     // nGen(何代祖か)を表す数字でのソート
//     pedigreeArray.sort((a, b) => a[1] - b[1]);

//     console.log(pedigreeArray);
// }