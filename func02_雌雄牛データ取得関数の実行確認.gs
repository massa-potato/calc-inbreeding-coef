function verifySireFunctions() {
  /*
  使用可能な関数

  - SireInformationクラス
    - fetchName(sireId): 種雄牛のIDから漢字名を返す関数（見つからない場合は「-」を返す）
    - fetchPhonetics(sireId): 種雄牛のIDから読み仮名を返す関数（見つからない場合は「-」を返す）
    - fetchInbreedingCoef(sireId): 種雄牛のIDから近交係数を返す関数（見つからない場合&近交係数の値が空欄のときは0を返す）
    - fetchIdByName(name): 種雄牛の漢字名からIDを返す関数（見つからない場合はエラー送出）
    - fetchIdByPhonetics(phonetics): 種雄牛の読み仮名からIDを返す関数（見つからない場合はエラー送出）

  - SireGenerationsクラス
    - fetchPedigree(sireId): 種雄牛のIDからすべての血統情報の入った二次元配列を返す関数（見つからない場合はエラー送出）
    - fetchSire(sireId, n): 種雄牛のIDに対してn代祖のIDを返す関数（見つからない場合はエラー送出）
  */


  // sireIdから検索
  const sireId = 1;
  const n = 3;

  const name =  SireInformation.fetchName(sireId);
  const phonetics =  SireInformation.fetchPhonetics(sireId);
  const inbreedingCoef = SireInformation.fetchInbreedingCoef(sireId);

  const pedigreeArr = SireGenerations.fetchPedigree(1);

  const nGenSireId = SireGenerations.fetchSire(sireId, n)
  const nGenSireName = SireInformation.fetchName(nGenSireId);
  const nGenSirePhonetics = SireInformation.fetchPhonetics(nGenSireId);
  const nGenSireInbreedingCoef = SireInformation.fetchInbreedingCoef(nGenSireId);

  console.log(`ID ${sireId}「${name}（${phonetics}）」の近交係数は${inbreedingCoef}です。血統情報の一覧はこちら。`);
  console.log(pedigreeArr);
  console.log(`ID ${sireId}「${name}」について、${n}代祖の種雄牛を検索しました。\nID ${nGenSireId}「${nGenSireName}（${nGenSirePhonetics}）」で、近交係数は${nGenSireInbreedingCoef}です。`);


  // nameからsireIdを検索
  const name_a = '第七波丸';
  console.log(`「${name_a}」のIDは ${SireInformation.fetchIdByName(name_a)} です。`);


  // phoneticsからsireIdを検索
  const phonetics_a = 'だい7なみまる';
  console.log(`「${phonetics_a}」のIDは ${SireInformation.fetchIdByPhonetics(phonetics_a)} です`);

}