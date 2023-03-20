/*
雌雄牛IDと繁殖雌牛IDに対応した近交係数を計算します。

（処理手順の概要）
1. testFunction()関数（検証用の関数）
  ・sireId（種雄牛ID）、cowId（繁殖雌牛ID）を変数で指定
  ・cowIdを元にfetchCowData_()関数を呼び出して繁殖雌牛のデータを作成
  ・sireIdと繁殖雌牛のデータをもとに、calcInbreedingCoef_()関数を呼び出して近交係数を計算する

2. fetchCowData_(cowId)関数
  cowIdに対応する繁殖雌牛のデータをシートから取得する関数

3. calcInbreedingCoef_(sireId, cowData)関数
  近交係数の計算を行うための一連の処理を行う関数。
  ・makeFatherTree_()関数、makeMotherTree_()関数を呼び出し、父方・母方の血統ツリー配列をそれぞれ作成する
  ・calcInbreedingCoefFromTrees_()関数を呼び出し、近交係数を作成する
 
4. makeFatherTree_(sireId, n)関数
5. makeMotherTree_(cowData, n)関数
  それぞれ、父方・母方のn代目までの血統ツリーをそれぞれ作成するための関数。nはデフォルト値4。
  こんな感じのオブジェクトの配列を作る。
 　[ { '種雄牛ID': 35, 'n代目': 0, '直下子孫の種雄牛ID': 0 },
     { '種雄牛ID': 46, 'n代目': 1, '直下子孫の種雄牛ID': 35 },
     { '種雄牛ID': 42, 'n代目': 2, '直下子孫の種雄牛ID': 35 },
 　　　 …
   ]
 
6. calcInbreedingCoefFromTrees_(fatherTree, motherTree)関数
  父方と母方の血統ツリーから近交係数を実際に計算する関数
　・inbreedingCoef（近交係数） = 0 を定義
　・父親の血統ツリー配列、母親の血統ツリー配列を一つずつ見ていき、共通祖先の場合に計算を行い、inbreedingCoefに加算する
　・ただし、上位共通祖先に該当する場合は、計算を行わない
　・最終的な計算結果inbreedingCoefを返す
 
（備考）
  現状、近交係数が個体によってExcelの結果より大きく出たり、小さく出たりするようです。誤差の幅は未検証、原因はおそらく⬇︎

  ・小さく出る原因：
    ・Excelでは、データベースにない個体があってもあいまい検索でその上位祖先を取ってきているぽい？が、この関数では上位祖先はすべて無視する計算になっているため
  ・大きく出る原因：
    ・上位共通祖先を省ききれていないため（直系のものだけしか省いていない）
  ・Excelでは、近交係数の数値が大きい上位３祖先のみ最終的な計算結果に使っているぽいが、この関数では全ての近交係数を足し合わせているため
*/

const SI = new SireInformation();
const SG = new SireGenerations();

/**
 * 検証用の関数
 */
function testFunction() {
  sireId = 3;
  cowId = 4;
  
  const inbreedingCoef = INBREEDING_COEF(sireId, cowId);
  console.log(inbreedingCoef);
}

/**
 *　近交係数を計算する関数
 *
 * @param {number} sireId - 雌雄牛のID
 * @param {number} cowId - 繁殖雌牛のID
 * @customfunction
 */
function INBREEDING_COEF(sireId, cowId) {
  // ユーザー入力項目
  const numSireId = Number(sireId); // 種雄牛のIDを指定
  const numCowId = Number(cowId);   // 繁殖雌牛のIDを指定

  // 繁殖雌牛のデータ取得
  const cowData = fetchCowData(numCowId);

  // 近交係数の計算
  const inbreedingCoef = calcInbreedingCoef_(numSireId, cowData);

  return inbreedingCoef;

}

/**
 * 繁殖雌牛のn代祖情報の配列を返す関数
 *
 * @param {Number} cowId - 繁殖雌牛のID
 * @return {Object[]} cowData - 繁殖雌牛のn代祖情報　[母の1代祖ID, 母の2代祖ID, 母の3代祖ID, 母の4代祖ID]
*/
function fetchCowData(cowId) {

  // 繁殖雌牛情報をシートから取得
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('breeding_Cows');
  const cowsData = sheet.getDataRange().getValues();

  // 必要な配列を抽出　[母の1代祖ID, 母の2代祖ID, 母の3代祖ID, 母の4代祖ID]
  const cowData = cowsData[cowId].slice(2, 6);

  return cowData;
}


/**
 * 近交係数の計算を行うための一連の処理を行う関数。
 * 
 * @param {Number} sireId - 繁殖雌牛のID
 * @param {Object[]} cowData - 繁殖雌牛のn代祖情報
 */
