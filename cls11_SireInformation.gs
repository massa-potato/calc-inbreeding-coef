/**
 * sire_Informationシート内のデータを扱うクラス
 */
class SireInformation {
  constructor() {
    this.data = this.readDataFromSpreadsheet();
  }

  readDataFromSpreadsheet() {
    const sheet = new Sheet(SHEET.SIRE_INFORMATION.NAME, SHEET.SIRE_INFORMATION.HEADER_ROWS);
    const data = sheet.readData();
    return data;
  }

  /**
   * 種雄牛のIDから漢字名を返す関数
   * @param {Number} sireId - 種雄牛のID
   * @return {String} name - 種雄牛の漢字名（sireIdが見つからない場合は「-」を返す）
   */
  fetchName(sireId) {
    const record = this.data.find(arr => arr[COLUMN.SIRE_INFORMATION.SIRE_ID.IDX] === sireId);
    if(!record) return '-'; ; // 見つからない場合は「-」を返す
    const name = record[COLUMN.SIRE_INFORMATION.NAME.IDX];
    return name;
  }

  /**
   * 種雄牛のIDから読み仮名を返す関数
   * @param {Number} sireId - 種雄牛のID
   * @return {String} phonetics - 種雄牛の読み仮名（sireIdが見つからない場合は「-」を返す）
   */
  fetchPhonetics(sireId) {
    const record = this.data.find(arr => arr[COLUMN.SIRE_INFORMATION.SIRE_ID.IDX] === sireId);
    if(!record) return '-'; ; // 見つからない場合は「-」を返す
    const phonetics = record[COLUMN.SIRE_INFORMATION.PHONETICS.IDX];
    return phonetics;
  }

  /**
   * 種雄牛のIDから近交係数を返す関数
   * @param {Number} sireId - 種雄牛のID
   * @return {String} inbreedingCoef - 種雄牛の近郊係数（sireIdが見つからない場合・値が空欄の場合は0を返す）
   */
  fetchInbreedingCoef(sireId) {
    const record = this.data.find(arr => arr[COLUMN.SIRE_INFORMATION.SIRE_ID.IDX] === sireId);
    if(!record) return 0; // 見つからない場合は0を返す
    const inbreedingCoef = record[COLUMN.SIRE_INFORMATION.INBREEDING_COEF.IDX];
    // [TODO] 近交係数のデータに空白が入らないようにして、こちらの処理を削除
    if(!inbreedingCoef) return 0; // 近交係数のデータが空白の場合は0を返す

    return inbreedingCoef;
  }

  /**
   * 種雄牛の漢字名からIDを返す関数（見つからない場合はエラー送出）
   * @param {String} name - 種雄牛の漢字名
   * @return {Number} sireId - 種雄牛のID
   */
  fetchIdByName(name) {
    const record = this.data.find(arr => arr[COLUMN.SIRE_INFORMATION.NAME.IDX] === name);
    if(!record) throw new Error('nameに該当する情報がsire_Informationに存在しません。'); // 見つからない場合はエラー送出

    const sireId = record[COLUMN.SIRE_INFORMATION.SIRE_ID.IDX];
    return sireId;
  }

  /**
   * 種雄牛の読み仮名からIDを返す関数（見つからない場合はエラー送出）
   * @param {String} name - 種雄牛の漢字名（sireIdがnullだった場合は0を返す）
   * @return {Number} sireId - 種雄牛のID
   */
  fetchIdByPhonetics(phonetics) {
    const record = this.data.find(arr => arr[COLUMN.SIRE_INFORMATION.PHONETICS.IDX] === phonetics);
    if(!record) throw new Error('phoneticsに該当する情報がsire_Informationに存在しません。'); // 見つからない場合はエラー送出

    const sireId = record[COLUMN.SIRE_INFORMATION.SIRE_ID.IDX];
    return sireId;
  }

}



/**
 * テストコード
 */
function test_SireInformationClass() {

  const si = new SireInformation();

  // sireIdから漢字名を取得
  const sireName = si.fetchName(1);
  // const sireName_error = Sire.fetchName(999);
  console.log(sireName);

  // sireIdから読み仮名を取得
  const sirePhonetics = si.fetchPhonetics(1);
  // const sirePhonetics_error = Sire.fetchPhonetics(999);
  console.log(sirePhonetics);

  // sireIdから近交係数を取得
  const sireInbreedingCoef = si.fetchInbreedingCoef(1);
  const sireInformationCoef_null = si.fetchInbreedingCoef(999);
  console.log(sireInbreedingCoef);
  console.log(sireInformationCoef_null);

  // 漢字名からsireIdを取得
  const sireId_1 = si.fetchIdByName('秋光重');
  console.log(sireId_1);

  // 読み仮名からsireIdを取得
  const sireId_2 = si.fetchIdByPhonetics('いずみまるET');
  console.log(sireId_2);

}