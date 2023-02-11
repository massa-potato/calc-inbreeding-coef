/**
 * sire_Generationsシート内のデータを扱うクラス
 */
class SireGenerations {

  /**
   * sire_Generationsシートのデータを取得する関数
   * @return {Object[][]} data - sire_Generationsシート内のデータ一覧（二次元配列）
   */
  static readData() {
    const sheet = new Sheet(SHEET.SIRE_GENERATIONS.NAME, SHEET.SIRE_GENERATIONS.HEADER_ROWS);
    const data = sheet.readData();
    // [TODO] データがない時にエラー送出
    return data;
  }

  /**
   * 二次元配列から必要なデータ行のみをフィルタして抽出する関数
   * @param {Number} index - 抽出したい列のインデックス
   * @param {String} value - 抽出したい値
   * @return {Object[][]} data - 抽出結果（二次元配列もしくは空の配列）
   */
  static filterData(index, value) {
    const data_ = SireGenerations.readData();
    const data = data_.filter((record) => record[index] === value);
    return data;
  }

  /**
   * 種雄牛のIDからすべての血統情報の入った二次元配列を返す関数（見つからない場合はエラー送出）
   * @params {Number} sireId - 情報が欲しい種雄牛のID
   * @return {Object[][]} pedigreeArr - 種雄牛の血統情報の入った二次元配列
   */
  static fetchPedigree(sireId) {
    const pedigreeArr = SireGenerations.filterData(COLUMN.SIRE_INFORMATION.SIRE_ID.IDX, sireId);
    if(!pedigreeArr.length) throw new Error('sireIdに該当する情報がsire_Generationsに存在しません。'); // 見つからない場合はエラー送出

    return pedigreeArr;
  }

  /**
   * 種雄牛のIDに対してn代祖のIDを返す関数（見つからない場合はエラー送出）
   * @params {Number} sireId - 情報が欲しい種雄牛のID
   * @params {Number} n - 何代祖の情報が欲しいのか
   * @return {Number} nGenSireId - n代祖となる種雄牛のID
   */
  static fetchSire(sireId, n) {
    const pedigreeArr = SireGenerations.fetchPedigree(sireId);
    const data = pedigreeArr.filter((record) => record[COLUMN.SIRE_GENERATIONS.N_GENERATION.IDX] === n).flat();
    if(!data.length) throw new Error('sireId, nに該当する情報がsire_Generationsに存在しません。'); // 見つからない場合はエラー送出

    const nGensireId = data[COLUMN.SIRE_GENERATIONS.N_GEN_SIRE_ID.IDX];
    return nGensireId;
  }

}


/**
 * テストコード
 */
function test_SireGenerationsClass() {

  const pedigreeArr = SireGenerations.fetchPedigree(1);
  // const pedigree_error = SireGenerations.fetchPedigree(999);
  console.log(pedigreeArr);

  const nGensireId = SireGenerations.fetchSire(1, 1);
  console.log(nGensireId);
}