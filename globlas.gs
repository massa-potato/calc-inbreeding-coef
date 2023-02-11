/**
 * プロジェクトの情報
 * - GitHub　https://github.com/massa-potato/calc-inbreeding-coef
 * - SpreadSheet https://docs.google.com/spreadsheets/d/1EXNi_mAT6rl11lQGpNyI94AQ6__qzsYCqoynnOjXpQc/edit#gid=9448637
 * 
 * [TODO]
 * - [x] Sheetクラスをなくしてひとつにまとめる 
 * - [ ] 毎回シートからデータをとってきてるので、関数呼び出しが遅い。改善できないか？
 * - [ ] ペアプロ用シートへ移行
 * - [ ] SireInformationの近交係数のデータに空白が入らないようにしたい（デフォルト値0）
 */


/**
 * シートに関する情報
 */
const SHEET = Object.freeze({
  SIRE_INFORMATION: {NAME: 'sire_Information', HEADER_ROWS: 1},
  SIRE_GENERATIONS:  {NAME: 'sire_Generations', HEADER_ROWS: 1}
});

/**
 * 各シートのカラムに関する情報
 */
const COLUMN = Object.freeze({
  SIRE_INFORMATION: {
    SIRE_ID:        {COL: 'A', NO: 1, IDX: 0, NAME: 'sire_ID'},
    NAME:           {COL: 'B', NO: 2, IDX: 1, NAME: 'name'},      // 漢字名
    PHONETICS:      {COL: 'C', NO: 3, IDX: 2, NAME: 'phonetics'}, // 読み仮名
    INBREEDING_COEF:{COL: 'D', NO: 4, IDX: 3, NAME: 'inbreeding_Coef'}, // 近交係数
    CODE:           {COL: 'E', NO: 5, IDX: 4, NAME: 'code'},
    TEN_DIGITS:     {COL: 'F', NO: 6, IDX: 5, NAME: 'tenDigits'},
    NOTE:           {FOL: 'G', NO: 7, IDX: 6, NAME: 'note'}
  },
  SIRE_GENERATIONS: {
    SIRE_ID:        {COL: 'A', NO: 1, IDX: 0, NAME: 'sire_ID'},
    N_GENERATION:   {COL: 'B', NO: 2, IDX: 1, NAME: 'n_Generation'},
    N_GEN_SIRE_ID:  {COL: 'C', NO: 3, IDX: 2, NAME: 'n_gen_sire_ID'}
  }
});