function calcInbreedingCoef_(sireId, cowData) {

  // 父方・母方の血統配列を作成する
  let fatherTree = makeFatherTree_(sireId);
  let motherTree = makeMotherTree_(cowData);

  // // 近交係数を計算する
  let inbreedingCoef = calcInbreedingCoefFromTrees_(fatherTree, motherTree);

  console.log(`【計算結果】父 ${SI.fetchName(sireId)}（ID ${sireId}）と母(${cowData})の近交係数は、たぶんきっと${inbreedingCoef} %くらいです。`);

  return inbreedingCoef;
}

/**
 * 父方のn代目までの血統ツリー（配列）をそれぞれ作成するための関数。nはデフォルト値4。
 *   こんな感じのオブジェクトの配列を作る。
 * 　[ { '種雄牛ID': 35, 'n代目': 0, '直下子孫の種雄牛ID': 0 },
 *     { '種雄牛ID': 46, 'n代目': 1, '直下子孫の種雄牛ID': 35 },
 *     { '種雄牛ID': 42, 'n代目': 2, '直下子孫の種雄牛ID': 35 },
 * 　　　 …
 *   ]
 * 
 * @param {Number} sireId - 種雄牛ID
 * @param {Number} n - 何代祖までの血統ツリーを取得するか
 * 
 */
function makeFatherTree_(sireId, n=4) {

  // 血統ツリー配列
  const tree = [{
    '種雄牛ID': sireId,
    'n代目': 0,
    '直下子孫の種雄牛ID': 0
  }];
　
  /*
   （以降の処理の概要）
   n代までの先祖情報のオブジェクトが入った血統ツリー配列treeを作成する。
   外側のforループでtreeの中身をreafとして順番に取り出しながら、内側のforループでそのreafから生成される新たな先祖のオブジェクトを作成し、treeに新たに追加していく（追加された先祖に対してもループ処理が実行される）
   treeの配列長さが2^n以上になる（＝n代目までの血統ツリー配列が完成する）とループを終了して、ソート・フィルターで整えた血統ツリー配列を返す。
  */
  for(const reaf of tree) {

    let gen = reaf['n代目'] + 1; // genはn代目の先祖を表すためのカウント変数
    if(gen > n) continue;       // genがn代目を超えている場合は次のreafへ

    // treeに先祖を追加していく
    for(let i = 1; i <= n; i++){
      const sire = SG.fetchSire(reaf['種雄牛ID'], i);
      const newReaf = {
        '種雄牛ID': sire,
        'n代目': gen,
        '直下子孫の種雄牛ID': reaf['種雄牛ID']
      };
      tree.push(newReaf);

      // treeの配列長さが2^n以上になるとループを終了して、ソート・フィルターで整えた血統ツリー配列を返す
      if(tree.length >= 2**n) {

        // treeの中身をn代目の値でソートする（ログ出力用）
        tree.sort((a, b) => a['n代目'] - b['n代目']);

        // ログ確認
        console.log('父方の血統ツリーを表す配列');
        console.log(tree);

        // treeの中身を種雄牛IDの値でソートする
        tree.sort((a, b) => a['種雄牛ID'] - b['種雄牛ID']);

        // idが0の列は計算に影響しないので、血統ツリー配列から取り除く
        const retTree = tree.filter(reaf => reaf['種雄牛ID'] !== 0)
        return retTree;
      };

      gen++;
      if(gen > n) break; // n代目を超えている場合は次のreafへ
    }
  }
}


/**
 * 母方のn代目までの血統ツリー（配列）をそれぞれ作成するための関数。nはデフォルト値4。
 *   こんな感じのオブジェクトの配列を作る。
 * 　[ { '種雄牛ID': 0, 'n代目': 0, '直下子孫の種雄牛ID': 0 },
 *     { '種雄牛ID': 46, 'n代目': 1, '直下子孫の種雄牛ID': 35 },
 *     { '種雄牛ID': 42, 'n代目': 2, '直下子孫の種雄牛ID': 35 },
 * 　　　 …
 *   ]
 * 
 * @param {Number} cowData - 繁殖雌牛情報
 * @param {Number} n - 何代祖までの血統ツリーを取得するか
 */
