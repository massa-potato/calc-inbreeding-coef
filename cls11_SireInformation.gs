/**
 * sire_Informationシート内のデータを扱うクラス
 */
class SireInformation {

  /**
   * sire_Informationシートのデータを取得する関数
   * @return {Object[][]} data - sire_Informationシート内のデータ一覧（二次元配列）
   */
  static readData() {
    const sheet = new Sheet(SHEET.SIRE_INFORMATION.NAME, SHEET.SIRE_INFORMATION.HEADER_ROWS);
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
    const data_ = SireInformation.readData();
    const data = data_.filter((record) => record[index] === value);
    return data;
  }

  /**
   * 種雄牛のIDから漢字名を返す関数
   * @param {Number} sireId - 種雄牛のID
   * @return {String} name - 種雄牛の漢字名（sireIdが見つからない場合は「-」を返す）
   */
  static fetchName(sireId) {
    const data = SireInformation.filterData(COLUMN.SIRE_INFORMATION.SIRE_ID.IDX, sireId).flat();
    if(!data.length) return '-'; // 見つからない場合は「-」を返す

    const name = data[COLUMN.SIRE_INFORMATION.NAME.IDX];
    return name;
  }

  /**
   * 種雄牛のIDから読み仮名を返す関数
   * @param {Number} sireId - 種雄牛のID
   * @return {String} phonetics - 種雄牛の読み仮名（sireIdが見つからない場合は「-」を返す）
   */
  static fetchPhonetics(sireId) {
    const data = SireInformation.filterData(COLUMN.SIRE_INFORMATION.SIRE_ID.IDX, sireId).flat();
    if(!data.length) return '-'; // 見つからない場合は「-」を返す

    const phonetics = data[COLUMN.SIRE_INFORMATION.PHONETICS.IDX];
    return phonetics;
  }

  /**
   * 種雄牛のIDから近交係数を返す関数
   * @param {Number} sireId - 種雄牛のID
   * @return {String} inbreedingCoef - 種雄牛の近郊係数（sireIdが見つからない場合・値が空欄の場合は0を返す）
   */
  static fetchInbreedingCoef(sireId) {
    const data = SireInformation.filterData(COLUMN.SIRE_INFORMATION.SIRE_ID.IDX, sireId).flat();
    if(!data.length) return 0; // 見つからない場合は0を返す

    const inbreedingCoef = data[COLUMN.SIRE_INFORMATION.INBREEDING_COEF.IDX];
    // [TODO] 近交係数のデータに空白が入らないようにして、こちらの処理を削除
    if(!inbreedingCoef) return 0; // 近交係数のデータが空白の場合は0を返す

    return inbreedingCoef;
  }

  /**
   * 種雄牛の漢字名からIDを返す関数（見つからない場合はエラー送出）
   * @param {String} name - 種雄牛の漢字名
   * @return {Number} sireId - 種雄牛のID
   */
  static fetchIdByName(name) {
    const data = SireInformation.filterData(COLUMN.SIRE_INFORMATION.NAME.IDX, name).flat();
    if(!data.length) throw new Error('nameに該当する情報がsire_Informationに存在しません。'); // 見つからない場合はエラー送出

    const sireId = data[COLUMN.SIRE_INFORMATION.SIRE_ID.IDX];
    return sireId;
  }

  /**
   * 種雄牛の読み仮名からIDを返す関数（見つからない場合はエラー送出）
   * @param {String} name - 種雄牛の漢字名（sireIdがnullだった場合は0を返す）
   * @return {Number} sireId - 種雄牛のID
   */
  static fetchIdByPhonetics(phonetics) {
    const data = SireInformation.filterData(COLUMN.SIRE_INFORMATION.PHONETICS.IDX, phonetics).flat();
    if(!data.length) throw new Error('phoneticsに該当する情報がsire_Informationに存在しません。'); // 見つからない場合はエラー送出

    const sireId = data[COLUMN.SIRE_INFORMATION.SIRE_ID.IDX];
    return sireId;
  }

}



/**
 * テストコード
 */
function test_SireInformationClass() {

  // sireIdから漢字名を取得
  const sireName = SireInformation.fetchName(1);
  // const sireName_error = Sire.fetchName(999);
  console.log(sireName);

  // sireIdから読み仮名を取得
  const sirePhonetics = SireInformation.fetchPhonetics(1);
  // const sirePhonetics_error = Sire.fetchPhonetics(999);
  console.log(sirePhonetics);

  // sireIdから近交係数を取得
  const sireInbreedingCoef = SireInformation.fetchInbreedingCoef(1);
  const sireInformationCoef_null = SireInformation.fetchInbreedingCoef(999);
  console.log(sireInbreedingCoef, sireInformationCoef_null);

  // 漢字名からsireIdを取得
  const sireId_1 = SireInformation.fetchIdByName('秋光重');
  console.log(sireId_1);

  // 読み仮名からsireIdを取得
  const sireId_2 = SireInformation.fetchIdByPhonetics('いずみまるET');
  console.log(sireId_2);

}