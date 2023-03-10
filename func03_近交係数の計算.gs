/*
 使用可能な関数

 - SireInformationクラス
   - fetchName(sireId): 種雄牛のIDから漢字名を返す関数（見つからない場合は「-」を返す）
   - fetchPhonetics(sireId): 種雄牛のIDから読み仮名を返す関数（見つからない場合は「-」を返す）
   - fetchInbreedingCoef(sireId): 種雄牛のIDから近交係数を返す関数（見つからない場合&近交係数の値が空欄のときは0を返す）
   - fetchIdByName(name): 種雄牛の漢字名からIDを返す関数
   - fetchIdByPhonetics(phonetics): 種雄牛の読み仮名からIDを返す関数

 - SireGenerationsクラス
   - fetchPedigree(sireId): 種雄牛のIDからすべての血統情報の入った二次元配列を返す関数
   - fetchSire(sireId, n): 種雄牛のIDに対してn代祖のIDを返す関数
 */
function makeFathersSireTree() {
  const sire_id = 4;
  console.log(SireGenerations.fetchPedigree(sire_id));

  // 関数を代入
  const sf = SireGenerations.fetchSire;

  const retArr = [
    [sire_id],
    [sf(sire_id, 1)],
    [sf(sf(sire_id, 1), 1), sf(sire_id, 2)],
    [sf(sf(sf(sire_id, 1), 1), 1), sf(sf(sire_id, 1), 2), sf(sf(sire_id, 2),1), sf(sire_id, 3)]
  ];
  console.log(retArr);

  // デバッグ用
  const namesArr = retArr.flat().map(v => SireInformation.fetchPhonetics(v));
  console.log(namesArr);

}