function makeMotherTree_(cowData, n=4) {

  // 血統ツリー配列
  const tree = [{
    '種雄牛ID': 0,
    'n代目': 0,
    '直下子孫の種雄牛ID': 0
  }];
　
  /*
   （以降の処理の概要）
   n代までの先祖情報のオブジェクトが入った血統ツリー配列treeを作成する。
   外側のforループでtreeの中身をreafとして順番に取り出しながら、内側のforループでそのreafから生成される新たな先祖のオブジェクトを作成し、treeに新たに追加していく（追加された先祖に対してもループ処理が実行される）
   treeの配列長さが2^n以上になる（＝n代目までの血統ツリー配列が完成する）とループを終了して、ソート・フィルターで整えた最終的な血統ツリー配列を返す。
  */
  for(const reaf of tree) {

    let gen = reaf['n代目'] + 1; // genはn代目の先祖を表すためのカウント変数
    if(gen > n) continue;       // n代目を超えている場合は次のreafへ

    // treeに先祖を追加していく
    for(let i = 1; i <= n; i++){
      let newReaf = [];
      if(reaf['n代目'] === 0) {
        newReaf = {
          '種雄牛ID': cowData[i - 1],
          'n代目': gen,
          '直下子孫の種雄牛ID': 0
        };
      } else {
        const sire = SG.fetchSire(reaf['種雄牛ID'], i);
        newReaf = {
          '種雄牛ID': sire,
          'n代目': gen,
          '直下子孫の種雄牛ID': reaf['種雄牛ID']
        };
      }
      tree.push(newReaf);

      // treeの配列長さが2^n以上になるとループを終了して、ソート・フィルターで整えた血統ツリー配列を返す
      if(tree.length >= 2**n) {

        // treeの中身をn代目の値でソートする（ログ出力用）
        tree.sort((a, b) => a['n代目'] - b['n代目']);

        // ログ確認
        console.log('母方の血統ツリーを表す配列');
        console.log(tree);

        // treeの中身を種雄牛IDの値でソートする
        tree.sort((a, b) => a['種雄牛ID'] - b['種雄牛ID']);

        // idが0の列は計算に影響しないので、血統ツリー配列から取り除く
        const retTree = tree.filter(reaf => reaf['種雄牛ID'] !== 0)
        return retTree;
      };
      
      gen++;
      if(gen > n) break; // n代目を超えている場合は次のreafへ
    }
  }
}


/**
 * 父方と母方の血統ツリーから近交係数を実際に計算する関数
 * 
 * @param {Object[][]} fatherTree - 種雌牛の血統ツリー
 * @param {Object[][]} motherTree - 繁殖雌牛の血統ツリー
 */
function calcInbreedingCoefFromTrees_(fatherTree, motherTree) {

  let inbreedingCoef = 0;

  // 外側のループで父親の血統配列を順番に取り出し、内側のループで母親の血統配列を順番に取り出す
  for(const fatherReaf of fatherTree) {
    for(const motherReaf of motherTree) {

      // 共通祖先のチェック
      if(motherReaf['種雄牛ID'] === fatherReaf['種雄牛ID']) {

        // 上位共通祖先のチェック
        if(motherReaf['直下子孫の種雄牛ID'] === fatherReaf['直下子孫の種雄牛ID'] && motherReaf['直下子孫の種雄牛ID'] !== 0) {

          // 上位共通祖先の場合は近交係数を計算しない
          console.log(`上位共通祖先が見つかったので省きます。父方の ${fatherReaf['種雄牛ID']}（n=${fatherReaf['n代目']}, 直下の子孫の種雄牛:${fatherReaf['直下子孫の種雄牛ID']}）と母方の ${motherReaf['種雄牛ID']}（n'=${motherReaf['n代目']}, 直下の子孫の種雄牛:${motherReaf['直下子孫の種雄牛ID']}）`);
          continue;
        }
        // 共通祖先の場合は近交係数を計算する
        const coef = SI.fetchInbreedingCoef(fatherReaf['種雄牛ID']);
        if(!coef) continue; // 近郊係数が0の時は計算しない

        // 近交係数の計算
        const exp = motherReaf['n代目'] + fatherReaf['n代目'] + 1; // 指数部分
        inbreedingCoef += (0.5 ** exp) * (100 + coef); // 近交係数の計算式

        console.log(`父方の ${fatherReaf['種雄牛ID']}（n=${fatherReaf['n代目']}, 直下の子孫の種雄牛:${fatherReaf['直下子孫の種雄牛ID']}）と母方の  ${motherReaf['種雄牛ID']}（n'=${motherReaf['n代目']}, 直下の子孫の種雄牛:${motherReaf['直下子孫の種雄牛ID']}）が共通祖先で、その近交係数は${coef}、指数n+n'+1は${exp}です。ここまでの累積の近交係数は${inbreedingCoef}です。`);
      }
    }
  }

  // 近交係数を小数点以下3位で四捨五入
  inbreedingCoef = Math.round(inbreedingCoef * 100) / 100;

  return inbreedingCoef;
}