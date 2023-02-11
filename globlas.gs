/**
 * プロジェクトの情報
 * - GitHub　https://github.com/massa-potato/calc-inbreeding-coef
 * - SpreadSheet https://docs.google.com/spreadsheets/d/1EXNi_mAT6rl11lQGpNyI94AQ6__qzsYCqoynnOjXpQc/edit#gid=9448637
 * 
 * [TODO]
 * - [ ] SireInformationの近交係数のデータに空白が入らないようにしたい（デフォルト値0）
 */


/**
 * シートに関する情報
 */
const SHEET = Object.freeze({
  SIRE_INFORMATION: {NAME: 'sire_Information', HEADER_ROWS: 1}, // 種雄牛情報を格納するシート
  SIRE_GENERATIONS:  {NAME: 'sire_Generations', HEADER_ROWS: 1} // 種雄牛のn代祖を格納するシート
});

/**
 * 各シートのカラムに関する情報
 */
const COLUMN = Object.freeze({
  SIRE_INFORMATION: {
    SIRE_ID:        {COL: 1, IDX: 0, NAME: 'sire_ID'},        // A列 種雄牛ID
    NAME:           {COL: 2, IDX: 1, NAME: 'name'},           // B列 漢字名
    PHONETICS:      {COL: 3, IDX: 2, NAME: 'phonetics'},      // C列 読み仮名
    INBREEDING_COEF:{COL: 4, IDX: 3, NAME: 'inbreeding_Coef'},// D列 近交係数
    CODE:           {COL: 5, IDX: 4, NAME: 'code'},           // E列 略号
    TEN_DIGITS:     {COL: 6, IDX: 5, NAME: 'tenDigits'},      // F列 10桁番号
    NOTE:           {COL: 7, IDX: 6, NAME: 'note'}            // G列 備考
  },
  SIRE_GENERATIONS: {
    SIRE_ID:        {COL: 1, IDX: 0, NAME: 'sire_ID'},        // A列 種雄牛ID
    N_GENERATION:   {COL: 2, IDX: 1, NAME: 'n_Generation'},   // B列 n代祖
    N_GEN_SIRE_ID:  {COL: 3, IDX: 2, NAME: 'n_gen_sire_ID'}   // C列 n代祖の種雄牛ID（外部キー）
  }
});